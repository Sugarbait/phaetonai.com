-- Create functions to manage pg_cron jobs from the admin interface

-- Function to get current cron jobs
CREATE OR REPLACE FUNCTION get_cron_jobs()
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
  WHERE j.jobname LIKE '%blog%' OR j.jobname = 'weekly-blog-generation';
END;
$$;

-- Function to get recent cron job runs
CREATE OR REPLACE FUNCTION get_cron_job_runs()
RETURNS TABLE (
  jobid bigint,
  runid bigint,
  job_pid integer,
  database text,
  username text,
  status text,
  return_message text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  jobname text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    r.jobid,
    r.runid,
    r.job_pid,
    r.database,
    r.username,
    r.status,
    r.return_message,
    r.start_time,
    r.end_time,
    j.jobname
  FROM cron.job_run_details r
  LEFT JOIN cron.job j ON r.jobid = j.jobid
  WHERE j.jobname LIKE '%blog%' OR j.jobname = 'weekly-blog-generation'
  ORDER BY r.start_time DESC
  LIMIT 20;
END;
$$;

-- Function to enable weekly blog cron job
CREATE OR REPLACE FUNCTION enable_weekly_blog_cron(
  job_schedule text,
  function_url text,
  auth_header text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First, remove any existing weekly blog job
  PERFORM cron.unschedule('weekly-blog-generation');
  
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

-- Function to disable weekly blog cron job
CREATE OR REPLACE FUNCTION disable_weekly_blog_cron(job_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM cron.unschedule(job_name);
END;
$$;

-- Function to run test blog generation
CREATE OR REPLACE FUNCTION run_test_blog_generation(
  function_url text,
  auth_header text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Schedule a one-time job that runs immediately (every minute for 2 minutes, then auto-removes)
  PERFORM cron.schedule(
    'test-blog-generation-' || extract(epoch from now())::text,
    '* * * * *', -- Every minute
    format(
      'SELECT net.http_post(url := %L, headers := %L, body := %L) as request_id;',
      function_url,
      format('{"Content-Type": "application/json", "Authorization": "%s"}', auth_header)::jsonb,
      '{"triggeredBy": "admin_test", "scheduledDay": "Manual Test", "scheduledTime": "Now"}'::jsonb
    )
  );
  
  -- Schedule removal of the test job after 2 minutes
  PERFORM cron.schedule(
    'cleanup-test-job-' || extract(epoch from now())::text,
    format('%s %s * * *', 
      extract(minute from now() + interval '2 minutes')::integer % 60,
      extract(hour from now() + interval '2 minutes')::integer
    ),
    format('SELECT cron.unschedule(%L);', 'test-blog-generation-' || extract(epoch from now())::text)
  );
END;
$$;

-- Function to update cron job schedule
CREATE OR REPLACE FUNCTION update_cron_schedule(
  job_name text,
  new_schedule text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM cron.alter_job(
    job_id := (SELECT jobid FROM cron.job WHERE jobname = job_name),
    schedule := new_schedule
  );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_cron_jobs() TO authenticated;
GRANT EXECUTE ON FUNCTION get_cron_job_runs() TO authenticated;
GRANT EXECUTE ON FUNCTION enable_weekly_blog_cron(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION disable_weekly_blog_cron(text) TO authenticated;
GRANT EXECUTE ON FUNCTION run_test_blog_generation(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_cron_schedule(text, text) TO authenticated;