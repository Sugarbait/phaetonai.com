import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function generateContextualResponse(message: string, context: string, userName?: string): string {
  const lowerMessage = message.toLowerCase().trim();
  const greeting = userName ? `Hi ${userName}! ` : 'Hello! ';

  // Direct website information responses (answer immediately without deferring)
  if (lowerMessage.includes('cost per minute') || lowerMessage.includes('rate per minute') || lowerMessage.includes('minute cost') ||
      lowerMessage.includes('cost per call') || lowerMessage.includes('call cost') || lowerMessage.includes('per call') ||
      (lowerMessage.includes('cost') && lowerMessage.includes('minute')) ||
      (lowerMessage.includes('cost') && lowerMessage.includes('call')) ||
      (lowerMessage.includes('rate') && lowerMessage.includes('minute')) ||
      (lowerMessage.includes('rate') && lowerMessage.includes('call'))) {
    return `${greeting}Our AI calling service costs **0.16 cents per minute** for all our plans (Basic, Standard, and Premium).

**Key Pricing Details:**
• **0.16 cents per minute** for all calls
• **First 10 calls are FREE** on all plans
• **Setup fee starts at $99**
• Plans include 500-1500+ calls depending on tier
• Multiple phone numbers included (1-10 depending on plan)

**Plans Available:**
🔹 **Basic:** 500 calls, 1 phone number
🔹 **Standard:** 1,000 calls, 5 phone numbers (Most Popular)
🔹 **Premium:** 1,500+ calls, 10 phone numbers

Would you like more details about any specific plan or feature?`;
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return `${greeting}Here's our current pricing structure:

**🤖 AI Calling Services:**
• **Rate:** 0.16 cents per minute
• **Setup:** Starting at $99
• **First 10 calls FREE** on all plans

**📋 Plans:**
🔹 **Basic:** 500 calls, 1 phone number
🔹 **Standard:** 1,000 calls, 5 phone numbers ⭐ Most Popular
🔹 **Premium:** 1,500+ calls, 10 phone numbers

**🚀 Add-ons Available:**
• AI Marketing Strategy
• Custom AI Chatbot (unlimited conversations)
• Solo AI Scheduler
• Team AI Scheduler

All solutions are PIPEDA compliant and include advanced analytics, CRM integration, and priority support.

For detailed pricing on add-ons or custom solutions: 📞 1-888-895-7770`;
  }

  if (lowerMessage.includes('service') || lowerMessage.includes('solution') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do')) {
    return `${greeting}Phaeton AI offers comprehensive AI solutions:

**🎯 Core Services:**
• **AI Inbound/Outbound Calling** - 0.16¢/min, PIPEDA compliant
• **Custom AI Chatbots** - Unlimited conversations, GPT-powered
• **Voice Assistants** - Natural language processing
• **Business Process Automation** - Streamline workflows
• **AI Marketing Strategy** - Custom growth plans

**🔧 Key Features:**
• CRM Integration (Salesforce, HubSpot, etc.)
• Real-time Analytics & Reporting
• Call Transcription & Summary
• Multi-language Support
• Secure AWS Data Storage
• Priority Support

**📊 Scheduling Solutions:**
• Solo AI Scheduler (individuals)
• Team AI Scheduler (organizations)

All solutions include setup assistance and ongoing support. Which area interests you most?`;
  }

  // Use context to provide informed responses if available
  if (context && context.length > 50) {
    if (lowerMessage.includes('demo') || lowerMessage.includes('consultation')) {
      return `${greeting}I can help you get a demo! 

${context}

For a personalized demo, please contact us:
📞 **Call us:** 1-888-895-7770
📧 **Email us:** contactus@phaetonai.com

What specific AI solution would you like to see demonstrated?`;
    }

    // General contextual response
    return `${greeting}Based on our latest information:

${context}

Is there anything specific about our AI solutions you'd like to know more about?

**Quick Contact:**
📞 1-888-895-7770 | 📧 contactus@phaetonai.com`;
  }

  // Fallback to intelligent responses when no context available
  return generateIntelligentResponse(message, userName);
}

