import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, designation, phone } = await req.json();
    
    const supabase = getSupabaseClient();
    
    // Create profiles table if it doesn't exist
    try {
      await supabase.rpc('create_profiles_table_if_not_exists', {
        create_sql: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY,
            email TEXT,
            full_name TEXT,
            designation TEXT,
            phone TEXT,
            is_admin BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      });
    } catch (tableError) {
      console.log('Error trying to create profiles table (might already exist):', tableError);
      // Continue with signup process even if table creation fails
    }
    
    // Step 1: Get user data if they were created in the client-side signup
    let userData = null;
    
    try {
      // Check if the user already exists (created by client-side signup)
      const { data: existingData, error: userError } = await supabase.auth.admin.listUsers();
      const existingUser = existingData?.users.find(u => u.email === email);
      
      if (existingUser) {
        userData = existingUser;
      }
    } catch (err) {
      console.log('Error checking existing user:', err);
    }
    
    // If user wasn't found or created on client side, create them server-side
    if (!userData) {
      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          is_admin: true,
          designation,
          phone
        }
      });
      
      if (authError) throw authError;
      userData = authData.user;
    }
    
    if (!userData) {
      throw new Error("Failed to find or create user");
    }
    
    // Step 2: Create admin profile
    try {
      // First attempt with upsert - ALWAYS set is_admin to true
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id,
          email: userData.email,
          full_name: name,
          designation,
          phone,
          is_admin: true
        }, {
          onConflict: 'id'
        });
      
      if (upsertError) {
        console.error('Error upserting profile with ORM:', upsertError);
        // If that fails, try with direct SQL
        const { error: rawSqlError } = await supabase.rpc('exec_sql', {
          sql: `
            INSERT INTO profiles (id, email, full_name, designation, phone, is_admin)
            VALUES ('${userData.id}', '${userData.email}', '${name}', '${designation}', '${phone}', TRUE)
            ON CONFLICT (id) DO UPDATE SET 
              email = '${userData.email}',
              full_name = '${name}', 
              designation = '${designation}', 
              phone = '${phone}', 
              is_admin = TRUE;
          `
        });
        
        if (rawSqlError) throw rawSqlError;
      }
    } catch (profileError) {
      console.error('Error creating profile:', profileError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      userId: userData.id
    });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create admin account' },
      { status: 500 }
    );
  }
} 