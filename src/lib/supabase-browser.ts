'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

// Create a client-side Supabase client
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

let browserClient: ReturnType<typeof createClient> | null = null;

// Get the browser client singleton
export const getBrowserClient = () => {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
};

// Get current user from session
export const getCurrentUser = async () => {
  const supabase = getBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Sign out
export const signOut = async () => {
  const supabase = getBrowserClient();
  return await supabase.auth.signOut();
};

// Get profile data
export const getProfileData = async (userId: string) => {
  const supabase = getBrowserClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}; 