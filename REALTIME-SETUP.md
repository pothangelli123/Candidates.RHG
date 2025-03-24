# Real-time Feature Setup Guide

This guide explains how to set up real-time features in the Candidate Tracker application.

## Enabling Real-time in Supabase

To enable real-time updates for candidates, you need to run the following SQL in the Supabase SQL Editor:

```sql
-- Enable real-time for candidates table
BEGIN;
  -- Drop publication if it exists already
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create publication for candidates table
  CREATE PUBLICATION supabase_realtime FOR TABLE candidates;
COMMIT;
```

This enables real-time change notifications for the candidates table.

## Setting Up Storage for Resumes

To store PDF resumes in Supabase Storage, run this SQL:

```sql
-- Create storage for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for admin users to upload resumes
CREATE POLICY "Admin users can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Allow users to view resumes
CREATE POLICY "Users can view resumes"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resumes'
);

-- Create policy for admin users to delete resume files
CREATE POLICY "Admin users can delete resumes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);
```

## Client-side Implementation

The client-side implementation of real-time updates is done in the `src/app/candidates/page.tsx` file. This component:

1. Fetches the initial candidates data
2. Sets up a real-time subscription to the candidates table
3. Updates the UI whenever a new candidate is added

The resume upload functionality is implemented in the `src/components/CandidateForm.tsx` file, which:

1. Validates the uploaded PDF file
2. Uploads it to the Supabase Storage 'resumes' bucket
3. Stores the file URL in the candidate record

## Testing Real-time Updates

To test real-time updates:

1. Open two browser windows/tabs
2. Navigate to the candidates list page in both
3. Add a new candidate from the admin dashboard
4. Observe that the new candidate appears in the candidates list in both windows/tabs without refreshing

This demonstrates that the real-time functionality is working correctly. 