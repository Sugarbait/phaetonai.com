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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Setting up knowledge base tables...');

    // Create knowledge_base table
    const { error: kbError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id BIGSERIAL PRIMARY KEY,
            url TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            meta_description TEXT,
            last_modified TIMESTAMPTZ DEFAULT NOW(),
            content_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (kbError) {
      console.log('Knowledge base table creation result:', kbError);
    }

    // Create knowledge_scan_logs table
    const { error: logError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS knowledge_scan_logs (
            id BIGSERIAL PRIMARY KEY,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            pages_scanned INTEGER NOT NULL DEFAULT 0,
            pages_updated INTEGER NOT NULL DEFAULT 0,
            pages_added INTEGER NOT NULL DEFAULT 0,
            errors_count INTEGER NOT NULL DEFAULT 0,
            scan_duration_ms INTEGER,
            notes TEXT
        );
      `
    });

    if (logError) {
      console.log('Scan logs table creation result:', logError);
    }

    // Create indexes
    const { error: indexError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_knowledge_base_url ON knowledge_base(url);
        CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_hash ON knowledge_base(content_hash);
        CREATE INDEX IF NOT EXISTS idx_knowledge_base_last_modified ON knowledge_base(last_modified);
      `
    });

    if (indexError) {
      console.log('Index creation result:', indexError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Knowledge base tables created successfully'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Setup error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});