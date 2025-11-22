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
    const { schedule = '0 13 * * 1' } = await req.json();
    
    console.log('Attempting simple cron job creation...');
    
    // Create a simple cron enable function that doesn't try to unschedule first
    const simpleCronEnable = `
      CREATE OR REPLACE FUNCTION simple_enable_weekly_blog(
        job_schedule text,
        function_url text,
        auth_header text
      )
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result text;
      BEGIN
        -- Simply try to schedule the job (cron will handle duplicates)
        BEGIN
          PERFORM cron.schedule(
            'weekly-blog-generation-' || extract(epoch from now())::text,
            job_schedule,
            format(
              'SELECT net.http_post(url := %L, headers := %L, body := %L) as request_id;',
              function_url,
              format('{"Content-Type": "application/json", "Authorization": "%s"}', auth_header)::jsonb,
              '{"triggeredBy": "supabase_cron", "scheduledDay": "Monday", "scheduledTime": "8:00 AM EST"}'::jsonb
            )
          );
          result := 'SUCCESS: Cron job scheduled';
        EXCEPTION WHEN OTHERS THEN
          result := 'ERROR: ' || SQLERRM;
        END;
        
        RETURN result;
      END;
      $$;
      
      GRANT EXECUTE ON FUNCTION simple_enable_weekly_blog(text, text, text) TO authenticated;
    `;

    // Try to create and call this function
    const { error: createError } = await supabase.rpc('sql', {
      query: simpleCronEnable
    });

    if (createError) {
      console.log('Could not create function via SQL RPC:', createError.message);
      
      // Try to call the original function with better error handling
      const { data: result, error: originalError } = await supabase.rpc('enable_weekly_blog_cron', {
        job_schedule: schedule,
        function_url: `${supabaseUrl}/functions/v1/cron-trigger`,
        auth_header: `Bearer ${supabaseServiceKey}`
      });
      
      if (originalError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Original function failed: ${originalError.message}`,
            details: originalError,
            timestamp: new Date().toISOString()
          }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Cron job enabled via original function',
          result,
          timestamp: new Date().toISOString()
        }),
        { headers: corsHeaders }
      );
    }
    
    // Now try to call the simple function
    const { data: simpleResult, error: simpleError } = await supabase.rpc('simple_enable_weekly_blog', {
      job_schedule: schedule,
      function_url: `${supabaseUrl}/functions/v1/cron-trigger`,
      auth_header: `Bearer ${supabaseServiceKey}`
    });
    
    if (simpleError) {
      throw new Error(`Simple function failed: ${simpleError.message}`);
    }
    
    console.log('Simple cron result:', simpleResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Simple cron job enabled',
        result: simpleResult,
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Simple cron error:', error);
    
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