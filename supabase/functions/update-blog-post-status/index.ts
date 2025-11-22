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
    const { postId, published } = await req.json();

    if (!postId || typeof published !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Post ID and published status are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Update the blog post status
    const updateData = {
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }

    console.log(`Blog post ${postId} ${published ? 'published' : 'unpublished'} successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: `Blog post ${published ? 'published' : 'unpublished'} successfully`
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Update blog post status error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});