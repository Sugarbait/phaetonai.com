import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Get environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const BLACK_FOREST_API_KEY = Deno.env.get('BLACK_FOREST_API_KEY');

// Comprehensive AI content strategy with extensive variety
const aiContentCategories = [
  {
    category: "AI Fundamentals & Core Concepts",
    topics: [
      "Understanding Neural Networks: From Perceptrons to Deep Learning",
      "The Mathematics Behind Machine Learning: Linear Algebra Explained",
      "Supervised vs Unsupervised Learning: Which Approach is Right?",
      "Reinforcement Learning: How AI Learns Through Trial and Error",
      "Natural Language Processing: Teaching Machines to Understand Text",
      "Computer Vision: How AI Interprets and Analyzes Visual Data",
      "The Evolution of AI: From Rule-Based Systems to Modern Neural Networks",
      "Gradient Descent and Backpropagation: The Heart of AI Learning"
    ],
    keywords: ["neural networks", "machine learning algorithms", "deep learning", "AI fundamentals", "artificial intelligence basics"]
  },
  {
    category: "Business Applications & Industry Transformation",
    topics: [
      "AI in Healthcare: Revolutionizing Diagnosis and Treatment",
      "Smart Manufacturing: How AI is Transforming Production Lines",
      "Financial Services Revolution: AI in Banking and Investment",
      "Retail AI: Personalization and Inventory Management",
      "AI-Powered Marketing: Predictive Analytics and Customer Insights",
      "Supply Chain Intelligence: Optimizing Logistics with AI",
      "Human Resources AI: Recruitment and Employee Management",
      "Real Estate AI: Property Valuation and Market Prediction"
    ],
    keywords: ["AI applications", "business automation", "industry transformation", "AI implementation", "digital transformation"]
  },
  {
    category: "Emerging Technologies & Innovation",
    topics: [
      "Generative AI: Creating Content with Artificial Intelligence",
      "Large Language Models: The Power Behind ChatGPT and Beyond",
      "AI Edge Computing: Bringing Intelligence to IoT Devices",
      "Quantum AI: The Next Frontier in Machine Learning",
      "Autonomous Vehicles: AI Behind Self-Driving Technology",
      "AI in Robotics: Building Intelligent Physical Systems",
      "Federated Learning: Training AI While Preserving Privacy",
      "Neuromorphic Computing: Brain-Inspired AI Hardware"
    ],
    keywords: ["generative AI", "LLM", "emerging AI", "AI innovation", "cutting-edge technology"]
  },
  {
    category: "Ethics, Safety & Governance",
    topics: [
      "AI Ethics: Building Responsible Artificial Intelligence Systems",
      "Algorithmic Bias: Identifying and Preventing AI Discrimination",
      "AI Transparency: Making Black Box Models Explainable",
      "Data Privacy in the Age of AI: Protecting Personal Information",
      "AI Governance: Regulatory Frameworks for Artificial Intelligence",
      "The Future of AI Safety: Alignment and Control Problems",
      "AI and Employment: Addressing Job Displacement Concerns",
      "Environmental Impact of AI: The Carbon Footprint of Machine Learning"
    ],
    keywords: ["AI ethics", "responsible AI", "AI safety", "algorithmic bias", "AI governance"]
  },
  {
    category: "Technical Implementation & Development",
    topics: [
      "MLOps: Operationalizing Machine Learning at Scale",
      "AI Model Deployment: From Development to Production",
      "Data Engineering for AI: Building Robust ML Pipelines",
      "AI Testing and Validation: Ensuring Model Reliability",
      "AutoML: Democratizing Machine Learning Development",
      "Transfer Learning: Leveraging Pre-trained AI Models",
      "AI Performance Optimization: Speed and Efficiency Techniques",
      "Cloud AI Services: AWS, Google Cloud, and Azure ML Platforms"
    ],
    keywords: ["MLOps", "AI development", "machine learning engineering", "AI deployment", "technical AI"]
  },
  {
    category: "Data Science & Analytics",
    topics: [
      "Feature Engineering: Crafting Better Inputs for AI Models",
      "Data Visualization for AI: Making Machine Learning Interpretable",
      "Time Series Forecasting with AI: Predicting Future Trends",
      "Anomaly Detection: Using AI to Identify Unusual Patterns",
      "Recommendation Systems: How AI Personalizes User Experience",
      "A/B Testing for AI: Measuring Machine Learning Impact",
      "Data Quality for AI: Garbage In, Garbage Out Principles",
      "Synthetic Data Generation: Creating Training Data with AI"
    ],
    keywords: ["data science", "analytics", "AI modeling", "data engineering", "machine learning data"]
  },
  {
    category: "AI Tools & Platforms",
    topics: [
      "TensorFlow vs PyTorch: Choosing the Right AI Framework",
      "Hugging Face Transformers: Democratizing NLP Models",
      "Jupyter Notebooks: The Data Scientist's Best Friend",
      "Docker for AI: Containerizing Machine Learning Applications",
      "Kubernetes and AI: Scaling ML Workloads in the Cloud",
      "Git for Data Science: Version Control for AI Projects",
      "AI Development IDEs: VS Code, PyCharm, and Specialized Tools",
      "Open Source AI: Building on Community-Driven Innovation"
    ],
    keywords: ["AI tools", "machine learning frameworks", "development platforms", "AI software", "ML infrastructure"]
  },
  {
    category: "Future Trends & Predictions",
    topics: [
      "Artificial General Intelligence: The Path to Human-Level AI",
      "AI in Space Exploration: Machine Learning Beyond Earth",
      "Brain-Computer Interfaces: Merging Human and Artificial Intelligence",
      "AI-Generated Art and Creativity: The Future of Digital Expression",
      "Smart Cities: How AI Will Transform Urban Living",
      "AI in Education: Personalized Learning for Every Student",
      "Agricultural AI: Feeding the World with Smart Farming",
      "AI and Climate Change: Technology Solutions for Environmental Challenges"
    ],
    keywords: ["future AI", "AI trends", "artificial general intelligence", "AI predictions", "emerging applications"]
  }
];

