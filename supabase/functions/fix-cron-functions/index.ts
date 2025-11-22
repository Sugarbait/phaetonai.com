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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Fixing enable_weekly_blog_cron function...');

    // Create a better version of enable_weekly_blog_cron that handles non-existent jobs gracefully
    const fixedFunction = `
      CREATE OR REPLACE FUNCTION enable_weekly_blog_cron(
        job_schedule text,
        function_url text,
        auth_header text
      )
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        job_exists boolean;
      BEGIN
        -- Check if job exists before trying to unschedule it
        SELECT EXISTS(SELECT 1 FROM cron.job WHERE jobname = 'weekly-blog-generation') INTO job_exists;
        
        IF job_exists THEN
          PERFORM cron.unschedule('weekly-blog-generation');
        END IF;
        
        -- Create new job
        PERFORM cron.schedule(
          'weekly-blog-generation',
          job_schedule,
          format(
            'SELECT net.http_post(url := %L, headers := %L, body := %L) as request_id;',
            function_url,
            format('{"Content-Type": "application/json", "Authorization": "%s"}', auth_header)::jsonb,
            '{"triggeredBy": "supabase_cron", "scheduledDay": "Monday", "scheduledTime": "8:00 AM EST"}'::jsonb
          )
        );
      END;
      $$;
    `;

    // Use the raw SQL interface to execute this function update
    const { error: sqlError } = await supabase.rpc('sql', {
      query: fixedFunction
    });

    if (sqlError) {
      // If sql RPC doesn't work, try alternative approach
      console.log('SQL RPC not available, trying alternative...');
      
      // Let's try to call the existing function but with a try-catch approach
      try {
        const { error: testError } = await supabase.rpc('enable_weekly_blog_cron', {
          job_schedule: '0 13 * * 1',
          function_url: `${supabaseUrl}/functions/v1/cron-trigger`,
          auth_header: `Bearer ${supabaseServiceKey}`
        });
        
        if (testError) {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Original function failed: ${testError.message}`,
              suggestion: 'The cron functions need to be updated to handle non-existent jobs gracefully',
              timestamp: new Date().toISOString()
            }),
            { status: 500, headers: corsHeaders }
          );
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Cron job enabled successfully (original function worked)',
            timestamp: new Date().toISOString()
          }),
          { headers: corsHeaders }
        );
        
      } catch (altError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Alternative test failed: ${altError}`,
            originalSqlError: sqlError.message,
            timestamp: new Date().toISOString()
          }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    console.log('Successfully updated enable_weekly_blog_cron function');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cron function fixed successfully',
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Fix error:', error);
    
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