import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log('🧪 Simple test function called');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test function working',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: corsHeaders 
      }
    );

  } catch (error) {
    console.error('❌ Test error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Test failed',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
});