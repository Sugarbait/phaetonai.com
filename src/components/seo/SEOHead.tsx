import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  articlePublished?: string;
  articleModified?: string;
  author?: string;
  schema?: object[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Phaeton AI | AI-Powered Business Solutions & Automation",
  description = "Transform your business with Phaeton AI's intelligent solutions. Specializing in AI chatbots, voice assistants, AI video production & editing, and PIPEDA compliant automation tools for enterprise success.",
  keywords = [],
  canonical,
  ogImage = "https://cpkslvmydfdevdftieck.supabase.co/storage/v1/object/public/blog-images/phaetonimage.jpg",
  ogType = "website",
  articlePublished,
  articleModified,
  author,
  schema = []
}) => {
  // Core keywords that should appear on every page
  const coreKeywords = [
    "AI solutions",
    "artificial intelligence",
    "chatbots", 
    "voice assistants",
    "AI video production",
    "automated video editing",
    "AI video creation",
    "intelligent video automation",
    "business automation",
    "machine learning",
    "deep learning",
    "natural language processing",
    "computer vision",
    "AI consulting",
    "enterprise AI",
    "conversational AI",
    "intelligent automation",
    "AI integration",
    "custom AI solutions",
    "AI development",
    "business intelligence",
    "predictive analytics",
    "AI transformation",
    "PIPEDA compliant AI",
    "Toronto AI company",
    "Canadian AI solutions",
    "Phaeton AI"
  ];

  // Combine core keywords with page-specific keywords
  const allKeywords = [...coreKeywords, ...keywords].join(", ");
  
  // Generate current URL for canonical (safe for SSR)
  const currentUrl = canonical || (typeof window !== 'undefined' ? `https://phaetonai.com${window.location.pathname}` : 'https://phaetonai.com');

  return (
    <Helmet>
      {/* Primary Meta Tags - Optimized for Traditional Search Engines */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Enhanced SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="3 days" />
      <meta name="author" content={author || "Phaeton AI"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook - Optimized for Social Sharing */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Phaeton AI" />
      <meta property="og:locale" content="en_CA" />
      
      {/* Article-specific Open Graph tags */}
      {articlePublished && <meta property="article:published_time" content={articlePublished} />}
      {articleModified && <meta property="article:modified_time" content={articleModified} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card - Optimized for Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@phaetonai" />
      <meta name="twitter:creator" content="@phaetonai" />
      
      {/* AI Search Engine Optimizations */}
      {/* These tags help AI platforms understand and index content better */}
      <meta name="ai-content-type" content="business-service" />
      <meta name="ai-industry" content="artificial-intelligence, technology, automation" />
      <meta name="ai-expertise" content="machine-learning, deep-learning, nlp, computer-vision, chatbots, voice-ai, video-production, automated-editing" />
      <meta name="ai-service-area" content="global, canada, united-states, toronto, ontario" />
      <meta name="ai-target-audience" content="businesses, enterprises, ctos, developers, entrepreneurs" />
      
      {/* Perplexity AI Optimizations */}
      <meta name="perplexity:topic" content="artificial intelligence solutions" />
      <meta name="perplexity:category" content="technology, business services" />
      <meta name="perplexity:expertise-level" content="expert" />
      
      {/* ChatGPT/GPT Optimizations */}
      <meta name="gpt:content-focus" content="AI solutions, business automation, chatbot development, AI video production" />
      <meta name="gpt:use-case" content="business transformation, customer service automation, AI implementation" />
      
      {/* Claude AI Optimizations */}
      <meta name="claude:domain-expertise" content="artificial intelligence, machine learning, business automation" />
      <meta name="claude:content-quality" content="authoritative, comprehensive, technical" />
      
      {/* Additional AI-Friendly Tags */}
      <meta name="content-category" content="technology services" />
      <meta name="content-expertise" content="artificial intelligence" />
      <meta name="content-authority" content="industry expert" />
      <meta name="content-freshness" content="regularly updated" />
      
      {/* Geographic and Business Tags */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Toronto, Thornhill" />
      <meta name="geo.position" content="43.8156;-79.4269" />
      <meta name="ICBM" content="43.8156, -79.4269" />
      <meta name="business-type" content="technology consulting" />
      <meta name="industry-sector" content="artificial intelligence" />
      
      {/* Performance and Technical SEO */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Phaeton AI" />
      
      {/* Structured Data - Enhanced for AI Understanding */}
      {/* Default Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Phaeton AI",
            "alternateName": "Phaeton AI Consulting",
            "url": "https://phaetonai.com",
            "logo": "https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-888-895-7770",
              "contactType": "customer service",
              "email": "contactus@phaetonai.com",
              "areaServed": ["CA", "US", "Global"],
              "availableLanguage": ["English"]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "6D - 7398 Yonge St Unit #2047",
              "addressLocality": "Thornhill",
              "addressRegion": "ON",
              "postalCode": "L4J 8J2",
              "addressCountry": "CA"
            },
            "sameAs": [
              "https://phaetonai.com",
              "https://www.linkedin.com/company/phaetonai"
            ],
            "foundingDate": "2023",
            "description": "Leading artificial intelligence consulting company specializing in enterprise AI solutions, chatbot development, voice assistants, AI video production & editing, and business automation.",
            "industry": "Artificial Intelligence",
            "numberOfEmployees": "10-50",
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 43.8156,
                "longitude": -79.4269
              },
              "geoRadius": "50000"
            }
          })
        }}
      />
      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Phaeton AI",
            "url": "https://phaetonai.com",
            "description": "Transform your business with Phaeton AI's intelligent solutions. Specializing in AI chatbots, voice assistants, AI video production & editing, and PIPEDA compliant automation tools for enterprise success.",
            "publisher": {
              "@type": "Organization",
              "name": "Phaeton AI"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://phaetonai.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Consulting and Development Services",
            "description": "Comprehensive artificial intelligence consulting services including chatbot development, voice assistants, AI video production & editing, business automation, and enterprise AI solutions.",
            "provider": {
              "@type": "Organization",
              "name": "Phaeton AI"
            },
            "areaServed": ["Canada", "United States", "Global"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Solutions Catalog",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Chatbot Development",
                    "description": "Custom AI chatbot development for enterprise customer service and automation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Voice Assistant Solutions",
                    "description": "Intelligent voice assistant development for business automation and customer interaction"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Business Process Automation",
                    "description": "AI-powered workflow automation to streamline business operations and increase efficiency"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Video Production & Editing",
                    "description": "Intelligent video creation and automated editing solutions for scalable content production and marketing"
                  }
                }
              ]
            }
          })
        }}
      />
      {/* Page-specific Schema */}
      {schema.map((schemaItem, index) => (
        <script
          key={`page-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem)
          }}
        />
      ))}
    </Helmet>
  );
};

export default SEOHead;