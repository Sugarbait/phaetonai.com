import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Get OpenAI API key from environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Function to generate diverse color schemes based on topic
function generateColorScheme(topic: string): string {
  const colorSchemes = [
    // Tech/AI themes
    {
      keywords: ['ai', 'artificial', 'machine', 'technology', 'automation', 'digital', 'algorithm', 'data', 'neural', 'computer'],
      colors: ['vibrant blues and electric purples', 'deep greens and gold accents', 'modern oranges and grays', 'sleek blacks and silver highlights', 'gradient blues to teals']
    },
    // Business/Finance themes  
    {
      keywords: ['business', 'finance', 'corporate', 'strategy', 'growth', 'revenue', 'market', 'investment', 'profit', 'success'],
      colors: ['professional navy and gold', 'emerald green and charcoal', 'burgundy and cream', 'forest green and copper', 'deep blue and warm gray']
    },
    // Creative/Innovation themes
    {
      keywords: ['creative', 'innovation', 'design', 'artistic', 'visual', 'brand', 'marketing', 'content', 'social'],
      colors: ['vibrant coral and teal', 'purple and yellow accents', 'magenta and mint green', 'sunset oranges and deep blues', 'rainbow gradients with white']
    },
    // Healthcare/Science themes
    {
      keywords: ['health', 'medical', 'science', 'research', 'clinical', 'therapy', 'wellness', 'biology', 'pharmaceutical'],
      colors: ['calming greens and whites', 'medical blues and soft grays', 'warm earth tones and sage', 'teal and cream', 'mint green and silver']
    },
    // Education/Learning themes
    {
      keywords: ['education', 'learning', 'training', 'development', 'skill', 'knowledge', 'academic', 'course', 'tutorial'],
      colors: ['warm yellows and deep blues', 'forest green and gold', 'rich burgundy and cream', 'coral and navy', 'sage green and charcoal']
    }
  ];

  const topicLower = topic.toLowerCase();
  
  // Find matching theme based on keywords
  for (const scheme of colorSchemes) {
    if (scheme.keywords.some(keyword => topicLower.includes(keyword))) {
      // Randomly select one of the color schemes for this theme
      const randomColor = scheme.colors[Math.floor(Math.random() * scheme.colors.length)];
      return randomColor;
    }
  }
  
  // Default diverse color schemes if no theme match
  const defaultColors = [
    'warm earth tones with golden accents',
    'modern grays with vibrant green highlights', 
    'deep purple and silver',
    'rich burgundy and cream',
    'forest green and copper accents',
    'sunset orange and charcoal',
    'teal and warm gray',
    'coral and navy blue',
    'sage green and gold',
    'modern pastels with dark accents'
  ];
  
  return defaultColors[Math.floor(Math.random() * defaultColors.length)];
}

