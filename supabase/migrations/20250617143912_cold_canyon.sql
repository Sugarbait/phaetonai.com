/*
  # Create analytics tables for website tracking

  1. New Tables
    - `analytics_visitors` - Track unique visitor sessions
    - `analytics_page_views` - Track page view counts
    - `analytics_geolocations` - Track visitor location data
    - `analytics_hourly_stats` - Track hourly visitor statistics

  2. Security
    - Enable RLS on all analytics tables
    - Add policies for public access to analytics data

  3. Indexes
    - Add performance indexes for common queries
*/

-- Create analytics_visitors table
CREATE TABLE IF NOT EXISTS analytics_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  date_visited date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  date_viewed date NOT NULL DEFAULT CURRENT_DATE,
  view_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics_geolocations table
CREATE TABLE IF NOT EXISTS analytics_geolocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  country text,
  country_code text,
  region text,
  city text,
  timezone text,
  latitude numeric,
  longitude numeric,
  isp text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Create analytics_hourly_stats table
CREATE TABLE IF NOT EXISTS analytics_hourly_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_hour date NOT NULL,
  hour_of_day integer NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint for analytics_hourly_stats
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'analytics_hourly_stats' 
    AND constraint_name = 'analytics_hourly_stats_date_hour_hour_of_day_session_id_key'
  ) THEN
    ALTER TABLE analytics_hourly_stats 
    ADD CONSTRAINT analytics_hourly_stats_date_hour_hour_of_day_session_id_key 
    UNIQUE (date_hour, hour_of_day, session_id);
  END IF;
END $$;

-- Add unique constraint for newsletter_subscriptions email if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_subscriptions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_name = 'newsletter_subscriptions' 
      AND constraint_name = 'newsletter_subscriptions_email_key'
    ) THEN
      ALTER TABLE newsletter_subscriptions 
      ADD CONSTRAINT newsletter_subscriptions_email_key 
      UNIQUE (email);
    END IF;
  END IF;
END $$;

-- Create indexes for analytics_visitors
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_session ON analytics_visitors (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_date ON analytics_visitors (date_visited);

-- Create indexes for analytics_page_views
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_path ON analytics_page_views (page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_date ON analytics_page_views (date_viewed);

-- Create indexes for analytics_geolocations
CREATE INDEX IF NOT EXISTS idx_analytics_geolocations_session ON analytics_geolocations (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_geolocations_country ON analytics_geolocations (country);

-- Create indexes for analytics_hourly_stats
CREATE INDEX IF NOT EXISTS idx_analytics_hourly_date_hour ON analytics_hourly_stats (date_hour, hour_of_day);

-- Create index for newsletter_subscriptions if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_subscriptions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'newsletter_subscriptions' 
      AND indexname = 'idx_newsletter_subscriptions_email'
    ) THEN
      CREATE INDEX idx_newsletter_subscriptions_email ON newsletter_subscriptions (email);
    END IF;
  END IF;
END $$;

-- Enable RLS on all analytics tables
ALTER TABLE analytics_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_geolocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_hourly_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DO $$
BEGIN
  -- Drop existing policies for analytics_visitors
  DROP POLICY IF EXISTS "Enable insert for all users" ON analytics_visitors;
  DROP POLICY IF EXISTS "Enable select for all users" ON analytics_visitors;
  
  -- Create new policies for analytics_visitors
  CREATE POLICY "Enable insert for all users" ON analytics_visitors
    FOR INSERT TO public WITH CHECK (true);
  CREATE POLICY "Enable select for all users" ON analytics_visitors
    FOR SELECT TO public USING (true);
END $$;

DO $$
BEGIN
  -- Drop existing policies for analytics_page_views
  DROP POLICY IF EXISTS "Enable insert for all users" ON analytics_page_views;
  DROP POLICY IF EXISTS "Enable select for all users" ON analytics_page_views;
  DROP POLICY IF EXISTS "Enable update for all users" ON analytics_page_views;
  
  -- Create new policies for analytics_page_views
  CREATE POLICY "Enable insert for all users" ON analytics_page_views
    FOR INSERT TO public WITH CHECK (true);
  CREATE POLICY "Enable select for all users" ON analytics_page_views
    FOR SELECT TO public USING (true);
  CREATE POLICY "Enable update for all users" ON analytics_page_views
    FOR UPDATE TO public USING (true);
END $$;

DO $$
BEGIN
  -- Drop existing policies for analytics_geolocations
  DROP POLICY IF EXISTS "Enable insert for all users" ON analytics_geolocations;
  DROP POLICY IF EXISTS "Enable select for all users" ON analytics_geolocations;
  
  -- Create new policies for analytics_geolocations
  CREATE POLICY "Enable insert for all users" ON analytics_geolocations
    FOR INSERT TO public WITH CHECK (true);
  CREATE POLICY "Enable select for all users" ON analytics_geolocations
    FOR SELECT TO public USING (true);
END $$;

DO $$
BEGIN
  -- Drop existing policies for analytics_hourly_stats
  DROP POLICY IF EXISTS "Enable insert for all users" ON analytics_hourly_stats;
  DROP POLICY IF EXISTS "Enable select for all users" ON analytics_hourly_stats;
  
  -- Create new policies for analytics_hourly_stats
  CREATE POLICY "Enable insert for all users" ON analytics_hourly_stats
    FOR INSERT TO public WITH CHECK (true);
  CREATE POLICY "Enable select for all users" ON analytics_hourly_stats
    FOR SELECT TO public USING (true);
END $$;