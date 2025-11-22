/*
  # Add DELETE policy for blog posts

  1. Security Changes
    - Add DELETE policy for blog posts to allow admin deletion
    - Ensure all CRUD operations are properly supported

  2. Policy Details
    - Allow public DELETE operations on blog_posts table
    - This enables admin users to delete posts through the interface
*/

-- Add DELETE policy for blog posts
DO $$ 
BEGIN
  -- Drop existing DELETE policy if it exists
  DROP POLICY IF EXISTS "Enable delete for all users" ON blog_posts;
  
  -- Create new DELETE policy
  CREATE POLICY "Enable delete for all users"
    ON blog_posts
    FOR DELETE
    TO public
    USING (true);
END $$;