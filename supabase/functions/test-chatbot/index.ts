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
    const requestBody = await req.json();
    const message = requestBody.message || requestBody.chatInput;
    
    console.log('🔥 TEST-CHATBOT FUNCTION CALLED');
    console.log('📨 Message received:', message);
    console.log('📦 Full request body:', JSON.stringify(requestBody));
    
    // For ANY message containing "cost", return a simple direct response
    if (message && message.toLowerCase().includes('cost')) {
      console.log('💰 COST QUESTION DETECTED - RETURNING DIRECT ANSWER');
      
      const response = `TEST FUNCTION WORKING! You asked about cost: "${message}". 
      
Our rate is 0.16 cents per minute. This is a DIRECT answer from the enhanced-chatbot function, NOT from n8n tally sheet.`;
      
      return new Response(
        JSON.stringify({ 
          output: response,
          response: response,
          source: 'direct-answer-test'
        }),
        { headers: corsHeaders }
      );
    }
    
    // For other messages, still return a simple response
    const response = `Test function received: "${message}"`;
    
    return new Response(
      JSON.stringify({ 
        output: response,
        response: response,
        source: 'test-function'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Test function error:', error);
    
    return new Response(
      JSON.stringify({ 
        output: "Test function error occurred",
        response: "Test function error occurred",
        source: 'error'
      }),
      { headers: corsHeaders }
    );
  }
});