import React, { useEffect } from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { triggerChatOpen } from '../components/ui/ChatWidget';
import SEOHead from '../components/seo/SEOHead';

const SupportPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Initialize Tally form
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (typeof Tally !== 'undefined') {
        // @ts-ignore
        Tally.loadEmbeds();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="pt-24 pb-16">
      <SEOHead 
        title="Support Center | Phaeton AI - Get Help with AI Solutions"
        description="Get expert support for your Phaeton AI solutions. Contact our team via phone, email, or chat for assistance with AI chatbots, voice assistants, and business automation systems."
        keywords={[
          "AI support",
          "technical support AI",
          "chatbot support",
          "voice assistant help",
          "AI implementation support",
          "Phaeton AI contact",
          "AI customer service",
          "enterprise AI support",
          "AI troubleshooting",
          "artificial intelligence help"
        ]}
        canonical="https://phaetonai.com/support"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Phaeton AI Support Center",
            "description": "Comprehensive support center for Phaeton AI services including phone, email, and live chat assistance for all AI solutions.",
            "url": "https://phaetonai.com/support",
            "mainEntity": {
              "@type": "Organization",
              "name": "Phaeton AI",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+1-888-895-7770",
                  "contactType": "customer service",
                  "areaServed": ["CA", "US", "Global"],
                  "availableLanguage": "English"
                },
                {
                  "@type": "ContactPoint",
                  "email": "support@phaetonai.com",
                  "contactType": "technical support",
                  "areaServed": ["CA", "US", "Global"]
                }
              ]
            }
          }
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Phaeton AI Support Center</h1>
          
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600">
              Choose your preferred way to connect with our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Support */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">Phone Support</h2>
              <p className="text-gray-600 mb-4">
                Talk to our AI Assistant Astra by Phone
              </p>
              <a 
                href="tel:1-888-895-7770" 
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                1 (888) 895-7770
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">Email Support</h2>
              <p className="text-gray-600 mb-4">
                Email us anytime
              </p>
              <a 
                href="mailto:support@phaetonai.com" 
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                support@phaetonai.com
              </a>
            </div>

            {/* Chat Support */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">Chat with Astra</h2>
              <p className="text-gray-600 mb-4">
                Get instant AI-powered support from our virtual assistant
              </p>
              <button
                onClick={() => {
                  console.log('Button clicked - attempting to open chat');
                  triggerChatOpen();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Chat with Astra
              </button>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Form</h2>
            <p className="text-gray-600 mb-8 text-center">
              Send us a message and we'll respond shortly.
            </p>
            <iframe 
              data-tally-src="https://tally.so/embed/nPB6Zb?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
              loading="lazy" 
              width="100%" 
              height="600" 
              frameBorder="0" 
              title="Contact form"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;