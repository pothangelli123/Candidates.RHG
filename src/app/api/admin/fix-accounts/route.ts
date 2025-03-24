import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // First, make sure the profiles table exists
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY,
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
      console.error('Error creating profiles table:', tableError);
    }
    
    // Get all users from auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    const fixedUsers = [];
    
    // For each user, ensure they have a profile with admin privileges
    for (const user of users.users) {
      try {
        // First try to update any existing profiles with normal insert method
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0],
            is_admin: true
          });
          
        if (updateError) {
          // If it fails, use raw SQL
          await supabase.rpc('exec_sql', {
            sql: `
              INSERT INTO profiles (id, full_name, is_admin)
              VALUES ('${user.id}', '${user.user_metadata.full_name || user.email?.split('@')[0] || 'Admin User'}', TRUE)
              ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;
            `
          });
        }
        
        fixedUsers.push({
          id: user.id,
          email: user.email,
          fixed: true
        });
      } catch (error: any) {
        console.error(`Error fixing user ${user.id}:`, error);
        fixedUsers.push({
          id: user.id,
          email: user.email,
          fixed: false,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedUsers.filter(u => u.fixed).length} out of ${fixedUsers.length} users`,
      users: fixedUsers
    });
  } catch (error: any) {
    console.error('Error fixing accounts:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fix admin accounts' },
      { status: 500 }
    );
  }
} 