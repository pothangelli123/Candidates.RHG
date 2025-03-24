import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// For better debugging - log whether env vars are found
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create a Supabase client for server components
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing Supabase credentials. URL: ${supabaseUrl ? 'OK' : 'MISSING'}, Key: ${supabaseKey ? 'OK' : 'MISSING'}`);
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// Initialize Supabase schema - run this function at app startup
export const initializeDatabase = async () => {
  try {
    const supabase = getSupabaseClient();
    
    // Check if profiles table exists
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error && error.code === '42P01') {  // "relation does not exist" Postgres error
      console.log('Creating profiles table...');
      
      // Create profiles table
      const { error: createError } = await supabase.rpc('create_profiles_table');
      
      if (createError) {
        console.error('Error creating profiles table:', createError);
      } else {
        console.log('Profiles table created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}; 