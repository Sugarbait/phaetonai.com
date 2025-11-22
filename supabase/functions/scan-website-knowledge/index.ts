import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

interface PageContent {
  url: string;
  title: string;
  content: string;
  meta_description: string;
  last_modified: string;
  content_hash: string;
}

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

    // Define pages to scan (only existing pages)
    const baseUrl = 'https://phaetonai.com';
    const pagesToScan = [
      '/' // Start with homepage, add more as pages are available
    ];

    console.log('Starting website knowledge scan...');
    
    const scannedPages: PageContent[] = [];
    const errors: string[] = [];

    // Scan each page
    for (const path of pagesToScan) {
      try {
        const url = `${baseUrl}${path}`;
        console.log(`Scanning: ${url}`);

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'PhaeteonAI-KnowledgeBot/1.0'
          }
        });

        if (!response.ok) {
          errors.push(`Failed to fetch ${url}: ${response.status}`);
          continue;
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        if (!doc) {
          errors.push(`Failed to parse HTML for ${url}`);
          continue;
        }

        // Extract content
        const title = doc.querySelector('title')?.textContent?.trim() || 'Untitled';
        const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        
        // Remove script tags, style tags, and navigation elements
        const scripts = doc.querySelectorAll('script, style, nav, header, footer, .chat-assist-widget');
        scripts.forEach(el => el.remove());

        // Get main content
        const mainContent = doc.querySelector('main') || doc.querySelector('body');
        let content = mainContent?.textContent || '';
        
        // Clean up content
        content = content
          .replace(/\s+/g, ' ') // Multiple spaces to single
          .replace(/\n\s*\n/g, '\n') // Multiple newlines to single
          .trim();

        // Create content hash for change detection
        const contentHash = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(content)
        );
        const hashString = Array.from(new Uint8Array(contentHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        const pageData: PageContent = {
          url: path,
          title,
          content,
          meta_description: metaDescription,
          last_modified: new Date().toISOString(),
          content_hash: hashString
        };

        scannedPages.push(pageData);

      } catch (error) {
        console.error(`Error scanning ${path}:`, error);
        errors.push(`Error scanning ${path}: ${error.message}`);
      }
    }

    // Scan recent blog posts
    try {
      console.log('Fetching recent blog posts...');
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('slug, title, content, excerpt, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (blogError) {
        errors.push(`Blog posts fetch error: ${blogError.message}`);
      } else if (blogPosts) {
        for (const post of blogPosts) {
          const blogUrl = `/blog/${post.slug}`;
          
          // Create content from blog post
          let blogContent = `${post.title}\n\n${post.excerpt}\n\n${post.content}`;
          blogContent = blogContent
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ')
            .trim();

          const contentHash = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(blogContent)
          );
          const hashString = Array.from(new Uint8Array(contentHash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

          const blogPageData: PageContent = {
            url: blogUrl,
            title: post.title,
            content: blogContent,
            meta_description: post.excerpt || '',
            last_modified: post.created_at,
            content_hash: hashString
          };

          scannedPages.push(blogPageData);
        }
      }
    } catch (error) {
      errors.push(`Blog scanning error: ${error.message}`);
    }

    // Store/update knowledge base
    console.log('Updating knowledge base...');
    let updatedCount = 0;
    let newCount = 0;

    for (const page of scannedPages) {
      try {
        // Check if page exists and if content has changed
        const { data: existing, error: fetchError } = await supabase
          .from('knowledge_base')
          .select('content_hash')
          .eq('url', page.url)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          errors.push(`Database fetch error for ${page.url}: ${fetchError.message}`);
          continue;
        }

        if (existing) {
          // Page exists, check if content changed
          if (existing.content_hash !== page.content_hash) {
            const { error: updateError } = await supabase
              .from('knowledge_base')
              .update(page)
              .eq('url', page.url);

            if (updateError) {
              errors.push(`Update error for ${page.url}: ${updateError.message}`);
            } else {
              updatedCount++;
              console.log(`Updated: ${page.url}`);
            }
          }
        } else {
          // New page
          const { error: insertError } = await supabase
            .from('knowledge_base')
            .insert(page);

          if (insertError) {
            errors.push(`Insert error for ${page.url}: ${insertError.message}`);
          } else {
            newCount++;
            console.log(`Added: ${page.url}`);
          }
        }
      } catch (error) {
        errors.push(`Processing error for ${page.url}: ${error.message}`);
      }
    }

    // Log the scan results
    const scanResult = {
      timestamp: new Date().toISOString(),
      pages_scanned: scannedPages.length,
      pages_updated: updatedCount,
      pages_added: newCount,
      errors_count: errors.length
    };

    const { error: logError } = await supabase
      .from('knowledge_scan_logs')
      .insert(scanResult);

    if (logError) {
      console.error('Failed to log scan results:', logError);
    }

    console.log('Knowledge base scan completed:', scanResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Knowledge base scan completed',
        results: {
          ...scanResult,
          errors: errors.length > 0 ? errors : undefined
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Knowledge base scan error:', error);
    
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