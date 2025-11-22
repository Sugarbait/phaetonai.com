/*
  # Fix analytics_hourly_stats RLS policy

  1. Security
    - Drop existing INSERT policy if it exists
    - Add INSERT policy for public role on analytics_hourly_stats table
*/

-- Drop the policy if it exists (ignore errors if it doesn't exist)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert for all users" ON analytics_hourly_stats;
EXCEPTION
  WHEN undefined_object THEN
    -- Policy doesn't exist, continue
    NULL;
END $$;

-- Create the INSERT policy for public role
CREATE POLICY "Enable insert for all users"
  ON analytics_hourly_stats
  FOR INSERT
  TO public
  WITH CHECK (true);