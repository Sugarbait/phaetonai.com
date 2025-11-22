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
    const { query, limit = 5 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search knowledge base with text similarity
    const searchTerms = query.toLowerCase().split(' ').filter((term: string) => term.length > 2);
    
    let searchQuery = supabase
      .from('knowledge_base')
      .select('url, title, content, meta_description');

    // Build search conditions
    if (searchTerms.length > 0) {
      const searchConditions = searchTerms
        .map((term: string) => `content.ilike.%${term}%,title.ilike.%${term}%,meta_description.ilike.%${term}%`)
        .join(',');
      
      searchQuery = searchQuery.or(searchConditions);
    }

    const { data: results, error } = await searchQuery
      .limit(limit)
      .order('last_modified', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate relevance scores and format results
    const scoredResults = results?.map((item: any) => {
      let score = 0;
      const content = (item.content + ' ' + item.title + ' ' + item.meta_description).toLowerCase();
      
      // Score based on term matches
      searchTerms.forEach((term: string) => {
        const termCount = (content.match(new RegExp(term, 'g')) || []).length;
        score += termCount;
        
        // Bonus for title matches
        if (item.title.toLowerCase().includes(term)) {
          score += 5;
        }
        
        // Bonus for URL matches
        if (item.url.toLowerCase().includes(term)) {
          score += 3;
        }
      });

      return {
        ...item,
        relevance_score: score,
        content_snippet: item.content.substring(0, 500) + (item.content.length > 500 ? '...' : '')
      };
    })
    .filter((item: any) => item.relevance_score > 0)
    .sort((a: any, b: any) => b.relevance_score - a.relevance_score) || [];

    // Generate context for AI response
    const context = scoredResults
      .slice(0, 3) // Top 3 most relevant
      .map((item: any) => `**${item.title}** (${item.url})\n${item.content_snippet}`)
      .join('\n\n---\n\n');

    return new Response(
      JSON.stringify({
        success: true,
        query,
        results: scoredResults,
        context,
        total_results: scoredResults.length
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Knowledge base query error:', error);
    
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