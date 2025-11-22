import React, { useEffect } from 'react';
import ContactInfo from '../components/contact/ContactInfo';
import SEOHead from '../components/seo/SEOHead';

const ContactPage = () => {
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

  const contactSchema = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Phaeton AI - AI Solutions Consultation",
      "description": "Contact Phaeton AI for enterprise AI solutions, chatbot development, voice assistant implementation, and business automation consultation. Schedule a demo or get pricing for your AI transformation project.",
      "url": "https://phaetonai.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "Phaeton AI",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-888-895-7770",
          "email": "contactus@phaetonai.com",
          "contactType": "customer service",
          "areaServed": ["CA", "US", "Global"]
        }
      }
    }
  ];

  return (
    <div className="pt-24">
      <SEOHead
        title="Contact Phaeton AI | Schedule AI Solutions Demo & Get Pricing"
        description="Contact Phaeton AI to schedule a demo of our enterprise AI solutions including chatbot development, voice assistants, and business automation. Get custom pricing for your AI transformation project today!"
        keywords={[
          "contact AI consulting",
          "schedule AI demo", 
          "AI solutions pricing",
          "chatbot consultation",
          "voice assistant demo",
          "business automation consultation",
          "enterprise AI pricing",
          "AI transformation consultation",
          "book AI demo",
          "AI implementation consultation"
        ]}
        canonical="https://phaetonai.com/contact"
        ogType="website"
        schema={contactSchema}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">
            Ready to transform your business with cutting-edge artificial intelligence solutions? Contact Phaeton AI today for a personalized consultation on AI chatbot development, voice assistant implementation, business process automation, and enterprise AI transformation. Get custom pricing and schedule your demo now!
          </p>
          
          {/* Hidden SEO content */}
          <div className="sr-only" itemScope itemType="https://schema.org/ContactPage">
            <span itemProp="name">Phaeton AI Contact Page</span>
            <span itemProp="description">Professional AI consulting services contact page for scheduling demos and consultations</span>
            <span itemProp="keywords">AI consultation, chatbot demo, voice assistant consultation, business automation demo, enterprise AI pricing</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Reach out to us using the contact form below, and let's discuss how our AI-driven solutions can collaborate to shape the future of your brand in the digital landscape.
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
          <ContactInfo />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;