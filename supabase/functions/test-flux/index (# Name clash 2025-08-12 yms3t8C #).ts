import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BLACK_FOREST_API_KEY = Deno.env.get('BLACK_FOREST_API_KEY');
    console.log('Environment check:');
    console.log('- BLACK_FOREST_API_KEY available:', !!BLACK_FOREST_API_KEY);
    console.log('- API key length:', BLACK_FOREST_API_KEY ? BLACK_FOREST_API_KEY.length : 'undefined');
    
    const apiKey = BLACK_FOREST_API_KEY || '475ca923d6ac8f0e6c50a0ceddda4cc66502d052b0093ba0eb34f1419';
    console.log('Using API key (first 10 chars):', apiKey.substring(0, 10) + '...');

    console.log('Testing Black Forest API...');
    
    // Use correct API endpoint from docs
    const response = await fetch('https://api.bfl.ai/v1/flux-pro-1.1', {
      method: 'POST',
      headers: {
        'x-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "A simple test image of a blue circle on white background",
        aspect_ratio: "1:1"
      }),
    });

    console.log('Black Forest API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `API returned ${response.status}: ${errorText}`,
          apiKeyUsed: apiKey.substring(0, 10) + '...'
        }),
        { headers: corsHeaders }
      );
    }

    const initialResult = await response.json();
    console.log('Initial API Response:', initialResult);

    // Check if we got a polling URL
    if (initialResult.polling_url) {
      console.log('Got polling URL, starting to poll...');
      
      // Poll for the result
      let attempts = 0;
      const maxAttempts = 60; // 30 seconds max
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        attempts++;
        
        const pollResponse = await fetch(initialResult.polling_url, {
          headers: { 'x-key': apiKey }
        });
        
        if (!pollResponse.ok) {
          const pollErrorText = await pollResponse.text();
          console.error('Polling Error:', pollResponse.status, pollErrorText);
          break;
        }
        
        const pollResult = await pollResponse.json();
        console.log(`Poll attempt ${attempts}:`, pollResult);
        
        if (pollResult.status === 'Ready') {
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'Black Forest API test successful with polling',
              hasImageUrl: !!pollResult.result?.sample,
              imageUrl: pollResult.result?.sample || 'No image URL',
              apiKeyUsed: apiKey.substring(0, 10) + '...',
              attempts: attempts
            }),
            { headers: corsHeaders }
          );
        } else if (pollResult.status === 'Error' || pollResult.status === 'Failed') {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: `Generation failed: ${JSON.stringify(pollResult)}`,
              apiKeyUsed: apiKey.substring(0, 10) + '...'
            }),
            { headers: corsHeaders }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Polling timed out after 30 seconds',
          apiKeyUsed: apiKey.substring(0, 10) + '...'
        }),
        { headers: corsHeaders }
      );
    } else {
      // Direct response (old API behavior)
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Black Forest API test successful (direct response)',
          hasImageUrl: !!initialResult.result?.sample,
          imageUrl: initialResult.result?.sample || 'No image URL',
          apiKeyUsed: apiKey.substring(0, 10) + '...'
        }),
        { headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('Test error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});