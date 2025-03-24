-- This file contains SQL that should be run in Supabase SQL Editor to set up the database

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  designation TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Create policy to allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create policy to allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create a function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', TRUE);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to insert admin profile
CREATE OR REPLACE FUNCTION public.insert_admin_profile(
  user_id_param UUID,
  full_name_param TEXT,
  designation_param TEXT,
  phone_param TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, designation, phone, is_admin)
  VALUES (user_id_param, full_name_param, designation_param, phone_param, TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to execute arbitrary SQL - useful for database initialization
CREATE OR REPLACE FUNCTION public.exec_sql(sql text) 
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing accounts to have admin privileges
UPDATE public.profiles SET is_admin = TRUE WHERE is_admin = FALSE; 