function generateIntelligentResponse(message: string, userName?: string): string {
  const lowerMessage = message.toLowerCase().trim();
  const greeting = userName ? `Hi ${userName}! ` : 'Hello! ';
  
  // Demo/consultation requests
  if (lowerMessage.includes('demo') || lowerMessage.includes('consultation') || lowerMessage.includes('meet')) {
    return `${greeting}I'd be happy to help you schedule a demo! Here are a few ways to get started:

📞 **Call us directly:** 1-888-895-7770
📧 **Email us:** contactus@phaetonai.com
🌐 **Visit our contact page:** https://phaetonai.com/contact

Our team will set up a personalized demo to show you exactly how our AI solutions can benefit your business. What type of AI solution are you most interested in exploring?`;
  }
  
  // Pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('fee')) {
    return `${greeting}Here's our current pricing structure:

**🤖 AI Calling Services:**
• **Rate:** 0.16 cents per minute
• **Setup:** Starting at $99
• **First 10 calls FREE** on all plans

**📋 Plans:**
🔹 **Basic:** 500 calls, 1 phone number
🔹 **Standard:** 1,000 calls, 5 phone numbers ⭐ Most Popular
🔹 **Premium:** 1,500+ calls, 10 phone numbers

**🚀 Add-ons Available:**
• AI Marketing Strategy
• Custom AI Chatbot (unlimited conversations)
• Solo AI Scheduler
• Team AI Scheduler

For detailed pricing on add-ons or custom solutions: 📞 1-888-895-7770`;
  }
  
  // Services/solutions questions
  if (lowerMessage.includes('service') || lowerMessage.includes('solution') || lowerMessage.includes('offer') || lowerMessage.includes('do you have')) {
    return `${greeting}Phaeton AI specializes in cutting-edge AI solutions:

🤖 **AI Chatbots** - Intelligent customer service automation
🗣️ **Voice Assistants** - AI-powered phone and voice interactions  
⚡ **Business Automation** - Streamline workflows with AI
🧠 **Machine Learning** - Custom AI models for your business
🏥 **Healthcare AI** - PIPEDA-compliant solutions for healthcare
📊 **Analytics & Insights** - AI-driven business intelligence

Which area interests you most? I can provide more specific information!`;
  }
  
  // Contact/support questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('speak') || lowerMessage.includes('talk')) {
    return `${greeting}I'm here to help! For direct assistance:

📞 **Phone:** 1-888-895-7770
📧 **Email:** contactus@phaetonai.com
🌐 **Website:** https://phaetonai.com/contact
📍 **Address:** 6D - 7398 Yonge St Unit #2047, Thornhill, ON L4J 8J2

You can also continue chatting with me here - I can answer questions about our AI solutions, pricing, and services. What would you like to know?`;
  }
  
  // AI/technology questions
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning') || lowerMessage.includes('chatbot')) {
    return `${greeting}Great question about AI! Phaeton AI is at the forefront of artificial intelligence innovation:

🎯 **Our Expertise:**
• Conversational AI & Chatbots
• Natural Language Processing
• Machine Learning & Deep Learning
• Computer Vision
• Automated Business Processes

🏆 **Why Choose Phaeton AI:**
• PIPEDA compliant (especially important for Canadian businesses)
• Industry-specific solutions
• 24/7 support and maintenance
• Proven track record with enterprise clients

What specific AI challenge can we help you solve?`;
  }
  
  // Default intelligent response for other questions
  return `${greeting}I'm Astra, Phaeton AI's assistant. I can help you with:

💡 **AI Solutions & Services** - Learn about our offerings
💰 **Pricing & Consultation** - Get custom quotes
📞 **Contact Information** - Speak with our team
🏥 **Industry-Specific Solutions** - Healthcare, finance, retail & more
🤖 **Technology Questions** - AI, machine learning, automation

**Quick Contact:**
📞 1-888-895-7770 | 📧 contactus@phaetonai.com

What would you like to know about our AI solutions?`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const requestBody = await req.json();
    
    // Handle both formats: {message: "text"} and webhook format {chatInput: "text"}
    let message = requestBody.message || requestBody.chatInput;
    const sessionId = requestBody.sessionId || req.headers.get('x-session-id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metadata = requestBody.metadata || {};
    const isUserInfo = metadata.isUserInfo || false;
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    let response = '';
    let isWebhookResponse = false;

    // Check for direct website answers FIRST (before any other processing)
    const lowerMessage = message.toLowerCase().trim();
    
    console.log('Processing message:', message);
    console.log('Lowercase message:', lowerMessage);
    
    // Direct pricing questions that should NOT trigger tally sheet - be very specific
    if (lowerMessage.includes('cost per minute') || 
        lowerMessage.includes('rate per minute') || 
        lowerMessage.includes('minute cost') ||
        lowerMessage.includes('per minute cost') ||
        lowerMessage.includes('minute rate') ||
        lowerMessage.includes('per minute rate') ||
        lowerMessage.includes('cost per call') ||
        lowerMessage.includes('call cost') ||
        lowerMessage.includes('call rate') ||
        lowerMessage.includes('per call cost') ||
        lowerMessage.includes('per call rate') ||
        lowerMessage.includes('cost of calls') ||
        lowerMessage.includes('cost of a call') ||
        lowerMessage.includes('how much per call') ||
        lowerMessage.includes('how much per minute') ||
        (lowerMessage.includes('cost') && lowerMessage.includes('minute')) ||
        (lowerMessage.includes('cost') && lowerMessage.includes('call')) ||
        (lowerMessage.includes('rate') && lowerMessage.includes('minute')) ||
        (lowerMessage.includes('rate') && lowerMessage.includes('call')) ||
        (lowerMessage.includes('price') && lowerMessage.includes('minute')) ||
        (lowerMessage.includes('price') && lowerMessage.includes('call'))) {
      console.log('✅ DIRECT ANSWER TRIGGERED for message:', message);
      response = generateContextualResponse(message, '', metadata.userName);
      isWebhookResponse = false;
    }
    // Basic pricing questions (avoid "cost" alone to prevent tally sheet trigger)
    else if ((lowerMessage.includes('price') || lowerMessage.includes('pricing')) && 
             !lowerMessage.includes('subscription') && !lowerMessage.includes('monthly') && !lowerMessage.includes('total')) {
      response = generateContextualResponse(message, '', metadata.userName);
      isWebhookResponse = false;
    }
    // Handle very basic "cost" questions directly (short questions) - VERY BROAD TO CATCH EVERYTHING
    else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('rate') ||
             lowerMessage.includes('how much') || lowerMessage.includes('pricing')) {
      console.log('💰 COST-RELATED QUESTION INTERCEPTED - PREVENTING TALLY SHEET');
      response = generateContextualResponse(message, '', metadata.userName);
      isWebhookResponse = false;
    }
    // Service/solution questions
    else if (lowerMessage.includes('service') || lowerMessage.includes('solution') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do')) {
      response = generateContextualResponse(message, '', metadata.userName);
      isWebhookResponse = false;
    }
    // Handle user info submission differently
    else if (isUserInfo) {
      const userName = metadata.userName || '';
      
      // Store user info in session and create personalized welcome
      response = `Hello ${userName}! Welcome to Phaeton AI. 

I'm Astra, your AI assistant. I'm here to help you discover how our AI solutions can transform your business.

🚀 **I can help you with:**
• Custom AI chatbots and virtual assistants
• Voice AI solutions for customer service
• Business process automation
• PIPEDA-compliant healthcare AI solutions
• Machine learning implementation

What brings you to Phaeton AI today? Are you looking to automate customer service, streamline operations, or explore a specific AI solution?`;
      
      isWebhookResponse = true;
    } else {
      console.log('❌ No direct answer matched, proceeding to webhook for message:', message);
      // For complex questions, get context from knowledge base first
      let context = '';
      
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (supabaseUrl && supabaseKey) {
          const knowledgeResponse = await fetch(`${supabaseUrl}/functions/v1/query-knowledge-base`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ query: message, limit: 3 })
          });

          if (knowledgeResponse.ok) {
            const knowledgeData = await knowledgeResponse.json();
            context = knowledgeData.context || '';
            console.log('Knowledge base context found:', context.length > 0);
          }
        }
      } catch (knowledgeError) {
        console.log('Knowledge base query failed, using fallback:', knowledgeError.message);
      }

      // Try external webhook for complex questions, then fallback to enhanced responses
      try {
        console.log('Attempting webhook call for message:', message);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        // Use the exact same format as the working chat widget
        const webhookPayload = {
          action: "sendMessage",
          sessionId: sessionId,
          route: "chat",
          chatInput: message,
          metadata: {
            userId: metadata.userId || "",
            userName: metadata.userName || ""
          }
        };
        
        const webhookResponse = await fetch('https://n8n.phaetonai.ca/webhook/57de9426-b592-48ff-8c8d-a54583409650/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (webhookResponse.ok) {
          const webhookData = await webhookResponse.json();
          console.log('Webhook response data:', webhookData);
          
          const webhookMessage = webhookData.response || webhookData.message || webhookData.output;
          
          if (webhookMessage && webhookMessage.trim() && webhookMessage.trim() !== message.trim()) {
            response = webhookMessage;
            isWebhookResponse = true;
            console.log('Using webhook response');
          } else {
            console.log('Webhook returned empty or invalid response, using fallback');
            throw new Error('Webhook returned invalid response');
          }
        } else {
          console.log(`Webhook failed with status: ${webhookResponse.status}`);
          throw new Error(`Webhook request failed: ${webhookResponse.status}`);
        }
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        
        // Enhanced fallback response using knowledge base context
        response = generateContextualResponse(message, context, metadata.userName);
        isWebhookResponse = false;
      }
    }

    const responseTime = Date.now() - startTime;

    // Log the interaction to Supabase (non-blocking)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (supabaseUrl && supabaseKey) {
        const supabaseClient = createClient(supabaseUrl, supabaseKey);
        
        const interactionData = {
          session_id: sessionId,
          user_message: message,
          bot_response: response,
          response_time_ms: responseTime,
          user_name: metadata.userName || null,
          user_email: metadata.userId || null,
          is_user_info: isUserInfo,
          used_knowledge_base: !isWebhookResponse
        };

        supabaseClient
          .from('chatbot_interactions')
          .insert(interactionData)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to log interaction:', error);
            }
          });
      }
    } catch (loggingError) {
      console.error('Logging error:', loggingError);
    }

    return new Response(
      JSON.stringify({ 
        output: response,  // Chat widget expects 'output' field
        response,          // Keep both for compatibility
        sessionId,
        responseTime,
        source: isWebhookResponse ? 'webhook' : 'knowledge_base'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Enhanced chatbot error:', error);
    
    const responseTime = Date.now() - startTime;
    const fallbackResponse = generateIntelligentResponse('help');

    return new Response(
      JSON.stringify({ 
        output: fallbackResponse,
        response: fallbackResponse,
        responseTime,
        source: 'fallback'
      }),
      { headers: corsHeaders }
    );
  }
});