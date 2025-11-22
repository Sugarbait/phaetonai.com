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
    console.log('🚫 Disabling auto-posting - no auth required for emergency disable...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // First check current status
    const { data: jobs, error: statusError } = await supabase.rpc('get_cron_jobs');
    console.log('Current cron jobs:', jobs);

    // Disable the weekly blog generation job
    const { error: disableError } = await supabase.rpc('disable_weekly_blog_cron', {
      job_name: 'weekly-blog-generation'
    });
    
    if (disableError) {
      console.error('Disable error:', disableError);
      throw disableError;
    }

    // Verify it's disabled
    const { data: verifyJobs, error: verifyError } = await supabase.rpc('get_cron_jobs');
    console.log('Jobs after disable:', verifyJobs);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Auto-posting has been successfully disabled',
        previousJobs: jobs || [],
        remainingJobs: verifyJobs || [],
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Disable error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to disable auto-posting',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});