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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Testing cron availability...');
    
    const results: any = {
      cronFunctionsAvailable: false,
      pgCronExtensionAvailable: false,
      errorMessages: []
    };
    
    // Test if get_cron_jobs function exists
    try {
      const { data: jobs, error: jobsError } = await supabase.rpc('get_cron_jobs');
      if (jobsError) {
        results.errorMessages.push(`get_cron_jobs error: ${jobsError.message}`);
      } else {
        results.cronFunctionsAvailable = true;
        results.currentJobs = jobs;
      }
    } catch (error) {
      results.errorMessages.push(`get_cron_jobs exception: ${error}`);
    }

    // Test if we can directly query the cron schema (this will fail if pg_cron is not available)
    try {
      const { data: cronJobs, error: cronError } = await supabase
        .from('cron.job')
        .select('*')
        .limit(1);
        
      if (cronError) {
        results.errorMessages.push(`Direct cron.job query error: ${cronError.message}`);
      } else {
        results.pgCronExtensionAvailable = true;
      }
    } catch (error) {
      results.errorMessages.push(`Direct cron query exception: ${error}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cron availability test completed',
        results,
        recommendations: results.cronFunctionsAvailable && results.pgCronExtensionAvailable 
          ? 'All cron features should work'
          : 'Cron features may not work - pg_cron extension or functions missing',
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Test error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});