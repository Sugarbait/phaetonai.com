/*
  # Create analytics tables for persistent data storage

  1. New Tables
    - `analytics_visitors` - Store unique visitor sessions
    - `analytics_page_views` - Store page view data
    - `analytics_geolocations` - Store visitor location data
    - `analytics_hourly_stats` - Store hourly visitor statistics

  2. Security
    - Enable RLS on all analytics tables
    - Add policies for inserting and selecting analytics data
*/

-- Analytics visitors table
CREATE TABLE IF NOT EXISTS analytics_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  date_visited date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Analytics page views table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  date_viewed date NOT NULL DEFAULT CURRENT_DATE,
  view_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics geolocation data
CREATE TABLE IF NOT EXISTS analytics_geolocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  country text,
  country_code text,
  region text,
  city text,
  timezone text,
  latitude decimal,
  longitude decimal,
  isp text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Analytics hourly statistics
CREATE TABLE IF NOT EXISTS analytics_hourly_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_hour date NOT NULL,
  hour_of_day integer NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date_hour, hour_of_day, session_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_date ON analytics_visitors(date_visited);
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_session ON analytics_visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_date ON analytics_page_views(date_viewed);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_path ON analytics_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_geolocations_session ON analytics_geolocations(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_geolocations_country ON analytics_geolocations(country);
CREATE INDEX IF NOT EXISTS idx_analytics_hourly_date_hour ON analytics_hourly_stats(date_hour, hour_of_day);

-- Enable RLS
ALTER TABLE analytics_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_geolocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_hourly_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (analytics data)
CREATE POLICY "Enable insert for all users" ON analytics_visitors
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON analytics_visitors
  FOR SELECT TO public USING (true);

CREATE POLICY "Enable insert for all users" ON analytics_page_views
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON analytics_page_views
  FOR SELECT TO public USING (true);

CREATE POLICY "Enable update for all users" ON analytics_page_views
  FOR UPDATE TO public USING (true);

CREATE POLICY "Enable insert for all users" ON analytics_geolocations
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON analytics_geolocations
  FOR SELECT TO public USING (true);

CREATE POLICY "Enable insert for all users" ON analytics_hourly_stats
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON analytics_hourly_stats
  FOR SELECT TO public USING (true);