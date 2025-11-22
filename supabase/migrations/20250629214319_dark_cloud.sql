/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, required)
      - `content` (text, required)
      - `excerpt` (text, optional)
      - `image_url` (text, optional)
      - `keywords` (text array, optional)
      - `published_at` (timestamp with time zone)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for public read access (published posts only)
    - Add policies for insert and update operations

  3. Performance
    - Add indexes for slug, published_at, and keywords
*/

-- Create the blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  image_url text,
  keywords text[],
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts USING btree (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_keywords ON blog_posts USING gin (keywords);

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
  DROP POLICY IF EXISTS "Enable insert for all users" ON blog_posts;
  DROP POLICY IF EXISTS "Enable update for all users" ON blog_posts;
  
  -- Create new policies
  CREATE POLICY "Enable read access for all users"
    ON blog_posts
    FOR SELECT
    TO public
    USING (published_at IS NOT NULL);

  CREATE POLICY "Enable insert for all users"
    ON blog_posts
    FOR INSERT
    TO public
    WITH CHECK (true);

  CREATE POLICY "Enable update for all users"
    ON blog_posts
    FOR UPDATE
    TO public
    USING (true);
END $$;