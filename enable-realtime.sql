-- Enable real-time for candidates table
BEGIN;
  -- Drop publication if it exists already
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create publication for candidates table
  CREATE PUBLICATION supabase_realtime FOR TABLE candidates;
COMMIT; 