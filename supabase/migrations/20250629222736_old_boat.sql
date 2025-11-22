/*
  # Update blog posts table to support proper draft/published status

  1. Changes
    - Modify published_at column to allow NULL values for draft posts
    - Update RLS policies to only show published posts to public
    - Add DELETE policy for admin management

  2. Security
    - Published posts have published_at set to a timestamp
    - Draft posts have published_at set to NULL
    - Public can only see posts where published_at IS NOT NULL
*/

-- Allow published_at to be NULL for draft posts
ALTER TABLE blog_posts ALTER COLUMN published_at DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN published_at DROP DEFAULT;

-- Update the RLS policy to only show published posts to public
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
CREATE POLICY "Enable read access for all users"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published_at IS NOT NULL);

-- Add DELETE policy for admin management
DROP POLICY IF EXISTS "Enable delete for all users" ON blog_posts;
CREATE POLICY "Enable delete for all users"
  ON blog_posts
  FOR DELETE
  TO public
  USING (true);