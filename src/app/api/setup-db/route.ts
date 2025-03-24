import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // Check if the profiles table exists and create it if it doesn't
    const { data: tableExists, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public')
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for profiles table:', checkError);
    }
    
    if (!tableExists) {
      // Create the profiles table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY,
            user_id UUID,
            full_name TEXT,
            designation TEXT,
            phone TEXT,
            is_admin BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
          
          -- Add RLS policies
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
          
          -- Create policy to allow users to update their own profile
          CREATE POLICY "Users can view their own profile"
            ON public.profiles FOR SELECT
            USING (auth.uid() = id);
            
          CREATE POLICY "Users can update their own profile"
            ON public.profiles FOR UPDATE
            USING (auth.uid() = id);
            
          CREATE POLICY "Users can insert their own profile"
            ON public.profiles FOR INSERT
            WITH CHECK (auth.uid() = id);
        `
      });
      
      if (createError) {
        console.error('Error creating profiles table:', createError);
        return NextResponse.json(
          { success: false, message: 'Failed to create profiles table' },
          { status: 500 }
        );
      }
      
      console.log('Profiles table created successfully!');
    }
    
    // Update existing accounts to have admin privileges
    try {
      const { error: updateError } = await supabase.rpc('exec_sql', {
        sql: `
          UPDATE public.profiles SET is_admin = TRUE WHERE is_admin = FALSE;
        `
      });
      
      if (updateError) {
        console.error('Error updating existing accounts:', updateError);
      } else {
        console.log('Existing accounts updated successfully!');
      }
    } catch (updateError) {
      console.error('Error updating existing accounts:', updateError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully, all users are now admins',
      tableExists: !!tableExists
    });
  } catch (error: any) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database setup failed' },
      { status: 500 }
    );
  }
} 