/*
  # Create blog_posts table for AI-generated articles

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `content` (text, not null)
      - `excerpt` (text)
      - `image_url` (text)
      - `keywords` (text array)
      - `published_at` (timestamp with time zone)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for selecting and inserting blog posts

  3. Performance
    - Add indexes for common queries
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  keywords text[],
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_keywords ON blog_posts USING GIN(keywords);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for public access
CREATE POLICY "Enable read access for all users" ON blog_posts
  FOR SELECT
  TO public
  USING (published_at IS NOT NULL);

-- Policy for inserting new posts
CREATE POLICY "Enable insert for all users" ON blog_posts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for updating posts
CREATE POLICY "Enable update for all users" ON blog_posts
  FOR UPDATE
  TO public
  USING (true);