import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    const supabase = getSupabaseClient();
    
    // Step 1: Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) throw authError;
    
    // Step 2: Check if user has a profile and create or update it if needed
    try {
      // First check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      // If profile doesn't exist or isn't admin, let's create/update it
      if (profileError || !profileData || !profileData.is_admin) {
        // Grant admin access by updating or creating profile
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            is_admin: true,
            email: authData.user.email,  // Make sure email is set
            full_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Admin', // Use available name data
          }, {
            onConflict: 'id'
          });
        
        if (upsertError) {
          console.error('Error updating profile with ORM:', upsertError);
          // Fallback to SQL if ORM method fails
          await supabase.rpc('exec_sql', {
            sql: `
              INSERT INTO profiles (id, is_admin, email)
              VALUES ('${authData.user.id}', TRUE, '${authData.user.email}')
              ON CONFLICT (id) DO UPDATE SET is_admin = TRUE, email = '${authData.user.email}';
            `
          });
        }
      }
    } catch (err) {
      console.error('Error ensuring admin profile:', err);
      // Continue login process even if profile update fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin logged in successfully',
      user: authData.user
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Invalid credentials' },
      { status: 401 }
    );
  }
} 