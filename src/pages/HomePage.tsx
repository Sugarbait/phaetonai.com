import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import Hero from '../components/home/Hero';
import VoiceAgentShowcase from '../components/home/VoiceAgentShowcase';
import ClientsMarquee from '../components/home/ClientsMarquee';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';
import About from '../components/home/About';
import Pricing from '../components/home/Pricing';

const HomePage = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Check if terms were recently updated (show toast for new visitors)
    const termsUpdateDate = '2025-06-06'; // Current update date
    const dismissedUpdatesKey = 'terms_dismissed_updates';
    
    // Clean up old localStorage key if it exists
    const oldKey = localStorage.getItem('terms_toast_shown');
    if (oldKey) {
      localStorage.removeItem('terms_toast_shown');
    }
    
    const dismissedUpdates = JSON.parse(localStorage.getItem(dismissedUpdatesKey) || '[]');
    
    // Show toast only if user hasn't dismissed this specific update
    if (!dismissedUpdates.includes(termsUpdateDate)) {
      // Show toast after a short delay
      const timer = setTimeout(() => {
        setShowToast(true);
      }, 3000); // 3 second delay on homepage
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleCloseToast = () => {
    setShowToast(false);
    // Mark that user has dismissed this specific update
    const termsUpdateDate = '2025-06-06';
    const dismissedUpdatesKey = 'terms_dismissed_updates';
    const dismissedUpdates = JSON.parse(localStorage.getItem(dismissedUpdatesKey) || '[]');
    
    if (!dismissedUpdates.includes(termsUpdateDate)) {
      dismissedUpdates.push(termsUpdateDate);
      localStorage.setItem(dismissedUpdatesKey, JSON.stringify(dismissedUpdates));
    }
  };

  const handleViewTerms = () => {
    handleCloseToast();
  };

  return (
    <main>
      <SEOHead 
        title="Phaeton AI | AI-Powered Business Solutions & Automation"
        description="Transform your business with Phaeton AI's intelligent solutions. Leading Canadian AI consulting company specializing in enterprise chatbot development, voice assistants, business automation, and PIPEDA compliant AI solutions for digital transformation success."
        keywords={[
          "AI chatbot development",
          "voice assistant technology", 
          "business process automation",
          "enterprise AI solutions",
          "conversational AI platform",
          "intelligent customer service",
          "AI implementation consulting",
          "digital transformation",
          "machine learning applications",
          "AI integration services"
        ]}
        canonical="https://phaetonai.com"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Phaeton AI - AI-Powered Business Solutions",
            "description": "Transform your business with AI chatbots, voice assistants, and intelligent automation tools from Phaeton AI.",
            "url": "https://phaetonai.com",
            "mainEntity": {
              "@type": "Organization",
              "name": "Phaeton AI"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://phaetonai.com"
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Phaeton AI",
            "description": "Leading AI consulting company in Canada specializing in enterprise chatbot development, voice assistants, and business automation solutions.",
            "url": "https://phaetonai.com",
            "telephone": "+1-888-895-7770",
            "email": "contactus@phaetonai.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "6D - 7398 Yonge St Unit #2047",
              "addressLocality": "Thornhill",
              "addressRegion": "ON",
              "postalCode": "L4J 8J2",
              "addressCountry": "CA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 43.8156,
              "longitude": -79.4269
            },
            "openingHours": "Mo-Fr 09:00-17:00",
            "priceRange": "$$$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        ]}
      />
      <Hero />
      <ClientsMarquee />
      <VoiceAgentShowcase />
      <Features />
      <HowItWorks />
      <About />
      <Pricing />
      <Testimonials />
      <CTA />

      {/* Terms Update Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 relative animate-slide-up">
            <button
              onClick={handleCloseToast}
              className="absolute top-2 left-2 text-white hover:text-blue-200 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pl-8 text-center md:text-left">
              <h4 className="font-semibold mb-1">Terms of Service Updated</h4>
              <p className="text-sm text-blue-100 mb-2">
                Our Terms of Service have been updated with new sections including User Responsibilities and SLA.
              </p>
              <Link 
                to="/terms" 
                className="text-sm text-white underline hover:text-blue-200 transition-colors"
                onClick={handleViewTerms}
              >
                View Updated Terms
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;