// Function to generate a unique slug from title
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50); // Leave room for timestamp
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
}

// Function to get all available topics as flat array with metadata
function getAllAvailableTopics() {
  const allTopics = [];
  aiContentCategories.forEach((category, categoryIndex) => {
    category.topics.forEach((topic, topicIndex) => {
      allTopics.push({
        category: category.category,
        topic: topic,
        keywords: category.keywords,
        id: `${categoryIndex}-${topicIndex}`,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      });
    });
  });
  return allTopics;
}

// Function to select unique content strategy (never repeats)
async function selectUniqueContentStrategy(supabaseClient: any) {
  try {
    // Get all existing blog post titles to avoid duplicates
    const { data: existingPosts, error } = await supabaseClient
      .from('blog_posts')
      .select('title, slug');

    if (error) {
      console.error('Error fetching existing posts:', error);
      // Fallback to random selection if database query fails
      return selectRandomContentStrategy();
    }

    const existingTitles = new Set(existingPosts?.map(post => post.title.toLowerCase()) || []);
    const existingSlugs = new Set(existingPosts?.map(post => post.slug) || []);
    
    // Get all available topics
    const allTopics = getAllAvailableTopics();
    console.log(`Found ${allTopics.length} total topic possibilities`);
    
    // Filter out topics that already exist
    const unusedTopics = allTopics.filter(topicData => {
      const titleMatch = existingTitles.has(topicData.topic.toLowerCase());
      const slugMatch = existingSlugs.has(topicData.slug);
      return !titleMatch && !slugMatch;
    });

    console.log(`Found ${unusedTopics.length} unused topics remaining`);

    if (unusedTopics.length === 0) {
      console.warn('All predefined topics have been used! Generating new unique topic...');
      return await generateNewUniqueTopicWithAI(supabaseClient, existingTitles);
    }

    // Select random unused topic
    const selectedTopic = unusedTopics[Math.floor(Math.random() * unusedTopics.length)];
    console.log(`Selected unique topic: "${selectedTopic.topic}" from category: "${selectedTopic.category}"`);
    
    return selectedTopic;

  } catch (error) {
    console.error('Error in selectUniqueContentStrategy:', error);
    return selectRandomContentStrategy();
  }
}

// Fallback to random selection
function selectRandomContentStrategy() {
  const allTopics = getAllAvailableTopics();
  const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
  console.log(`Using fallback random topic: "${randomTopic.topic}"`);
  return randomTopic;
}

