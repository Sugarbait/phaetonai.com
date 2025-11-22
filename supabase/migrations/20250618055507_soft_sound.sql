/*
  # Fix RLS policies for analytics_hourly_stats table

  1. Security Changes
    - Drop existing restrictive policies on `analytics_hourly_stats` table
    - Add proper INSERT and UPDATE policies to support upsert operations
    - Ensure anonymous users can perform both INSERT and UPDATE operations needed for analytics tracking

  2. Changes Made
    - Remove existing policies that may be blocking upsert operations
    - Add new policies that allow anonymous users to insert and update hourly stats
    - Maintain data integrity while allowing necessary analytics operations
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Enable insert for all users" ON analytics_hourly_stats;
DROP POLICY IF EXISTS "Enable select for all users" ON analytics_hourly_stats;
DROP POLICY IF EXISTS "Enable update for all users" ON analytics_hourly_stats;

-- Create new policies that properly support upsert operations
CREATE POLICY "Allow insert for analytics tracking"
  ON analytics_hourly_stats
  FOR INSERT
  TO anon, public
  WITH CHECK (true);

CREATE POLICY "Allow update for analytics tracking"
  ON analytics_hourly_stats
  FOR UPDATE
  TO anon, public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow select for analytics tracking"
  ON analytics_hourly_stats
  FOR SELECT
  TO anon, public
  USING (true);