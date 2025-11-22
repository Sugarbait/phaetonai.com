import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('🧪 Testing blog generation - calling generate-blog-post function directly');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Call the generate-blog-post function with auto-publish disabled for testing
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-blog-post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        autoPublish: false, // Don't publish, just generate for testing
        triggeredBy: 'test_function'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Blog generation failed: ${response.status} - ${errorText}`);
      throw new Error(`Blog generation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Blog generation test successful');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test generation completed',
        testResult: {
          title: result.title,
          contentPreview: result.content ? result.content.substring(0, 500) + '...' : 'No content',
          wordCount: result.wordCount,
          hasUniqueness: !result.content?.includes('Understanding the Technology Landscape')
        },
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Test generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Test failed',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});