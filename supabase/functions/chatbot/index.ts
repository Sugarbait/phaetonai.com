import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

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
    return `Our pricing is customized based on your specific needs and requirements. For detailed pricing information:

📞 **Call us:** 1-888-895-7770
📧 **Email us:** contactus@phaetonai.com

We offer competitive rates for:
• AI Chatbots & Virtual Assistants
• Voice AI Solutions
• Business Process Automation
• Machine Learning Implementation

Let's discuss your project and provide you with a tailored quote!`;
  }
  
  // Services/solutions questions
  if (lowerMessage.includes('service') || lowerMessage.includes('solution') || lowerMessage.includes('offer') || lowerMessage.includes('do you have')) {
    return `Phaeton AI specializes in cutting-edge AI solutions:

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
    return `I'm here to help! For direct assistance:

📞 **Phone:** 1-888-895-7770
📧 **Email:** contactus@phaetonai.com
🌐 **Website:** https://phaetonai.com/contact
📍 **Address:** 6D - 7398 Yonge St Unit #2047, Thornhill, ON L4J 8J2

You can also continue chatting with me here - I can answer questions about our AI solutions, pricing, and services. What would you like to know?`;
  }
  
  // AI/technology questions
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning') || lowerMessage.includes('chatbot')) {
    return `Great question about AI! Phaeton AI is at the forefront of artificial intelligence innovation:

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
  
  // Industries question
  if (lowerMessage.includes('industry') || lowerMessage.includes('healthcare') || lowerMessage.includes('finance') || lowerMessage.includes('retail')) {
    return `We serve businesses across multiple industries:

🏥 **Healthcare** - PIPEDA-compliant AI solutions
🏪 **Retail & E-commerce** - Customer service automation
💼 **Professional Services** - Workflow optimization
🏭 **Manufacturing** - Process automation
💰 **Finance** - Intelligent document processing
🎓 **Education** - Learning management systems

Each solution is tailored to industry-specific needs and compliance requirements. What industry are you in?`;
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

    // Handle user info submission differently
    if (isUserInfo) {
      const userName = metadata.userName || '';
      const userEmail = metadata.userId || '';
      
      // Store user info in session and create personalized welcome
      response = `Hello ${userName}! Welcome to Phaeton AI. 

I'm Astra, your AI assistant. I see you're contacting us from ${userEmail}. I'm here to help you discover how our AI solutions can transform your business.

🚀 **I can help you with:**
• Custom AI chatbots and virtual assistants
• Voice AI solutions for customer service
• Business process automation
• PIPEDA-compliant healthcare AI solutions
• Machine learning implementation

What brings you to Phaeton AI today? Are you looking to automate customer service, streamline operations, or explore a specific AI solution?`;
      
      isWebhookResponse = true;
    } else {
      // For regular messages, try the external webhook first, then fallback to intelligent responses
      try {
      // Forward the message to the external webhook
      const webhookResponse = await fetch('https://n8n.phaetonai.ca/webhook/57de9426-b592-48ff-8c8d-a54583409650/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        console.log('Webhook response data:', webhookData);
        
        // Extract response from webhook data
        const webhookMessage = webhookData.response || webhookData.message || webhookData.output;
        
        if (webhookMessage && webhookMessage.trim() !== message.trim()) {
          response = webhookMessage;
          isWebhookResponse = true;
        } else {
          // If webhook returns the same message or empty, use fallback
          throw new Error('Webhook returned invalid response');
        }
      } else {
        console.log(`Webhook failed with status: ${webhookResponse.status}`);
        throw new Error(`Webhook request failed: ${webhookResponse.status}`);
      }
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      
      // Intelligent fallback response based on message content
      response = generateIntelligentResponse(message, metadata.userName);
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
        
        // Insert interaction data (don't await to avoid blocking the response)
        const interactionData = {
          session_id: sessionId,
          user_message: message,
          bot_response: response,
          response_time_ms: responseTime,
          user_name: metadata.userName || null,
          user_email: metadata.userId || null,
          is_user_info: isUserInfo
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
      // Don't let logging errors affect the chatbot response
    }

    return new Response(
      JSON.stringify({ 
        output: response,  // Chat widget expects 'output' field
        response,          // Keep both for compatibility
        sessionId,
        responseTime
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Chatbot error:', error);
    
    const responseTime = Date.now() - startTime;
    
    // Fallback response
    const fallbackResponse = generateIntelligentResponse('help');

    return new Response(
      JSON.stringify({ 
        output: fallbackResponse,  // Chat widget expects 'output' field
        response: fallbackResponse, // Keep both for compatibility
        responseTime
      }),
      { headers: corsHeaders }
    );
  }
});