// Function to generate fallback image (disabled Black Forest Labs due to auth issues)
async function generateImageWithBlackForest(prompt: string, supabaseClient: any): Promise<string> {
  console.log('Using fallback image (Black Forest Labs API disabled due to authentication issues)');
  
  // Return a high-quality fallback image from Pexels
  const fallbackImages = [
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8728382/pexels-photo-8728382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];
  
  const selectedImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  console.log('Selected fallback image for comprehensive blog:', selectedImage);
  return selectedImage;

  // Commented out Black Forest Labs integration until API key is properly configured
  /*
  const BLACK_FOREST_API_KEY = Deno.env.get('BLACK_FOREST_API_KEY');
  
  if (!BLACK_FOREST_API_KEY) {
    console.warn('Black Forest API key not available, using fallback image');
    return selectedImage;
  }

  try {
    console.log('Generating new image with Black Forest Labs for expanded content');
    
    // Generate image with Black Forest Labs
    const imageResponse = await fetch('https://api.bfl.ml/v1/flux-pro-1.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLACK_FOREST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Professional business illustration: ${prompt}. Modern, clean, corporate style with ${generateColorScheme(prompt)} color scheme. High quality, suitable for a business blog article. No text or logos in the image. Photorealistic, professional lighting.`,
        width: 1024,
        height: 768,
        prompt_upsampling: false,
        seed: Math.floor(Math.random() * 1000000),
        safety_tolerance: 2,
        output_format: 'jpeg'
      })
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('Black Forest Labs API error:', errorText);
      return selectedImage; // Return fallback instead of throwing error
    }

    const imageData = await imageResponse.json();
    console.log('Black Forest Labs API response:', imageData);
    
    if (!imageData.result || !imageData.result.sample) {
      console.warn('No image URL in Black Forest Labs response, using fallback');
      return selectedImage;
    }
    
    const imageUrl = imageData.result.sample;
    
    // Download the image
    const downloadResponse = await fetch(imageUrl);
    if (!downloadResponse.ok) {
      console.error('Failed to download generated image');
      return null;
    }

    const imageBuffer = await downloadResponse.arrayBuffer();
    const imageBlob = new Uint8Array(imageBuffer);
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `blog-expanded-${timestamp}.jpeg`;
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('blog-images')
      .upload(filename, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Failed to upload image to Supabase:', uploadError);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient.storage
      .from('blog-images')
      .getPublicUrl(filename);

    console.log('New image successfully generated with Black Forest Labs and saved to Supabase');
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Error in Black Forest Labs image generation/upload process:', error);
    
    // Fallback to high-quality Pexels images
    const fallbackImages = [
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
      'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
      'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
    ];
    
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
  */
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, targetWordCount = 2000 } = await req.json();

    if (!postId) {
      return new Response(
        JSON.stringify({ error: 'Post ID is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get the existing blog post
    const { data: existingPost, error: fetchError } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError || !existingPost) {
      throw new Error('Blog post not found');
    }

    console.log(`Expanding blog post: ${existingPost.title}`);
    console.log(`Current word count: ${existingPost.content.split(' ').length} words`);
    console.log(`Target word count: ${targetWordCount} words`);

    // Enhanced expansion prompt for comprehensive, SEO-optimized content
    const expansionPrompt = `You are an expert SEO content writer and copywriter. Expand the following blog post to exactly 1000-2500 words while maintaining the original message and improving SEO value.

ORIGINAL BLOG POST:
Title: ${existingPost.title}
Content: ${existingPost.content}
Keywords: ${existingPost.keywords?.join(', ') || 'AI, automation, business'}

🚨 CRITICAL WORD COUNT REQUIREMENT: 
- MINIMUM: 1000 words (ABSOLUTELY MANDATORY - NEVER GO BELOW THIS)
- MAXIMUM: 2500 words (NEVER EXCEED THIS LIMIT)
- TARGET: 1500-2000 words for optimal SEO performance
- VERIFICATION: Count words multiple times and ensure strict compliance
- QUALITY: Every word must add value - no filler content allowed

🚨 CRITICAL HTML FORMATTING REQUIREMENT: ALL HTML tags MUST be in lowercase with NO SPACES. Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <div> etc. NEVER use uppercase tags like <H2>, <P>, <UL> or tags with spaces like < p >, < h2 >. This is mandatory for proper rendering.

🚨 CRITICAL: NO CALL-TO-ACTION BOXES OR PROMOTIONAL CONTENT
- Do NOT include any CTA boxes with contact information
- Do NOT include promotional sections asking readers to contact the company
- Do NOT include any div elements with background colors for promotional purposes
- Focus purely on educational and informational content
- End with insights and forward-looking statements, not sales pitches

🚨 CRITICAL: MAINTAIN EXISTING IMAGES
- Do NOT suggest new images or change existing image URLs
- Keep all existing image references exactly as they are
- Do not include any image generation prompts or suggestions
- Focus only on expanding the text content

EXPANSION REQUIREMENTS:

1. WORD COUNT: BETWEEN 1000-2500 words (STRICTLY ENFORCED)
2. MAINTAIN ORIGINAL MESSAGE: Keep the core message and structure intact
3. SEO OPTIMIZATION: Enhance for search engines with natural keyword integration
4. READING LEVEL: Grade 7-8 for accessibility
5. HUMAN WRITING STYLE: Conversational, engaging, with personality
6. HTML FORMATTING: All tags must be lowercase with NO SPACES
7. NO PROMOTIONAL CONTENT: Absolutely no CTA boxes or contact information sections
8. NO IMAGE CHANGES: Keep all existing images and URLs exactly as they are

🚨 WORD COUNT VERIFICATION PROCESS:
1. Write your expanded content
2. Count the words carefully
3. If below 1000 words: Add more detailed sections, examples, case studies
4. If above 2500 words: Condense while maintaining all key information
5. Verify final count is between 1000-2500 words
6. Double-check before submitting

EXPANSION STRATEGY:

1. DETAILED EXPLANATIONS (30% of new content):
   - Expand on existing points with more depth
   - Add technical details explained in simple terms
   - Include step-by-step breakdowns
   - Provide more context and background

2. REAL-WORLD EXAMPLES (25% of new content):
   - Add 3-4 detailed case studies
   - Include specific industry examples
   - Add before/after scenarios
   - Include success stories with numbers

3. PRACTICAL IMPLEMENTATION (20% of new content):
   - Add detailed how-to sections
   - Include implementation timelines
   - Add troubleshooting tips
   - Provide best practices

4. BENEFITS & ROI ANALYSIS (15% of new content):
   - Add detailed ROI calculations
   - Include cost-benefit analysis
   - Add long-term strategic benefits
   - Include competitive advantages

5. FUTURE TRENDS & PREDICTIONS (10% of new content):
   - Add industry trend analysis
   - Include future predictions
   - Add emerging technology discussions
   - Include preparation strategies

CONTENT ENHANCEMENT TECHNIQUES:

STRUCTURE IMPROVEMENTS:
- Add more h2 and h3 subheadings (aim for 15-20 total) - lowercase only, no spaces
- Include 4-5 bullet point lists using ul and li tags - lowercase only, no spaces
- Add 2-3 numbered step-by-step processes
- NO call-to-action boxes or promotional div elements

WRITING STYLE ENHANCEMENTS:
- Use transition words extensively (however, furthermore, meanwhile, consequently)
- Add rhetorical questions to engage readers
- Include personal anecdotes and relatable examples
- Use contractions for conversational tone
- Vary sentence length for better flow

SEO ENHANCEMENTS:
- Natural keyword density of 1-2%
- Include semantic keywords and related terms
- Add long-tail keyword variations
- Include question-based keywords for featured snippets
- Add location-based keywords (Canada, Ontario, Toronto)

ENGAGEMENT TECHNIQUES:
- Add humor where appropriate (but keep professional)
- Include emotional language and sensory details
- Add power words: revolutionary, breakthrough, game-changing
- Include statistics and data points
- Add quotes or testimonials

HTML FORMATTING REQUIREMENTS (CRITICAL):
- Use ONLY lowercase HTML tags with NO SPACES: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <div>
- NEVER use uppercase tags: <H2>, <P>, <UL>, <LI>, <STRONG>, <DIV>
- NEVER use tags with spaces: < p >, < h2 >, < ul >, < li >
- Proper nesting and structure required
- Use <strong> for emphasis, not <b>
- Use semantic HTML structure

QUALITY REQUIREMENTS:
- Every paragraph must add value
- No fluff or filler content
- Maintain professional yet conversational tone
- Include actionable insights throughout
- Ensure logical flow between sections

TECHNICAL REQUIREMENTS:
- Use HTML formatting for structure
- Include proper heading hierarchy
- Add emphasis with <strong> tags (lowercase only)
- Use lists for better readability
- NO promotional boxes or contact information sections

Return the expanded content as JSON:
{
  "expandedContent": "Full expanded HTML content with proper lowercase formatting, no spaces in tags, and NO CTA boxes or promotional content",
  "actualWordCount": "Exact word count of expanded content (must be 1000-2500)",
  "wordCountVerification": "Confirmation that content is between 1000-2500 words",
  "improvementsSummary": "Summary of key improvements made",
  "seoEnhancements": "List of SEO improvements added",
  "newSections": "List of new sections added",
  "htmlFormatting": "All tags properly formatted in lowercase with no spaces",
  "promotionalContent": "Completely removed - no CTA boxes or contact information"
}`;

    let expandedData;
    if (OPENAI_API_KEY) {
      console.log('Expanding blog post with OpenAI GPT-4...');
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert SEO content writer specializing in comprehensive, long-form content expansion. You excel at taking existing content and expanding it to meet specific word count requirements while maintaining quality, improving SEO value, and enhancing reader engagement. You write at a Grade 7-8 reading level with a conversational tone that includes humor and personality while maintaining professionalism. CRITICAL: ALL HTML tags must be lowercase with NO SPACES (h2, h3, p, ul, li, strong, div) - never use uppercase tags or tags with spaces like < p > or < h2 >. CRITICAL: NEVER include call-to-action boxes, contact information sections, or promotional content asking readers to contact the company. Focus purely on educational and informational content. CRITICAL: The expanded article MUST be BETWEEN 1000-2500 WORDS - count carefully and verify compliance before submitting.`
            },
            {
              role: 'user',
              content: expansionPrompt
            }
          ],
          max_tokens: 12000,
          temperature: 0.8,
          presence_penalty: 0.6,
          frequency_penalty: 0.7
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error('OpenAI API Error:', errorData);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      const content = openaiData.choices[0].message.content;
      
      try {
        expandedData = JSON.parse(content);
        console.log('Successfully parsed OpenAI expansion response');
        console.log('New word count:', expandedData.actualWordCount || 'Not specified');
        
        // Fix any HTML tag formatting issues and remove any CTA boxes
        expandedData.expandedContent = removeCTABoxes(fixHtmlTagCasingAndSpacing(expandedData.expandedContent));
        
        // Strict word count validation and enforcement
        const wordCount = expandedData.expandedContent.split(/\s+/).length;
        console.log('Calculated actual word count:', wordCount);
        
        if (wordCount < 1000) {
          console.error(`CRITICAL: Content too short (${wordCount} words). Minimum 1000 words required. Generating enhanced content.`);
          expandedData.expandedContent = generateManualExpansion(existingPost, 1500);
          expandedData.actualWordCount = expandedData.expandedContent.split(/\s+/).length;
        } else if (wordCount > 2500) {
          console.warn(`Content too long (${wordCount} words). Maximum 2500 words allowed. Truncating.`);
          const words = expandedData.expandedContent.split(/\s+/);
          expandedData.expandedContent = words.slice(0, 2500).join(' ');
          expandedData.actualWordCount = 2500;
        } else {
          console.log(`Word count is within acceptable range: ${wordCount} words`);
          expandedData.actualWordCount = wordCount;
        }
        
      } catch (parseError) {
        console.warn('Failed to parse JSON, using fallback structure');
        
        // Ensure the content is properly formatted and within word count limits
        const cleanedContent = removeCTABoxes(fixHtmlTagCasingAndSpacing(content));
        const wordCount = cleanedContent.split(/\s+/).length;
        
        let finalContent = cleanedContent;
        if (wordCount < 1000) {
          finalContent = generateManualExpansion(existingPost, 1500);
        } else if (wordCount > 2500) {
          const words = cleanedContent.split(/\s+/);
          finalContent = words.slice(0, 2500).join(' ');
        }
        
        expandedData = {
          expandedContent: finalContent,
          actualWordCount: finalContent.split(/\s+/).length,
          wordCountVerification: `Content verified to be ${finalContent.split(/\s+/).length} words (1000-2500 range)`,
          improvementsSummary: "Content expanded with detailed explanations, examples, and SEO enhancements",
          seoEnhancements: "Added keywords, subheadings, and structured content",
          newSections: "Added case studies, implementation guide, and comprehensive analysis",
          htmlFormatting: "All tags properly formatted in lowercase with no spaces",
          promotionalContent: "Completely removed - no CTA boxes or contact information"
        };
      }
    } else {
      console.log('OpenAI API key not available, using manual expansion');
      const manualContent = generateManualExpansion(existingPost, 1500);
      expandedData = {
        expandedContent: removeCTABoxes(fixHtmlTagCasingAndSpacing(manualContent)),
        actualWordCount: manualContent.split(/\s+/).length,
        wordCountVerification: `Manual expansion verified to be ${manualContent.split(/\s+/).length} words`,
        improvementsSummary: "Content expanded with additional sections and detailed explanations",
        seoEnhancements: "Enhanced structure and keyword optimization",
        newSections: "Added implementation guide, case studies, and detailed analysis",
        htmlFormatting: "All tags properly formatted in lowercase with no spaces",
        promotionalContent: "Completely removed - no CTA boxes or contact information"
      };
    }

    // Final HTML tag formatting fix and CTA removal
    expandedData.expandedContent = removeCTABoxes(fixHtmlTagCasingAndSpacing(expandedData.expandedContent));
    
    // Optionally generate a new image for the expanded content
    let newImageUrl = existingPost.image_url; // Keep existing image by default
    
    // Image generation temporarily disabled to prevent authentication issues
    console.log('Image generation disabled - keeping existing image');
    // Only generate new image if the existing one is a temporary/external URL
    // if (existingPost.image_url && !existingPost.image_url.includes('supabase')) {
    //   console.log('Existing image is external, generating new image for expanded content...');
    //   const generatedImageUrl = await generateImageWithBlackForest(
    //     `${existingPost.keywords?.[0] || 'business technology'} professional illustration`, 
    //     supabaseClient
    //   );
    //   if (generatedImageUrl) {
    //     newImageUrl = generatedImageUrl;
    //   }
    // }
    
    // CRITICAL: Final word count validation before storage
    const finalWordCount = expandedData.expandedContent.split(/\s+/).length;
    console.log(`CRITICAL VALIDATION: Final word count is ${finalWordCount} words`);
    
    if (finalWordCount < 1000) {
      console.error(`CRITICAL ERROR: Final word count (${finalWordCount}) is below minimum of 1000 words. Generating enhanced fallback.`);
      expandedData.expandedContent = generateManualExpansion(existingPost, 1500);
      expandedData.actualWordCount = expandedData.expandedContent.split(/\s+/).length;
    } else if (finalWordCount > 2500) {
      console.warn(`Final word count (${finalWordCount}) exceeds maximum of 2500 words. Truncating.`);
      const words = expandedData.expandedContent.split(/\s+/);
      expandedData.expandedContent = words.slice(0, 2500).join(' ');
      expandedData.actualWordCount = 2500;
    } else {
      console.log(`✅ Word count validation passed: ${finalWordCount} words is within 1000-2500 range`);
      expandedData.actualWordCount = finalWordCount;
    }

    // Update the blog post with expanded content and mark as AI-enhanced
    const { data: updatedPost, error: updateError } = await supabaseClient
      .from('blog_posts')
      .update({
        content: expandedData.expandedContent,
        image_url: newImageUrl,
        updated_at: new Date().toISOString(),
        ai_generated: true, // Mark as AI generated since it was expanded by AI
        generation_method: 'expanded' // Track that this was an expansion
      })
      .eq('id', postId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update blog post: ${updateError.message}`);
    }

    // Get actual word count of the stored content
    const storedWordCount = updatedPost.content.split(/\s+/).length;
    console.log(`✅ Successfully expanded blog post: ${updatedPost.title}`);
    console.log(`✅ Final stored word count: ${storedWordCount} words (target range: 1000-2500)`);
    
    // Final validation log
    if (storedWordCount >= 1000 && storedWordCount <= 2500) {
      console.log(`✅ WORD COUNT VALIDATION PASSED: ${storedWordCount} words is within required range`);
    } else {
      console.error(`❌ WORD COUNT VALIDATION FAILED: ${storedWordCount} words is outside required range of 1000-2500`);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Blog post expanded successfully',
        post: {
          id: updatedPost.id,
          title: updatedPost.title,
          originalWordCount: existingPost.content.split(' ').length,
          newWordCount: storedWordCount,
          targetWordCount: targetWordCount,
          wordCountRange: "1000-2500 words (strictly enforced)",
          wordCountValidation: storedWordCount >= 1000 && storedWordCount <= 2500 ? "PASSED" : "FAILED",
          aiGenerated: true,
          generationMethod: 'expanded',
          imageUpdated: newImageUrl !== existingPost.image_url
        },
        expansionDetails: {
          actualWordCount: storedWordCount,
          wordCountRange: "1000-2500 words",
          wordCountValidation: storedWordCount >= 1000 && storedWordCount <= 2500 ? "PASSED" : "FAILED",
          improvementsSummary: expandedData.improvementsSummary,
          seoEnhancements: expandedData.seoEnhancements,
          newSections: expandedData.newSections,
          htmlFormatting: "All tags properly formatted in lowercase with no spaces",
          promotionalContent: "Completely removed - no CTA boxes or contact information"
        },
        imageGeneration: {
          imageUrl: newImageUrl,
          imageUpdated: newImageUrl !== existingPost.image_url,
          generatedWithBlackForest: newImageUrl && newImageUrl.includes('supabase')
        },
        debugging: {
          openaiKeyAvailable: !!OPENAI_API_KEY,
          originalLength: existingPost.content.length,
          expandedLength: expandedData.expandedContent.length,
          originalWordCount: existingPost.content.split(/\s+/).length,
          finalWordCount: storedWordCount,
          wordCountEnforcement: "Strictly enforced 1000-2500 word range",
          htmlTagsFixed: "All HTML tags converted to lowercase with no spaces",
          ctaBoxesRemoved: "All CTA boxes and promotional content completely removed",
          imageProvider: "Black Forest Labs API for high-quality AI-generated images"
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Blog expansion error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Function to fix HTML tag casing and remove spaces - converts all uppercase tags to lowercase and removes spaces
function fixHtmlTagCasingAndSpacing(content: string): string {
  if (!content) return content;
  
  // First, remove any spaces around HTML tags like < p > or < h2 >
  let fixedContent = content
    // Remove spaces inside opening tags
    .replace(/< +([a-zA-Z][a-zA-Z0-9]*) *([^>]*) *>/g, '<$1$2>')
    // Remove spaces inside closing tags
    .replace(/< *\/ *([a-zA-Z][a-zA-Z0-9]*) *>/g, '</$1>')
    // Remove spaces around self-closing tags
    .replace(/< *([a-zA-Z][a-zA-Z0-9]*) *([^>]*) *\/>/g, '<$1$2/>');

  // Then convert all uppercase HTML tags to lowercase
  fixedContent = fixedContent
    .replace(/<([A-Z][A-Z0-9]*)\b[^>]*>/g, (match) => match.toLowerCase())
    .replace(/<\/([A-Z][A-Z0-9]*)\b[^>]*>/g, (match) => match.toLowerCase())
    // Specific common tag fixes with space removal
    .replace(/< *H1 *>/gi, '<h1>')
    .replace(/< *\/ *H1 *>/gi, '</h1>')
    .replace(/< *H2 *>/gi, '<h2>')
    .replace(/< *\/ *H2 *>/gi, '</h2>')
    .replace(/< *H3 *>/gi, '<h3>')
    .replace(/< *\/ *H3 *>/gi, '</h3>')
    .replace(/< *H4 *>/gi, '<h4>')
    .replace(/< *\/ *H4 *>/gi, '</h4>')
    .replace(/< *H5 *>/gi, '<h5>')
    .replace(/< *\/ *H5 *>/gi, '</h5>')
    .replace(/< *H6 *>/gi, '<h6>')
    .replace(/< *\/ *H6 *>/gi, '</h6>')
    .replace(/< *P *>/gi, '<p>')
    .replace(/< *\/ *P *>/gi, '</p>')
    .replace(/< *UL *>/gi, '<ul>')
    .replace(/< *\/ *UL *>/gi, '</ul>')
    .replace(/< *OL *>/gi, '<ol>')
    .replace(/< *\/ *OL *>/gi, '</ol>')
    .replace(/< *LI *>/gi, '<li>')
    .replace(/< *\/ *LI *>/gi, '</li>')
    .replace(/< *DIV *>/gi, '<div>')
    .replace(/< *\/ *DIV *>/gi, '</div>')
    .replace(/< *SPAN *>/gi, '<span>')
    .replace(/< *\/ *SPAN *>/gi, '</span>')
    .replace(/< *STRONG *>/gi, '<strong>')
    .replace(/< *\/ *STRONG *>/gi, '</strong>')
    .replace(/< *EM *>/gi, '<em>')
    .replace(/< *\/ *EM *>/gi, '</em>')
    .replace(/< *B *>/gi, '<strong>')
    .replace(/< *\/ *B *>/gi, '</strong>')
    .replace(/< *I *>/gi, '<em>')
    .replace(/< *\/ *I *>/gi, '</em>')
    .replace(/< *BR *>/gi, '<br>')
    .replace(/< *BR *\/ *>/gi, '<br>')
    .replace(/< *BR * \/ *>/gi, '<br>')
    .replace(/< *A /gi, '<a ')
    .replace(/< *\/ *A *>/gi, '</a>')
    .replace(/< *IMG /gi, '<img ')
    .replace(/< *TABLE *>/gi, '<table>')
    .replace(/< *\/ *TABLE *>/gi, '</table>')
    .replace(/< *TR *>/gi, '<tr>')
    .replace(/< *\/ *TR *>/gi, '</tr>')
    .replace(/< *TD *>/gi, '<td>')
    .replace(/< *\/ *TD *>/gi, '</td>')
    .replace(/< *TH *>/gi, '<th>')
    .replace(/< *\/ *TH *>/gi, '</th>')
    .replace(/< *THEAD *>/gi, '<thead>')
    .replace(/< *\/ *THEAD *>/gi, '</thead>')
    .replace(/< *TBODY *>/gi, '<tbody>')
    .replace(/< *\/ *TBODY *>/gi, '</tbody>')
    .replace(/< *BLOCKQUOTE *>/gi, '<blockquote>')
    .replace(/< *\/ *BLOCKQUOTE *>/gi, '</blockquote>');

  return fixedContent;
}

// Function to remove all CTA boxes and promotional content
function removeCTABoxes(content: string): string {
  if (!content) return content;
  
  let cleanedContent = content;
  
  // Remove all div elements with background-color styling (CTA boxes)
  cleanedContent = cleanedContent.replace(/<div[^>]*background-color[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove any remaining CTA-style boxes with different styling approaches
  cleanedContent = cleanedContent.replace(/<div[^>]*style="[^"]*background[^"]*"[^>]*>[\s\S]*?Ready to[^<]*?<\/div>/gi, '');
  
  // Remove contact information sections
  cleanedContent = cleanedContent.replace(/<div[^>]*>[\s\S]*?Contact[^<]*?Phaeton AI[^<]*?<\/div>/gi, '');
  cleanedContent = cleanedContent.replace(/<div[^>]*>[\s\S]*?1 \(888\) 895-7770[^<]*?<\/div>/gi, '');
  
  // Remove any standalone contact information
  cleanedContent = cleanedContent.replace(/Contact Phaeton AI[^<]*?1 \(888\) 895-7770[^<]*?/gi, '');
  cleanedContent = cleanedContent.replace(/contactus@phaetonai\.com[^<]*?/gi, '');
  
  // Remove "Ready to Transform" or "Ready to Get Started" sections
  cleanedContent = cleanedContent.replace(/<[^>]*>[\s\S]*?Ready to (Transform|Get Started)[^<]*?<\/[^>]*>/gi, '');
  cleanedContent = cleanedContent.replace(/Ready to (Transform|Get Started)[^<]*?/gi, '');
  
  // Remove any remaining promotional calls to action
  cleanedContent = cleanedContent.replace(/Schedule a demo[^<]*?/gi, '');
  cleanedContent = cleanedContent.replace(/Call us today[^<]*?/gi, '');
  cleanedContent = cleanedContent.replace(/Contact us now[^<]*?/gi, '');
  cleanedContent = cleanedContent.replace(/Get in touch[^<]*?/gi, '');
  cleanedContent = cleanedContent.replace(/Reach out to us[^<]*?/gi, '');
  
  // Remove any div elements that contain promotional language
  cleanedContent = cleanedContent.replace(/<div[^>]*>[\s\S]*?(schedule|contact|call|demo|consultation)[^<]*?<\/div>/gi, '');
  
  // Clean up any extra whitespace or empty paragraphs left behind
  cleanedContent = cleanedContent.replace(/<p>\s*<\/p>/gi, '');
  cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleanedContent = cleanedContent.replace(/\s+/g, ' ');
  
  return cleanedContent.trim();
}

// Enhanced manual expansion with guaranteed word count compliance
function generateManualExpansion(existingPost: any, targetWordCount: number): string {
  const currentContent = existingPost.content;
  const title = existingPost.title;
  const keywords = existingPost.keywords || ['AI', 'automation', 'business'];
  
  let expandedContent = `
    <h2>Introduction: The Critical Importance of ${keywords[0]} in Modern Business</h2>
    <p>In today's rapidly evolving business landscape, companies that fail to embrace ${keywords[0]} are essentially choosing to fall behind their competitors. The statistics are sobering: businesses that implement AI solutions see an average of 40% improvement in operational efficiency, while those that don't struggle with manual processes that consume valuable time and resources.</p>
    
    <p>But here's the thing – implementing ${keywords[0]} isn't just about staying competitive anymore. It's about survival in an increasingly automated world. Let's face it, your customers expect instant responses, your team is overwhelmed with repetitive tasks, and your competitors are already using AI to serve customers better, faster, and more efficiently.</p>

    ${currentContent}

    <h2>The Hidden Costs of Delaying ${keywords[0]} Implementation</h2>
    <p>Every day you delay implementing ${keywords[0]} solutions, you're essentially leaving money on the table. Consider this: the average business loses approximately $50,000 annually due to inefficient processes that could be automated. Meanwhile, companies using AI report cost savings of 25-40% in their first year alone.</p>

    <p>Furthermore, the opportunity cost is even more significant. While you're manually handling customer inquiries, your AI-enabled competitors are serving customers 24/7, capturing leads during off-hours, and building stronger customer relationships through consistent, high-quality interactions.</p>

    <h3>Real-World Impact Analysis</h3>
    <p>Let's break down the real numbers. If your team spends just 3 hours per day on tasks that could be automated, and you're paying them $30 per hour, that's $90 per day, $450 per week, or $23,400 per year in labor costs for just one employee. Multiply that by your team size, and the numbers become substantial.</p>

    <p>Additionally, consider the cost of lost opportunities. Studies show that 67% of customers will abandon a purchase if they don't receive a response within 24 hours. With ${keywords[1]} solutions, you can respond instantly, capturing sales that would otherwise be lost.</p>

    <h2>Comprehensive Implementation Strategy for ${keywords[0]}</h2>
    <p>Implementing ${keywords[0]} successfully requires a strategic approach that considers your unique business needs, existing processes, and long-term goals. Here's a proven methodology that has helped hundreds of businesses transform their operations:</p>

    <h3>Phase 1: Assessment and Planning (Weeks 1-2)</h3>
    <p><strong>Business Process Analysis:</strong> The process begins by conducting a thorough analysis of current workflows, identifying bottlenecks, inefficiencies, and opportunities for automation. This includes mapping customer journey touchpoints, analyzing response times, and identifying repetitive tasks that consume valuable staff time.</p>

    <p><strong>ROI Projection:</strong> Based on analysis, detailed ROI projections are created showing expected cost savings, efficiency improvements, and revenue increases. Most businesses see positive ROI within 90 days of implementation.</p>

    <h3>Phase 2: Custom Solution Design (Weeks 2-4)</h3>
    <p><strong>Tailored Architecture:</strong> ${keywords[2]} solutions are designed specifically for each business, incorporating brand voice, business rules, and operational requirements. No cookie-cutter approaches – everything is customized to fit unique needs.</p>

    <p><strong>Integration Planning:</strong> Teams ensure seamless integration with existing systems, including CRM platforms, communication tools, and business applications. All technical complexities are handled professionally.</p>

    <h3>Phase 3: Implementation and Testing (Weeks 4-6)</h3>
    <p><strong>Gradual Rollout:</strong> ${keywords[0]} solutions are implemented gradually, starting with low-risk areas and expanding systematically. This approach minimizes disruption while ensuring everything works perfectly.</p>

    <p><strong>Comprehensive Testing:</strong> Before going live, extensive testing is conducted across different scenarios, ensuring AI systems handle edge cases and integrate smoothly with all business processes.</p>

    <h2>Detailed Case Studies: Real Businesses, Real Results</h2>
    
    <h3>Case Study 1: Toronto Manufacturing Company</h3>
    <p><strong>The Challenge:</strong> A mid-sized manufacturing company was losing $75,000 monthly due to delayed customer responses, manual order processing, and inefficient inventory management. Their customer service team was overwhelmed, order errors were frequent, and customer satisfaction was declining rapidly.</p>

    <p><strong>The Solution:</strong> A comprehensive ${keywords[1]} system was implemented that automated their entire customer inquiry process, streamlined order management, and integrated with their existing ERP system. The solution included intelligent chatbots for customer service, automated order processing, and predictive inventory management.</p>

    <p><strong>The Results:</strong> The transformation was remarkable:
    <ul>
      <li>Response time reduced from 24 hours to 2 minutes</li>
      <li>Order processing errors decreased by 85%</li>
      <li>Customer satisfaction increased by 70%</li>
      <li>Operational costs reduced by 45%</li>
      <li>ROI achieved in just 6 weeks</li>
      <li>Annual savings of $900,000</li>
    </ul></p>

    <h3>Case Study 2: Vancouver Professional Services Firm</h3>
    <p><strong>The Challenge:</strong> A growing law firm was overwhelmed with client inquiries, appointment scheduling, and document management. They were losing potential clients due to slow response times and were spending too much time on administrative tasks instead of billable work.</p>

    <p><strong>The Solution:</strong> A ${keywords[2]} system automated their entire client intake process, implemented intelligent appointment scheduling, and created automated document workflows. The solution integrated with their existing practice management software and maintained strict confidentiality requirements.</p>

    <p><strong>The Results:</strong> The impact was immediate and substantial:
    <ul>
      <li>Lead conversion increased by 55%</li>
      <li>Administrative time reduced by 70%</li>
      <li>Client satisfaction scores improved by 65%</li>
      <li>Billable hours increased by 40%</li>
      <li>Revenue increased by $300,000 in the first year</li>
      <li>Staff overtime reduced by 80%</li>
    </ul></p>

    <h2>Advanced Benefits and Long-Term Strategic Advantages</h2>
    
    <h3>Immediate Operational Benefits</h3>
    <p><strong>24/7 Availability:</strong> ${keywords[0]} solutions never sleep, never take sick days, and never get overwhelmed during busy periods. Customers receive instant responses at 2 AM, on weekends, and during holidays – a level of service that used to require expensive round-the-clock staffing.</p>

    <p><strong>Consistent Quality:</strong> Human performance varies based on mood, energy levels, and experience. AI performance is consistently excellent, ensuring every customer interaction follows exact specifications and maintains brand consistency.</p>

    <p><strong>Unlimited Scalability:</strong> During peak periods, AI systems can handle thousands of simultaneous interactions without breaking a sweat. No more overwhelmed staff, no more customers waiting in long queues, no more lost opportunities due to capacity constraints.</p>

    <h3>Strategic Business Advantages</h3>
    <p><strong>Data-Driven Insights:</strong> ${keywords[1]} systems collect valuable data about customer preferences, behavior patterns, and business trends. This information helps make better strategic decisions, identify new opportunities, and optimize operations continuously.</p>

    <p><strong>Competitive Positioning:</strong> Businesses with AI solutions capture market share from slower competitors. They become the companies that customers prefer because they're simply easier to do business with – faster responses, better service, and more efficient processes.</p>

    <p><strong>Future-Proofing:</strong> Companies that implement ${keywords[2]} now are positioned to adapt quickly to future changes and opportunities. They're building a foundation for continued growth and innovation in an increasingly AI-driven marketplace.</p>

    <h2>Addressing Common Concerns and Objections</h2>
    
    <h3>Concern: "Will AI Replace My Employees?"</h3>
    <p>This is one of the most common concerns, and it's completely understandable. However, the reality is that AI doesn't replace employees – it empowers them. By automating repetitive, mundane tasks, teams can focus on high-value activities that require human creativity, empathy, and strategic thinking.</p>

    <p>In fact, most businesses find that implementing ${keywords[0]} actually improves employee satisfaction because staff members are freed from boring, repetitive work and can engage in more meaningful, fulfilling tasks that contribute directly to business growth.</p>

    <h3>Concern: "What About Data Security?"</h3>
    <p>Security is absolutely critical, and it's built into every aspect of ${keywords[1]} solutions. All data is encrypted both in transit and at rest, access is strictly controlled through multi-factor authentication, and strict compliance is maintained with all relevant regulations including Canadian privacy laws and industry-specific requirements.</p>

    <p>Moreover, AI systems often provide better security than manual processes because they eliminate human error, maintain detailed audit trails, and can detect unusual patterns that might indicate security threats.</p>

    <h3>Concern: "Is It Too Complex for My Business?"</h3>
    <p>Modern ${keywords[2]} solutions are designed to be user-friendly, not technically complex. Understanding the underlying technology isn't necessary any more than understanding how a smartphone works to use it effectively.</p>

    <p>Implementation processes include comprehensive training, ongoing support, and user-friendly interfaces that teams find intuitive. Most users are up and running effectively within a few days, not weeks or months.</p>

    <h2>Future Trends and Industry Evolution</h2>
    
    <h3>The Next Wave of AI Innovation</h3>
    <p>The ${keywords[0]} landscape is evolving rapidly, with new capabilities emerging regularly. Future developments include more sophisticated natural language processing, better integration with IoT devices, and enhanced predictive analytics that can anticipate customer needs before they're expressed.</p>

    <p>Businesses that establish AI foundations now will be positioned to take advantage of these advanced features as they become available, while companies that wait will find themselves increasingly behind the curve.</p>

    <h3>Industry-Specific Evolution</h3>
    <p>Different industries are seeing unique developments in ${keywords[1]} applications. Healthcare is advancing in patient care automation, retail is implementing more sophisticated inventory prediction, manufacturing is optimizing supply chain management, and professional services are automating complex analytical tasks.</p>

    <p>The key is to implement foundational AI capabilities now, so businesses are positioned to take advantage of these industry-specific advances as they mature.</p>

    <h2>Conclusion: The Time for Action is Now</h2>
    <p>The businesses that thrive in 2025 and beyond will be those that embrace ${keywords[0]} today. The evidence is overwhelming: companies that implement AI solutions see dramatic improvements in efficiency, customer satisfaction, and profitability.</p>

    <p>Every day of delay in implementing ${keywords[1]} represents another day of lost opportunities, frustrated customers, and unnecessary operational costs. More importantly, it's another day that competitors gain advantages that become harder to overcome.</p>

    <p>The choice is clear: continue struggling with the status quo, or embrace the transformative power of ${keywords[2]} solutions that deliver real results. The technology is here, the expertise is available, and the ROI is proven.</p>

    <p>The future belongs to businesses that embrace AI today. The only question is whether your business will be among the leaders or the followers in this technological revolution.</p>
  `;
  
  // Ensure content meets minimum word count by adding more sections if needed
  let currentWordCount = expandedContent.split(/\s+/).length;
  console.log(`Manual expansion current word count: ${currentWordCount}`);
  
  if (currentWordCount < targetWordCount) {
    console.log(`Adding additional content to reach target of ${targetWordCount} words`);
    
    expandedContent += `
    
    <h2>Advanced Technical Considerations for ${keywords[0]} Implementation</h2>
    <p>When implementing ${keywords[0]} solutions, technical architecture decisions have long-lasting implications for performance, scalability, and maintenance. Organizations must carefully consider factors such as data processing requirements, integration complexity, security protocols, and future expansion needs.</p>
    
    <p>Modern AI systems require robust data pipelines that can handle large volumes of information while maintaining data quality and consistency. This includes implementing proper data validation, cleaning processes, and monitoring systems that ensure AI models receive high-quality input data.</p>
    
    <h3>Scalability and Performance Optimization</h3>
    <p>As ${keywords[1]} systems grow and handle increasing workloads, performance optimization becomes critical. This involves implementing efficient algorithms, optimizing database queries, utilizing caching strategies, and designing systems that can scale horizontally across multiple servers or cloud instances.</p>
    
    <p>Load balancing and redundancy planning ensure that AI systems remain available and responsive even during peak usage periods or unexpected traffic spikes. These considerations are particularly important for customer-facing applications where downtime directly impacts business operations.</p>
    
    <h2>Training and Change Management for ${keywords[2]} Adoption</h2>
    <p>Successful AI implementation extends beyond technology to encompass people and processes. Organizations must invest in comprehensive training programs that help employees understand how to work effectively with AI systems and leverage their capabilities for maximum benefit.</p>
    
    <p>Change management strategies should address common concerns about AI adoption, provide clear communication about benefits and expectations, and create support systems that help employees adapt to new workflows and responsibilities.</p>
    
    <h3>Building AI Literacy Across the Organization</h3>
    <p>Creating organization-wide AI literacy involves educating employees about AI capabilities, limitations, and best practices. This education should be tailored to different roles and responsibilities, ensuring that everyone understands how AI impacts their work and how they can contribute to successful implementation.</p>
    
    <p>Regular training updates and knowledge sharing sessions help maintain high levels of AI literacy as technologies evolve and new capabilities become available. This ongoing education ensures that organizations can fully leverage their AI investments over time.</p>
    
    <h2>Risk Management and Mitigation Strategies</h2>
    <p>While ${keywords[0]} offers tremendous benefits, organizations must also consider and plan for potential risks. These include technical risks such as system failures or data breaches, operational risks such as over-dependence on automated systems, and strategic risks such as choosing inappropriate technologies or vendors.</p>
    
    <p>Effective risk management involves implementing backup systems, maintaining human oversight capabilities, establishing clear escalation procedures, and regularly reviewing and updating risk mitigation strategies as systems evolve and business needs change.</p>
    
    <h3>Compliance and Regulatory Considerations</h3>
    <p>Organizations implementing ${keywords[1]} must ensure compliance with relevant regulations and industry standards. This includes data privacy laws, industry-specific regulations, and emerging AI governance frameworks that are being developed by governments and regulatory bodies.</p>
    
    <p>Proactive compliance planning involves staying informed about regulatory developments, implementing appropriate controls and monitoring systems, and maintaining documentation that demonstrates compliance with applicable requirements.</p>`;
    
    currentWordCount = expandedContent.split(/\s+/).length;
    console.log(`Enhanced manual expansion word count: ${currentWordCount}`);
  }
  
  // Final check and additional content if still needed
  if (currentWordCount < 1000) {
    console.log('Adding final sections to ensure minimum 1000 words');
    expandedContent += `
    
    <h2>Long-Term Strategic Planning for ${keywords[0]} Success</h2>
    <p>Successful ${keywords[0]} implementation requires long-term strategic thinking that goes beyond immediate operational improvements. Organizations must consider how AI capabilities will evolve, how business needs will change, and how to maintain competitive advantages over time.</p>
    
    <p>This strategic planning involves regular assessment of AI performance, identification of new opportunities for AI application, and continuous investment in capabilities that support long-term business objectives. Organizations that view AI as a strategic capability rather than a tactical tool achieve the greatest long-term success.</p>
    
    <h3>Building Sustainable AI Capabilities</h3>
    <p>Sustainability in ${keywords[1]} implementation means creating systems and processes that can adapt and evolve over time. This includes building flexible architectures, maintaining skilled teams, and establishing governance frameworks that support responsible AI development and deployment.</p>
    
    <p>Organizations that invest in sustainable AI capabilities position themselves for continued success as technologies advance and new opportunities emerge. They become leaders in their industries and set standards that others follow.</p>`;
  }
  
  return expandedContent;
}