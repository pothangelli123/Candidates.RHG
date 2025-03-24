# Database Setup Guide

This guide will help you set up the database for the Candidates application using Supabase.

## Setup using SQL Editor

1. Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Open your project
3. Go to the SQL Editor in the left sidebar
4. Create a new query named "Setup Candidates DB"
5. Copy and paste the contents of `db-setup.sql` from this repository into the SQL Editor
6. Run the query to set up all necessary tables and triggers
7. Create another query named "Setup Candidates Table"
8. Copy and paste the contents of `candidates-setup.sql` from this repository into the SQL Editor
9. Run the query to set up the candidates table, RLS policies, and triggers

## Tables Structure

### profiles

This table stores information about admin users who can manage the candidate application.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users(id) |
| full_name | TEXT | Full name of the user |
| designation | TEXT | Job title or role |
| phone | TEXT | Phone number |
| is_admin | BOOLEAN | Whether the user has admin privileges |
| created_at | TIMESTAMP | When the record was created |
| updated_at | TIMESTAMP | When the record was last updated |

### candidates

This table stores information about job candidates.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Full name of the candidate |
| email | TEXT | Email address |
| phone | TEXT | Phone number (optional) |
| position | TEXT | Position applied for |
| skills | TEXT[] | Array of skills |
| experience | INTEGER | Years of experience |
| education | TEXT | Education details |
| resume | TEXT | Resume URL (optional) |
| status | TEXT | Application status (new, reviewing, interviewed, offer, rejected) |
| notes | TEXT | Additional notes (optional) |
| created_at | TIMESTAMP | When the record was created |
| updated_at | TIMESTAMP | When the record was last updated |

## First-time Setup

After setting up the database, you need to:

1. Create your first admin user by signing up through the application.
2. The signup process should automatically create a profile record with admin privileges.
3. If you encounter any issues, you can use the SQL Editor to manually:
   - Set `is_admin = true` for your user in the profiles table
   - Create a profile record if one wasn't created automatically

```sql
-- Example: Manually grant admin privileges
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-auth-user-id';

-- Example: Manually create a profile if needed
INSERT INTO profiles (id, full_name, is_admin) 
VALUES ('your-auth-user-id', 'Your Name', true);
```

## Troubleshooting

If you encounter issues with login or signup:

1. Visit `/api/setup-db` in your deployed application to run the database setup script
2. Check your browser console for any error messages
3. Check the Supabase logs in the dashboard under "Database" > "Logs"
4. Verify that the `profiles` table exists and has the correct structure
5. Make sure your AUTH settings in Supabase allow email signup and login 