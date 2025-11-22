import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get all posts using service role to bypass RLS
    const { data: allPosts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('id, title, slug, published_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    console.log(`Found ${allPosts?.length || 0} posts total`);

    return new Response(
      JSON.stringify({ 
        success: true,
        totalPosts: allPosts?.length || 0,
        posts: allPosts?.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          published: post.published_at !== null,
          created: post.created_at
        })) || []
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Debug posts error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});