// Generate completely new AI topic when all predefined topics are used
async function generateNewUniqueTopicWithAI(supabaseClient: any, existingTitles: Set<string>) {
  const uniqueTopicPrompt = `Generate a completely unique, specific AI-related blog post title that hasn't been covered before. 
  
  REQUIREMENTS:
  - Must be about artificial intelligence, machine learning, or related technology
  - Should be specific and actionable (not generic)
  - Must be different from these existing topics: ${Array.from(existingTitles).slice(0, 10).join(', ')}
  - Should be 8-12 words long
  - Should appeal to business professionals and tech enthusiasts
  - Must not be a duplicate or slight variation of existing content

  EXAMPLES OF GOOD UNIQUE TOPICS:
  - "AI-Powered Predictive Maintenance: Reducing Industrial Equipment Downtime"
  - "Conversational AI in Mental Health: Therapeutic Chatbots and Patient Care"
  - "Machine Learning for Fraud Prevention in Cryptocurrency Trading"
  - "AI-Driven Content Moderation: Balancing Free Speech and Safety"

  Return only the title, nothing else.`;

  try {
    if (OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an expert AI researcher who creates unique, specific blog topics.' },
            { role: 'user', content: uniqueTopicPrompt }
          ],
          max_tokens: 100,
          temperature: 0.8
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generatedTitle = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
        
        console.log(`Generated new unique topic with AI: "${generatedTitle}"`);
        
        return {
          category: "AI Innovation & Emerging Applications",
          topic: generatedTitle,
          keywords: ["AI innovation", "machine learning", "artificial intelligence", "emerging technology", "AI applications"],
          id: `generated-${Date.now()}`,
          slug: generatedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        };
      }
    }
  } catch (error) {
    console.error('Error generating unique topic with AI:', error);
  }

  // Ultimate fallback - create topic with timestamp
  const timestamp = new Date().getFullYear();
  const fallbackTopic = `AI Innovation Trends and Future Predictions for ${timestamp}`;
  
  return {
    category: "AI Innovation & Future Trends",
    topic: fallbackTopic,
    keywords: ["AI trends", "future AI", "AI predictions", "innovation", "technology trends"],
    id: `fallback-${Date.now()}`,
    slug: fallbackTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  };
}

// Function to save image to Supabase storage
async function saveImageToSupabase(imageUrl: string, fileName: string, supabaseClient: any): Promise<string> {
  try {
    console.log('📥 Downloading image from Flux temp URL:', imageUrl.substring(0, 50) + '...');
    
    // Download the image from temporary Flux URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    const imageFile = new Uint8Array(imageBuffer);
    
    console.log(`✅ Image downloaded successfully, size: ${imageFile.length} bytes`);
    
    // Ensure bucket exists by trying to upload
    console.log('💾 Uploading to Supabase storage bucket: blog-images');
    const { data, error } = await supabaseClient.storage
      .from('blog-images')
      .upload(fileName, imageFile, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error('❌ Supabase storage upload error:', error);
      
      // If bucket doesn't exist, create it
      if (error.message?.includes('Bucket not found')) {
        console.log('📦 Creating blog-images bucket...');
        const { error: createBucketError } = await supabaseClient.storage.createBucket('blog-images', {
          public: true
        });
        
        if (createBucketError) {
          console.error('❌ Failed to create bucket:', createBucketError);
        } else {
          console.log('✅ Bucket created, retrying upload...');
          const { data: retryData, error: retryError } = await supabaseClient.storage
            .from('blog-images')
            .upload(fileName, imageFile, {
              contentType: 'image/jpeg',
              upsert: true
            });
          
          if (retryError) {
            throw new Error(`Upload failed after bucket creation: ${retryError.message}`);
          }
        }
      } else {
        throw new Error(`Storage upload failed: ${error.message}`);
      }
    }
    
    console.log('✅ Image uploaded successfully to Supabase storage:', fileName);
    
    // Get the public URL from Supabase storage
    const { data: { publicUrl } } = supabaseClient.storage
      .from('blog-images')
      .getPublicUrl(fileName);
    
    console.log('🌐 Supabase public URL generated:', publicUrl);
    
    // Verify the URL is from Supabase (not Flux temp URL)
    if (!publicUrl.includes('supabase.co')) {
      throw new Error(`Generated URL is not from Supabase: ${publicUrl}`);
    }
    
    return publicUrl;
    
  } catch (error) {
    console.error('💥 Error in saveImageToSupabase:', error);
    throw error;
  }
}

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

