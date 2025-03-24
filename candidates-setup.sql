-- This file contains SQL that should be run in Supabase SQL Editor to set up the candidates table

-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  experience INTEGER NOT NULL,
  education TEXT NOT NULL,
  resume TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'reviewing', 'interviewed', 'offer', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Set up Row Level Security for candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view candidates
CREATE POLICY "Anyone can view candidates"
ON public.candidates FOR SELECT
USING (true);

-- Create policy to allow authenticated admin users to insert candidates
CREATE POLICY "Admin users can insert candidates"
ON public.candidates FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
));

-- Create policy to allow authenticated admin users to update candidates
CREATE POLICY "Admin users can update candidates"
ON public.candidates FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
));

-- Create policy to allow authenticated admin users to delete candidates
CREATE POLICY "Admin users can delete candidates"
ON public.candidates FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
));

-- Create function to automatically update the updated_at column when a candidate is updated
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a candidate is updated
DROP TRIGGER IF EXISTS candidates_updated_at ON public.candidates;
CREATE TRIGGER candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 