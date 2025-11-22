import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating test blog post...');

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Create unique slug with timestamp
    const uniqueSlug = `test-post-${Date.now()}`;
    
    const testPost = {
      title: `Test Blog Post - ${new Date().toLocaleString()}`,
      slug: uniqueSlug,
      content: `
        <h2>Test Blog Post Content</h2>
        <p>This is a test blog post created to test the unpublish functionality. This post contains sample content to demonstrate the blog system.</p>
        
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Manual Creation:</strong> This post was created manually to bypass AI generation issues</li>
          <li><strong>Unique Slug:</strong> Uses timestamp-based slug generation</li>
          <li><strong>Test Content:</strong> Sample content for testing purposes</li>
        </ul>
        
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      `,
      excerpt: 'A test blog post created to test the unpublish functionality and demonstrate the blog system.',
      image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      keywords: ['test', 'blog', 'functionality'],
      published_at: null, // Create as unpublished
      ai_generated: false,
      generation_method: 'manual'
    };

    // Insert the test post
    const { data: newPost, error } = await supabaseAdmin
      .from('blog_posts')
      .insert(testPost)
      .select()
      .single();

    if (error) {
      console.error('Error creating test post:', error);
      throw new Error(`Failed to create test post: ${error.message}`);
    }

    console.log('Test post created successfully:', newPost.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        post: {
          id: newPost.id,
          title: newPost.title,
          slug: newPost.slug,
          published: false
        },
        message: 'Test post created successfully'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Create test post error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});