// Function to generate and save AI image
async function generateAndSaveImage(prompt: string, supabaseClient: any): Promise<string> {
  console.log('BLACK_FOREST_API_KEY available:', !!BLACK_FOREST_API_KEY);
  console.log('API key length:', BLACK_FOREST_API_KEY ? BLACK_FOREST_API_KEY.length : 'undefined');
  
  // Force use of the API key from environment or hardcoded for testing
  const apiKey = BLACK_FOREST_API_KEY || '475ca923d6ac8f0e6c50a0ceddda4cc66502d052b0093ba0eb34f1419';
  console.log('Using API key (first 10 chars):', apiKey.substring(0, 10) + '...');
  
  if (!apiKey) {
    console.log('⚠️ No API key available at all');
    return getRandomFallbackImage();
  }

  try {
    console.log('Generating AI image with prompt:', prompt);
    
    // Use correct API endpoint from docs
    const response = await fetch('https://api.bfl.ai/v1/flux-pro-1.1', {
      method: 'POST',
      headers: {
        'x-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: "16:10" // Better for blog headers
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Black Forest API error:', response.status, response.statusText);
      console.error('❌ Error details:', errorText);
      throw new Error(`Black Forest API failed: ${response.status} - ${errorText}`);
    }

    const initialResult = await response.json();
    console.log('✅ Initial Black Forest API response received');
    
    let tempImageUrl;
    
    // Handle polling mechanism
    if (initialResult.polling_url) {
      console.log('🔄 Polling for image generation...');
      
      let attempts = 0;
      const maxAttempts = 60; // 30 seconds max
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        attempts++;
        
        const pollResponse = await fetch(initialResult.polling_url, {
          headers: { 'x-key': apiKey }
        });
        
        if (!pollResponse.ok) {
          const pollErrorText = await pollResponse.text();
          console.error('❌ Polling error:', pollResponse.status, pollErrorText);
          throw new Error(`Polling failed: ${pollResponse.status}`);
        }
        
        const pollResult = await pollResponse.json();
        console.log(`🔄 Poll attempt ${attempts}, status:`, pollResult.status);
        
        if (pollResult.status === 'Ready') {
          if (!pollResult.result?.sample) {
            throw new Error('Image generation completed but no image URL provided');
          }
          tempImageUrl = pollResult.result.sample;
          console.log('✅ Image generation completed after', attempts, 'attempts');
          break;
        } else if (pollResult.status === 'Error' || pollResult.status === 'Failed') {
          throw new Error(`Image generation failed: ${JSON.stringify(pollResult)}`);
        }
      }
      
      if (!tempImageUrl) {
        throw new Error('Image generation timed out after 30 seconds');
      }
    } else {
      // Direct response (fallback for older API)
      if (!initialResult.result?.sample) {
        throw new Error(`Invalid API response: ${JSON.stringify(initialResult)}`);
      }
      tempImageUrl = initialResult.result.sample;
    }

    console.log('🎯 Got temporary image URL:', tempImageUrl);

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `ai-generated-${timestamp}.jpeg`;

    // Save to Supabase storage
    const permanentUrl = await saveImageToSupabase(tempImageUrl, fileName, supabaseClient);
    
    console.log('AI image generated and saved successfully:', permanentUrl);
    return permanentUrl;

  } catch (error) {
    console.error('💥 Error generating AI image:', error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    // Don't fall back to Pexels - let the error propagate so we can see what's wrong
    throw error;
  }
}

// Fallback images - High quality AI and technology themed images from Pexels
function getRandomFallbackImage(): string {
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
  console.log('Selected fallback image:', selectedImage);
  return selectedImage;
}

// Function to count words
function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  const textOnly = text.replace(/<[^>]*>/g, ' ');
  const words = textOnly.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

// Function to validate content quality
function validateContentQuality(content: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  const textOnly = content.replace(/<[^>]*>/g, ' ');
  const words = textOnly.split(/\s+/).filter(word => word.length > 0);
  
  // Check for excessive repetition
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length > 3) { // Only check words longer than 3 characters
      wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
    }
  });
  
  // Flag if any word appears more than 10 times (except common words)
  const commonWords = new Set(['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were']);
  
  for (const [word, count] of wordCounts) {
    if (count > 10 && !commonWords.has(word)) {
      issues.push(`Word "${word}" appears ${count} times - likely repetitive content`);
    }
  }
  
  // Check for sentences longer than 100 words (likely run-on nonsense)
  const sentences = textOnly.split(/[.!?]+/).filter(s => s.trim().length > 0);
  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/);
    if (sentenceWords.length > 100) {
      issues.push(`Found sentence with ${sentenceWords.length} words - likely run-on content`);
    }
  }
  
  // Check for excessive consecutive similar words
  for (let i = 0; i < words.length - 5; i++) {
    const consecutiveWords = words.slice(i, i + 6);
    const uniqueWords = new Set(consecutiveWords.map(w => w.toLowerCase()));
    if (uniqueWords.size <= 3) {
      issues.push(`Found repetitive sequence: "${consecutiveWords.join(' ')}"...`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

serve(async (req) => {
  // Always handle CORS first
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log('🚀 Starting blog generation');
    console.log('📋 Request method:', req.method);
    console.log('🔑 Environment variables check:');
    console.log('- OPENAI_API_KEY available:', !!OPENAI_API_KEY);
    console.log('- BLACK_FOREST_API_KEY available:', !!BLACK_FOREST_API_KEY);
    console.log('- BLACK_FOREST_API_KEY length:', BLACK_FOREST_API_KEY ? BLACK_FOREST_API_KEY.length : 'undefined');

    const { 
      autoPublish = true
    } = await req.json().catch(() => ({}));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Select unique content strategy (never repeats)
    console.log('🎯 Selecting unique topic to avoid duplicates...');
    const contentStrategy = await selectUniqueContentStrategy(supabaseClient);
    
    console.log(`Generating content for: ${contentStrategy.topic}`);

    let blogData;

    console.log('🔑 OpenAI API Key check:', OPENAI_API_KEY ? 'Available' : 'Missing');
    console.log('🎯 Topic selected:', contentStrategy.topic);
    console.log('🏷️ Keywords:', contentStrategy.keywords.join(', '));

    if (OPENAI_API_KEY) {
      console.log('✅ Generating blog post with OpenAI GPT-4');
      console.log('🔑 API Key length:', OPENAI_API_KEY.length);
      
      // Create varied content structures to avoid repetitive headings
      const contentStructures = [
        {
          name: "Problem-Solution",
          structure: "1. The Overlooked Crisis, 2. Why Traditional Approaches Backfire, 3. The Game-Changing Alternative, 4. Your Implementation Roadmap, 5. Measuring Real Impact",
          headingStyle: "Use specific crisis/solution language like 'The $2M Mistake Everyone Makes', 'Why 73% of Projects Collapse', 'The Method Disrupting [Industry]', 'Your 90-Day Action Plan'"
        },
        {
          name: "Step-by-Step Guide", 
          structure: "1. The Foundation That Changes Everything, 2. Phase One Breakthrough, 3. Advanced Mastery Techniques, 4. The Pitfalls That Destroy Progress, 5. Your Next Level Strategy",
          headingStyle: "Use transformation language like 'The Foundation That Changes Everything', 'Phase One Breakthrough', 'Advanced Mastery Unlocked', 'The Pitfalls That Destroy Progress'"
        },
        {
          name: "Trend Analysis",
          structure: "1. The Shift Nobody Saw Coming, 2. Three Forces Reshaping Everything, 3. The Players Winning Big, 4. What This Means for Your Future, 5. The Smart Money Strategy",
          headingStyle: "Use disruption language like 'The Shift Nobody Saw Coming', 'Three Forces Reshaping [Industry]', 'The Players Winning Big', 'What This Means for Your Future'"
        },
        {
          name: "Comparison Framework",
          structure: "1. The Choice That Defines Success, 2. Option A vs Option B: The Real Difference, 3. The Hidden Costs Nobody Mentions, 4. When Each Approach Wins, 5. Your Decision Framework",
          headingStyle: "Use decision language like 'The Choice That Defines Success', 'The Real Difference Between X and Y', 'The Hidden Costs Nobody Mentions', 'When Each Approach Wins'"
        },
        {
          name: "Deep Dive",
          structure: "1. The Science Behind the Hype, 2. Inside the Black Box, 3. Where Rubber Meets Road, 4. The Companies Getting It Right, 5. The Next Frontier",
          headingStyle: "Use investigative language like 'The Science Behind the Hype', 'Inside the Black Box', 'Where Rubber Meets Road', 'The Companies Getting It Right'"
        },
        {
          name: "Strategic Overview",
          structure: "1. The Battlefield Report, 2. The Opportunities Others Miss, 3. Your Strategic Playbook, 4. The Risks That Kill Strategies, 5. Your Competitive Edge",
          headingStyle: "Use strategic language like 'The Battlefield Report', 'The Opportunities Others Miss', 'Your Strategic Playbook', 'The Risks That Kill Strategies'"
        }
      ];
      
      const randomStructure = contentStructures[Math.floor(Math.random() * contentStructures.length)];
      
      // Generate unique session data to ensure no repetitive patterns
      const uniqueId = Math.random().toString(36).substring(7);
      const timestamp = new Date().toISOString();
      const randomSeed = Math.floor(Math.random() * 10000);
      
      // Add random perspective variations to force unique content
      const perspectives = [
        "Write from the viewpoint of a startup CEO who discovered this through trial and error",
        "Write as a technical researcher who has been studying this field for 5 years",
        "Write as a consultant who has seen companies fail and succeed with this approach",
        "Write as a skeptical industry veteran who initially doubted this but was proven wrong",
        "Write as an enthusiastic early adopter who has implemented this successfully",
        "Write as an investigative journalist uncovering hidden truths in the industry"
      ];
      const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
      
      // Add random tone variations
      const tones = [
        "urgent and actionable",
        "analytical and data-driven", 
        "conversational and accessible",
        "bold and contrarian",
        "practical and implementation-focused",
        "investigative and revealing"
      ];
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      
      const prompt = `ARTICLE #${uniqueId}: Write about "${contentStrategy.topic}"

PERSPECTIVE: ${randomPerspective}
TONE: ${randomTone}

TARGET: 800-1000 words of comprehensive, valuable content.

STRUCTURE (5 sections):
- Introduction: 150 words
- Section 1: 200 words
- Section 2: 200 words  
- Section 3: 200 words
- Conclusion: 150 words
= TARGET: 900 words total

Use ${randomStructure.structure} approach:
- Write detailed paragraphs (90-120 words each)
- Include 2-3 company examples per section with specific results
- Add relevant statistics and practical outcomes
- Provide actionable implementation guidance
- Focus on comprehensive coverage with practical value

AIM FOR 800-1000 WORDS.

HEADINGS: Use numbers, questions, urgent, stories, or contrarian formats
Keywords: ${contentStrategy.keywords.join(', ')}
HTML: h2, h3, p, ul, li, strong only

Return JSON:
{
  "title": "SEO title with perspective",
  "excerpt": "Meta description 140-160 chars", 
  "content": "HTML content with original headings",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "${contentStrategy.category}"
}`;

      console.log('🚀 Sending OpenAI request with unique session data:', {
        uniqueId: uniqueId,
        perspective: randomPerspective,
        tone: randomTone,
        structure: randomStructure.name
      });
      
      console.log('📝 Full prompt preview:', prompt.substring(0, 500) + '...');

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert content writer. Write comprehensive business articles targeting 800-1000 words.

TARGET: 800-1000 words of valuable, well-researched content.

STRUCTURE:
- Introduction: 140-180 words
- Section 1: 180-220 words
- Section 2: 180-220 words  
- Section 3: 180-220 words
- Conclusion: 140-180 words
= TOTAL: 820-1020 words

REQUIREMENTS:
- Write substantial paragraphs (80-120 words each)
- Include 2-3 company examples per section with concrete results
- Add relevant statistics and data points
- Provide implementation details and actionable guidance
- Focus on practical value for business readers

GOAL: Create authoritative, comprehensive content around 900 words.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 8000,
          temperature: 0.7,
          presence_penalty: 0.4,
          frequency_penalty: 0.3,
          top_p: 0.95
        })
      });

      if (!openaiResponse.ok) {
        console.error('OpenAI API error:', openaiResponse.status);
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error details:', errorText);
        throw new Error(`OpenAI API failed with status ${openaiResponse.status}: ${errorText}`);
      } else {
        const openaiData = await openaiResponse.json();
        console.log('OpenAI response received:', JSON.stringify(openaiData, null, 2));
        
        if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
          console.error('Invalid OpenAI response structure:', openaiData);
          throw new Error('Invalid OpenAI response structure');
        }
        
        const content = openaiData.choices[0].message.content;
        console.log('Raw OpenAI content:', content);
        
        try {
          // Try to extract JSON if it's wrapped in markdown code blocks
          let jsonContent = content;
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonContent = jsonMatch[1];
            console.log('Extracted JSON from markdown');
          }
          
          // Clean the JSON content to handle control characters and formatting issues
          jsonContent = jsonContent
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .replace(/\n/g, '\\n') // Escape newlines
            .replace(/\r/g, '\\r') // Escape carriage returns  
            .replace(/\t/g, '\\t') // Escape tabs
            .replace(/"/g, '"') // Replace smart quotes with regular quotes
            .replace(/"/g, '"') // Replace smart quotes with regular quotes
            .replace(/'/g, "'") // Replace smart apostrophes
            .replace(/'/g, "'") // Replace smart apostrophes
            .replace(/–/g, '-') // Replace en dash
            .replace(/—/g, '-') // Replace em dash
            .trim();
          
          console.log('Cleaned JSON content length:', jsonContent.length);
          
          blogData = JSON.parse(jsonContent);
          console.log('Successfully parsed OpenAI response');
          
          // Validate that required fields exist
          if (!blogData.title || !blogData.content || !blogData.excerpt) {
            throw new Error('Missing required fields in OpenAI response');
          }
          
          // Additional validation and cleaning of content fields
          blogData.title = blogData.title.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
          blogData.excerpt = blogData.excerpt.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
          
          console.log('✅ OpenAI response validated and cleaned successfully');
          
        } catch (parseError) {
          console.error('Failed to parse JSON after cleaning:', parseError);
          console.error('Content that failed to parse (first 1000 chars):', jsonContent ? jsonContent.substring(0, 1000) : 'null');
          console.error('Parse error details:', parseError.message);
          
          // If JSON parsing still fails, create a structured response from the content
          console.log('Attempting to extract data manually from failed JSON...');
          
          try {
            // Try to extract title, excerpt, and content manually
            const titleMatch = content.match(/"title":\s*"([^"]+)"/);
            const excerptMatch = content.match(/"excerpt":\s*"([^"]+)"/);
            const contentMatch = content.match(/"content":\s*"([\s\S]*?)"/);
            const categoryMatch = content.match(/"category":\s*"([^"]+)"/);
            
            if (titleMatch && contentMatch) {
              blogData = {
                title: titleMatch[1].replace(/\\"/g, '"').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim(),
                excerpt: excerptMatch ? excerptMatch[1].replace(/\\"/g, '"').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim() : `Exploring ${contentStrategy.topic} and its impact on modern business.`,
                content: contentMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/[\x00-\x1F\x7F-\x9F]/g, ''),
                keywords: contentStrategy.keywords,
                category: categoryMatch ? categoryMatch[1] : contentStrategy.category
              };
              console.log('✅ Successfully extracted data manually from failed JSON');
            } else {
              throw new Error('Could not extract required fields from malformed response');
            }
          } catch (manualError) {
            console.error('Manual extraction also failed:', manualError);
            throw new Error(`Failed to parse OpenAI response: ${parseError.message}. Manual extraction failed: ${manualError.message}`);
          }
        }
      }
    } else {
      console.error('❌ CRITICAL: OpenAI API key not available - cannot generate content');
      throw new Error('OpenAI API key is required for blog generation.');
    }

    // Validate word count and ensure it meets requirements
    const wordCount = countWords(blogData.content);
    console.log(`Initial content word count: ${wordCount}`);
    
    // Set practical minimum - accept content that's at least 500 words
    if (wordCount < 500) {
      console.error(`❌ CRITICAL: Content too short (${wordCount} words) - minimum 500 words required`);
      return new Response(JSON.stringify({
        success: false,
        error: `Blog generation failed - content too short (${wordCount} words, minimum 500 required)`,
        wordCount: wordCount,
        contentTooShort: true
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // Validate content quality to prevent repetitive AI-generated nonsense
    const qualityCheck = validateContentQuality(blogData.content);
    if (!qualityCheck.isValid) {
      console.error(`❌ QUALITY CHECK FAILED: Content has quality issues:`, qualityCheck.issues);
      return new Response(JSON.stringify({
        success: false,
        error: `Blog generation failed - content quality issues detected: ${qualityCheck.issues.join('; ')}`,
        wordCount: wordCount,
        qualityIssues: qualityCheck.issues,
        contentQualityFailed: true
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // If content is under 1000 words, attempt to expand it automatically
    if (wordCount < 1000) {
      console.log(`🔄 Content is ${wordCount} words, attempting to expand to 1000+ words...`);
      
      try {
        const expansionPrompt = `Expand the following blog post content to reach approximately 1000-1200 words while maintaining quality and coherence. Add more detailed explanations, additional examples, and deeper insights.

CURRENT CONTENT (${wordCount} words):
${blogData.content}

EXPANSION REQUIREMENTS:
- Target: 1000-1200 words total
- Add more detailed explanations and context
- Include additional company examples and case studies
- Expand on existing points with more depth
- Add relevant statistics and data points
- Maintain the same tone and structure
- Return only the expanded HTML content

Expand this content naturally to reach the target word count.`;

        const expansionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are an expert content editor who expands articles to reach target word counts while maintaining quality. Return only the expanded HTML content, no additional text.'
              },
              {
                role: 'user',
                content: expansionPrompt
              }
            ],
            max_tokens: 8000,
            temperature: 0.7
          })
        });

        if (expansionResponse.ok) {
          const expansionData = await expansionResponse.json();
          const expandedContent = expansionData.choices[0].message.content.trim();
          
          // Validate the expanded content
          const expandedWordCount = countWords(expandedContent);
          console.log(`📈 Expanded content word count: ${expandedWordCount}`);
          
          if (expandedWordCount > wordCount && expandedWordCount <= 1500) {
            blogData.content = expandedContent;
            console.log(`✅ Successfully expanded content from ${wordCount} to ${expandedWordCount} words`);
          } else {
            console.warn(`⚠️ Expansion didn't improve word count significantly, keeping original`);
          }
        } else {
          console.warn(`⚠️ Content expansion failed, keeping original content`);
        }
        
      } catch (expansionError) {
        console.warn(`⚠️ Content expansion error: ${expansionError.message}, keeping original content`);
      }
    }

    const finalWordCount = countWords(blogData.content);
    console.log(`📊 Final content: ${finalWordCount} words - ${finalWordCount >= 1000 ? 'meets target' : 'acceptable length'}`);

    // Generate slug
    const slug = generateSlug(blogData.title);
    
    // Generate AI image with topic-based prompt and dynamic color scheme
    console.log('🎨 Starting AI image generation process...');
    const colorScheme = generateColorScheme(contentStrategy.topic);
    console.log(`🎨 Using color scheme: ${colorScheme} for topic: ${contentStrategy.topic}`);
    const imagePrompt = `Professional, high-quality illustration representing "${contentStrategy.topic}". Modern, clean, business-focused design with subtle technology elements. Color palette: ${colorScheme}. Photorealistic style, well-lit, 16:10 aspect ratio suitable for blog header.`;
    
    let imageUrl;
    try {
      console.log('🚀 Calling generateAndSaveImage...');
      imageUrl = await generateAndSaveImage(imagePrompt, supabaseClient);
      console.log('✅ Image generation completed, URL:', imageUrl);
      
      // Check if we got a Pexels URL (fallback) vs Supabase URL (success)
      if (imageUrl.includes('pexels.com')) {
        console.log('❌ WARNING: Got Pexels fallback image instead of AI generated');
      } else if (imageUrl.includes('supabase.co')) {
        console.log('🎉 SUCCESS: Got Supabase-hosted AI generated image');
      }
    } catch (error) {
      console.error('💥 Image generation failed:', error);
      imageUrl = getRandomFallbackImage();
    }

    // Store the blog post
    const { data: newPost, error: insertError } = await supabaseClient
      .from('blog_posts')
      .insert({
        title: blogData.title,
        slug: slug,
        content: blogData.content,
        excerpt: blogData.excerpt,
        image_url: imageUrl,
        keywords: blogData.keywords,
        published_at: autoPublish ? new Date().toISOString() : null,
        ai_generated: true,
        generation_method: 'ai'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to store blog post: ${insertError.message}`);
    }

    const publishedWordCount = countWords(newPost.content);
    console.log(`Blog post created successfully with ${publishedWordCount} words`);

    return new Response(
      JSON.stringify({ 
        message: 'AI blog post generated successfully',
        post: {
          id: newPost.id,
          title: newPost.title,
          slug: newPost.slug,
          wordCount: publishedWordCount,
          published: autoPublish,
          aiGenerated: true,
          imageSource: imageUrl.includes('supabase.co') ? 'Flux AI generated & stored in Supabase' : 'Fallback image'
        },
        contentStrategy: {
          category: contentStrategy.category,
          topic: contentStrategy.topic,
          keywords: contentStrategy.keywords
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Blog generation error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});