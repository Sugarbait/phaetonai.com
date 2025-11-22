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
    
    console.log('Debugging cron jobs...');
    
    const debugResults: any = {};
    
    // Try to get all cron jobs using our filtered function
    try {
      const { data: filteredJobs, error: filteredError } = await supabase.rpc('get_cron_jobs');
      debugResults.filteredJobs = {
        data: filteredJobs,
        error: filteredError?.message
      };
    } catch (error) {
      debugResults.filteredJobs = { error: `Exception: ${error}` };
    }

    // Try to create a custom function to get ALL cron jobs (not filtered)
    try {
      const getAllJobsFunction = `
        CREATE OR REPLACE FUNCTION debug_get_all_cron_jobs()
        RETURNS TABLE (
          jobid bigint,
          jobname text,
          schedule text,
          command text,
          active boolean,
          database text,
          username text
        ) 
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY 
          SELECT 
            j.jobid,
            j.jobname,
            j.schedule,
            j.command,
            j.active,
            j.database,
            j.username
          FROM cron.job j
          ORDER BY j.jobname;
        END;
        $$;
        
        GRANT EXECUTE ON FUNCTION debug_get_all_cron_jobs() TO authenticated;
      `;
      
      const { error: createError } = await supabase.rpc('sql', { query: getAllJobsFunction });
      
      if (!createError) {
        const { data: allJobs, error: allJobsError } = await supabase.rpc('debug_get_all_cron_jobs');
        debugResults.allJobs = {
          data: allJobs,
          error: allJobsError?.message
        };
      } else {
        debugResults.allJobs = { error: `Could not create debug function: ${createError.message}` };
      }
    } catch (error) {
      debugResults.allJobs = { error: `Exception: ${error}` };
    }

    // Check recent job runs
    try {
      const { data: recentRuns, error: runsError } = await supabase.rpc('get_cron_job_runs');
      debugResults.recentRuns = {
        data: recentRuns,
        error: runsError?.message
      };
    } catch (error) {
      debugResults.recentRuns = { error: `Exception: ${error}` };
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cron debug completed',
        results: debugResults,
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Debug error:', error);
    
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