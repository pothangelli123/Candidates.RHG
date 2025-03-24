-- Simplified setup for resume storage without actual file uploads

-- Create a policy to allow public access to the candidates table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'candidates' AND policyname = 'Allow public access to candidates'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public access to candidates" ON public.candidates FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'candidates' AND policyname = 'Allow public insert to candidates'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public insert to candidates" ON public.candidates FOR INSERT WITH CHECK (true)';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'candidates' AND policyname = 'Allow public update to candidates'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public update to candidates" ON public.candidates FOR UPDATE USING (true)';
  END IF;
END $$;

-- Make sure RLS is enabled
ALTER TABLE IF EXISTS public.candidates ENABLE ROW LEVEL SECURITY;

-- Add any missing columns to the candidates table
DO $$ 
BEGIN
  -- Check if the table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'candidates'
  ) THEN
    CREATE TABLE public.candidates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      position TEXT NOT NULL,
      skills TEXT[] DEFAULT '{}',
      experience INTEGER DEFAULT 0,
      education TEXT,
      resume TEXT,
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );
    
    RETURN; -- Skip the rest if we just created the table
  END IF;

  -- Check if the skills column exists
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'skills'
  ) THEN
    -- Add skills column as text array if it doesn't exist
    ALTER TABLE public.candidates ADD COLUMN skills TEXT[] DEFAULT '{}';
  ELSE
    -- If skills exists but is not an array, try to convert it
    BEGIN
      ALTER TABLE public.candidates 
        ALTER COLUMN skills TYPE TEXT[] 
        USING CASE 
          WHEN skills IS NULL THEN '{}'::TEXT[]
          ELSE string_to_array(skills, ',')
        END;
    EXCEPTION WHEN OTHERS THEN
      -- If conversion fails, do nothing
      NULL;
    END;
  END IF;
  
  -- Add resume column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'resume'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN resume TEXT;
  END IF;
  
  -- Add experience column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'experience'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN experience INTEGER DEFAULT 0;
  END IF;
  
  -- Add education column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'education'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN education TEXT;
  END IF;
  
  -- Add notes column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN notes TEXT;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN status TEXT DEFAULT 'new';
  END IF;
  
  -- Add created_at column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS(
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'candidates' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());
  END IF;
END $$; 