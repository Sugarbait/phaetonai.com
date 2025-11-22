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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    console.log('Starting scheduled knowledge base scan...');

    // Call the website scanning function
    const scanResponse = await fetch(`${supabaseUrl}/functions/v1/scan-website-knowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ scheduled: true })
    });

    const scanResult = await scanResponse.json();

    if (!scanResponse.ok) {
      throw new Error(`Scan failed: ${scanResult.error || 'Unknown error'}`);
    }

    console.log('Scheduled knowledge scan completed:', scanResult);

    // Optional: Send notification if there were significant changes
    if (scanResult.results && (scanResult.results.pages_updated > 5 || scanResult.results.pages_added > 3)) {
      console.log('Significant changes detected, consider notifying team');
      
      // You could add email notification logic here
      // or webhook to notify your team of major content changes
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Scheduled knowledge scan completed successfully',
        scan_results: scanResult.results,
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Scheduled knowledge scan error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});