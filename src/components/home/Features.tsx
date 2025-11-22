import React, { useRef } from 'react';
import { MessageSquare, Workflow, Users, PhoneCall, PhoneOutgoing, BarChart, Video } from 'lucide-react';

const features = [
  {
    title: 'Enterprise AI Chatbot Development & Voice Assistant Solutions',
    description: 'Develop custom conversational AI chatbots and intelligent voice assistants powered by advanced machine learning and natural language processing. Our enterprise-grade solutions provide 24/7 automated customer support, lead qualification, and seamless omnichannel customer engagement across web, mobile, and voice platforms.',
    icon: MessageSquare,
    keywords: 'AI chatbot development, voice assistant solutions, conversational AI, customer support automation'
  },
  {
    title: 'Intelligent Business Process Automation & AI Workflow Integration',
    description: 'Transform your business operations with intelligent automation solutions that streamline repetitive tasks, integrate with existing enterprise systems, and optimize workflows. Our AI-powered automation increases operational efficiency, reduces manual errors, and scales business processes across departments.',
    icon: Workflow,
    keywords: 'business process automation, AI workflow integration, intelligent automation, enterprise efficiency'
  },
  {
    title: 'AI-Powered Inbound Call Management & Customer Service Automation',
    description: 'Deploy sophisticated AI inbound assistants that handle customer inquiries, route calls intelligently, and maintain brand consistency. Our natural language understanding technology provides human-like customer interactions while reducing operational costs and improving response times.',
    icon: PhoneCall,
    keywords: 'AI inbound assistants, customer service automation, call management AI, automated customer support'
  },
  {
    title: 'Automated Outbound AI Calling & Lead Generation Systems',
    description: 'Revolutionize sales and marketing outreach with AI-powered outbound calling systems. Our intelligent automated callers conduct lead qualification, appointment setting, and customer surveys while providing real-time analytics and campaign optimization insights.',
    icon: PhoneOutgoing,
    keywords: 'AI outbound calling, automated lead generation, sales automation, AI marketing campaigns'
  },
  {
    title: 'Advanced GPT Integration & Large Language Model Implementation',
    description: 'Leverage cutting-edge GPT models and large language models for enhanced natural language understanding, content generation, document analysis, and intelligent decision-making. Our custom LLM implementations provide enterprise-grade AI capabilities tailored to your specific industry needs.',
    icon: Users,
    keywords: 'GPT integration, large language models, LLM implementation, natural language processing, AI content generation'
  },
  {
    title: 'AI Video Production & Intelligent Editing Solutions',
    description: 'Transform your video content strategy with AI-powered video production and automated editing services. Our intelligent video solutions provide automated content creation, smart editing workflows, personalized video generation, and scalable video production for marketing, training, and customer engagement across all platforms.',
    icon: Video,
    keywords: 'AI video production, automated video editing, intelligent video creation, video content automation, AI video marketing'
  },
];

// Individual Feature Card Component
const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 8;
    const rotateY = (centerX - x) / 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  };

  return (
    <div 
      ref={cardRef}
      className="group relative bg-white rounded-xl p-8 border border-gray-100 text-center sm:text-left cursor-pointer h-full flex flex-col"
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Gradient overlay that appears on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          transform: 'translateZ(-1px)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col flex-grow" style={{ transform: 'translateZ(20px)' }}>
        {/* Icon Container */}
        <div 
          className="w-12 h-12 rounded-lg bg-blue-50 p-2.5 mb-6 text-blue-600 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110 mx-auto sm:mx-0"
          style={{ transform: 'translateZ(30px)' }}
        >
          <feature.icon className="w-full h-full" />
        </div>

        {/* Title */}
        <h3 
          className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
          style={{ transform: 'translateZ(25px)' }}
          itemProp="name"
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p 
          className="text-gray-600"
          style={{ transform: 'translateZ(15px)' }}
          itemProp="description"
        >
          {feature.description}
        </p>
        
        {/* Hidden SEO content */}
        <span className="sr-only" itemProp="keywords">{feature.keywords}</span>
        <span className="sr-only" itemProp="provider" itemScope itemType="https://schema.org/Organization">
          <span itemProp="name">Phaeton AI</span>
        </span>
      </div>

      {/* Subtle shine effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
          transform: 'translateX(-100%) translateZ(5px)'
        }}
      />
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Our AI Solutions</h2>
          <p className="section-subtitle">
            Comprehensive AI-powered solutions designed to transform your business operations and customer interactions with full PIPEDA compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20 items-stretch">
          {features.map((feature, index) => (
            <div key={index}>
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>

        {/* AI Demo Video Section - Moved here */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="section-title">See Our AI Assistant in Action</h3>
              <p className="section-subtitle">
                Watch our AI voice assistant handle real customer interactions naturally
              </p>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
                <iframe
                  src="https://www.youtube.com/embed/Sql1qkrYKy4?si=PftPmvlCRu4wC2OU"
                  title="Phaeton AI Voice Assistant Demo"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Video highlights */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Natural Conversation</h3>
                  <p className="text-sm text-gray-600">Human-like dialogue with context understanding</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PhoneCall className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-Time Processing</h3>
                  <p className="text-sm text-gray-600">Instant responses with intelligent routing</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
                  <p className="text-sm text-gray-600">Detailed call analytics and performance metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;