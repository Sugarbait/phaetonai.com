/*
  # Create blog images storage bucket

  1. Storage Setup
    - Create blog-images bucket for permanent image storage
    - Set up public read access for blog images
    - Configure upload permissions for authenticated users and service role
    - Set file size limit to 10MB
    - Restrict to image file types only

  2. Security Policies
    - Public read access to all blog images
    - Authenticated users can upload images
    - Service role can upload and delete images for AI generation
*/

-- Create the blog-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Service role can upload blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Service role can delete blog images" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    -- Policies don't exist, continue
    NULL;
END $$;

-- Allow public read access to blog images
CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload blog images
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow service role to upload blog images (for AI generation)
CREATE POLICY "Service role can upload blog images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'blog-images');

-- Allow service role to delete blog images if needed
CREATE POLICY "Service role can delete blog images"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'blog-images');

-- Allow service role to update blog images if needed
CREATE POLICY "Service role can update blog images"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'blog-images');