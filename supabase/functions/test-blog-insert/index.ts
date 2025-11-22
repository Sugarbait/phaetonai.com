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
    console.log('🧪 Testing blog post insert functionality');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    console.log('✅ Supabase credentials available');
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Test table structure query
    console.log('🔍 Checking blog_posts table structure...');
    const { data: tableInfo, error: tableError } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table query error:', tableError);
      throw new Error(`Table access error: ${tableError.message}`);
    }

    console.log('✅ Table accessible, sample structure:', tableInfo);

    // Test a simple insert
    const testPost = {
      title: 'Test Post - AI Token Update',
      slug: `test-post-${Date.now()}`,
      content: '<h2>Test Content</h2><p>This is a test post to verify database insert functionality after token limit updates. The content needs to be substantial enough to test the system properly. This is just a test to ensure our database schema is working correctly with the updated token limits.</p>',
      excerpt: 'Test post to verify database functionality',
      image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      keywords: ['test', 'AI', 'verification'],
      published_at: new Date().toISOString(),
      ai_generated: true,
      generation_method: 'test'
    };

    console.log('📝 Attempting test insert...');
    const { data: newPost, error: insertError } = await supabaseClient
      .from('blog_posts')
      .insert(testPost)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error details:', insertError);
      throw new Error(`Insert failed: ${insertError.message} | Code: ${insertError.code} | Details: ${insertError.details}`);
    }

    console.log('✅ Test post inserted successfully:', newPost.id);

    // Clean up the test post
    const { error: deleteError } = await supabaseClient
      .from('blog_posts')
      .delete()
      .eq('id', newPost.id);

    if (deleteError) {
      console.warn('⚠️ Failed to clean up test post:', deleteError.message);
    } else {
      console.log('✅ Test post cleaned up successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Database insert test completed successfully',
        testPostId: newPost.id,
        tableStructure: tableInfo,
        cleanedUp: !deleteError
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});