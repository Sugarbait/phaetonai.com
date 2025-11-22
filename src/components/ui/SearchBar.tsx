import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  type: 'page' | 'feature' | 'pricing' | 'blog';
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  keywords: string[];
}

const staticSearchableContent: SearchResult[] = [
  // Features
  {
    title: 'AI Chatbots & Voice Assistants',
    description: 'Create intelligent conversational agents that engage customers seamlessly across digital platforms, providing personalized support 24/7.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'AI Workflow Automation',
    description: 'Streamline repetitive processes and integrate with your existing systems to enhance efficiency in data handling, customer support, and marketing.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'AI Inbound Assistants',
    description: 'Transform customer service with intelligent systems that handle inquiries, route calls, and maintain your brand voice with human-like understanding.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'AI Outbound Callers',
    description: 'Revolutionize customer outreach with automated call campaigns that provide real-time analytics and insights.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'Advanced GPT Integration',
    description: 'Harness the power of the latest GPT models for enhanced natural language understanding, content generation, and sophisticated decision-making capabilities.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'AI Video Production & Editing',
    description: 'Transform video content with AI-powered production, automated editing, personalized video generation, and scalable video workflows for marketing and training.',
    path: '/#features',
    type: 'feature'
  },

  // Pricing Section - Updated with current contact-us pricing structure
  {
    title: 'AI Solutions & Pricing',
    description: 'Explore our AI inbound and outbound caller solutions with custom pricing tailored to your business needs. Contact us for detailed pricing information.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Basic AI Solution',
    description: 'Perfect for small businesses - 500 calls, first 10 calls free, includes 1 phone number. Cost per call available on request.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Standard AI Solution',
    description: 'Ideal for growing businesses - 1,000 calls, first 10 calls free, includes 5 phone numbers. Contact us for pricing details.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Premium AI Solution',
    description: 'Premium AI solutions for enterprises - 1,500+ calls, includes 10 phone numbers. Custom pricing based on your requirements.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'AI Marketing Add-on',
    description: 'AI-powered marketing strategy for business growth with custom marketing plans, target audience analysis, and ROI projections.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Custom AI Chatbot Add-on',
    description: 'Enhance customer support with intelligent chatbot using latest GPT models, unlimited conversations, and multi-language support.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Solo AI Scheduler',
    description: 'Perfect for individual professionals - unlimited appointments, calendar integration, automated reminders, and client self-booking.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Team AI Scheduler',
    description: 'Comprehensive scheduling for teams - everything in Solo plus multiple team members, advanced reporting, and role-based access.',
    path: '/#pricing',
    type: 'pricing'
  },

  // Main Pages
  {
    title: 'Home',
    description: 'Phaeton AI homepage with AI solutions, features, and company information. Transform customer interactions with AI solutions.',
    path: '/',
    type: 'page'
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with our team to discuss your AI needs and schedule a demo. Phone: 1 (888) 895-7770, Email: contactus@phaetonai.com',
    path: '/contact',
    type: 'page'
  },
  {
    title: 'Support Center',
    description: 'Get help with your AI implementation through phone, email, or chat support. Talk to our AI Assistant Astra.',
    path: '/support',
    type: 'page'
  },
  {
    title: 'FAQ - Frequently Asked Questions',
    description: 'Frequently asked questions about our AI services, pricing, implementation, and compliance. Find answers to common questions.',
    path: '/faq',
    type: 'page'
  },
  {
    title: 'Blog',
    description: 'Latest insights about AI technology and industry trends. Weekly AI insights and business intelligence articles.',
    path: '/blog',
    type: 'page'
  },
  {
    title: 'Blog Admin',
    description: 'Admin interface for creating and managing blog posts with AI generation capabilities.',
    path: '/admin/blog',
    type: 'page'
  },
  {
    title: 'Privacy Policy',
    description: 'Learn about how we protect your data and privacy with PIPEDA compliance. 30-day data retention policy.',
    path: '/privacy',
    type: 'page'
  },
  {
    title: 'Terms of Service',
    description: 'Read our terms and conditions including subscription, billing, user responsibilities, and 7-day refund policy.',
    path: '/terms',
    type: 'page'
  },
  {
    title: 'Security & Compliance',
    description: 'Comprehensive security measures, encryption protocols, PIPEDA compliance, HIPAA compliance, data protection standards, and enterprise-grade security implementation.',
    path: '/security',
    type: 'page'
  },
  {
    title: 'Hero Page',
    description: 'Interactive particle animation demonstration page showcasing modern web technologies.',
    path: '/hero',
    type: 'page'
  },
  {
    title: 'Site Analytics',
    description: 'Real-time website analytics dashboard with visitor tracking, hourly statistics, and geographic insights.',
    path: '/sitedata',
    type: 'page'
  },

  // About Section
  {
    title: 'About Us',
    description: 'Learn about Phaeton AI, our mission, and why we are the right choice for AI solutions. 99% client satisfaction, 100% PIPEDA compliant.',
    path: '/#about',
    type: 'page'
  },
  {
    title: 'How It Works',
    description: 'Our proven 4-step process for implementing AI solutions: Initial Consultation, Custom Solution Design, AI Implementation, Training & Optimization.',
    path: '/#how-it-works',
    type: 'page'
  },
  {
    title: 'Testimonials',
    description: 'Hear from organizations that have transformed their operations with Phaeton AI solutions.',
    path: '/#testimonials',
    type: 'page'
  },

  // Services & Solutions (detailed)
  {
    title: 'AI Voice Assistant Demo',
    description: 'Watch our AI voice assistant handle real customer interactions naturally with human-like dialogue and real-time processing.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'PIPEDA Compliance',
    description: 'All our AI solutions maintain strict compliance with Canadian privacy regulations and data protection standards.',
    path: '/#about',
    type: 'feature'
  },
  {
    title: 'Real-Time Analytics',
    description: 'Get detailed call analytics and performance metrics from your AI systems with comprehensive reporting.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'Natural Language Processing',
    description: 'Advanced AI technology for human-like understanding and conversation with context awareness.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'CRM Integration',
    description: 'Seamless integration with your existing CRM systems and workflow tools for unified operations.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'Call Transcription',
    description: 'Automatic transcription and summary of all AI assistant interactions with secure data storage.',
    path: '/#pricing',
    type: 'feature'
  },
  {
    title: 'Multi-language Support',
    description: 'AI chatbots and voice assistants supporting multiple languages for global customer service.',
    path: '/#pricing',
    type: 'feature'
  },
  {
    title: 'AI Video Content Creation',
    description: 'Automated video creation with intelligent editing, personalized content generation, and multi-platform optimization for enhanced engagement.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'Automated Video Editing',
    description: 'AI-powered video editing with smart scene detection, automatic color correction, and intelligent audio optimization to reduce production time.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'Personalized Video Generation',
    description: 'Scale personalized video campaigns with AI-generated content tailored to individual customers and specific marketing objectives.',
    path: '/#features',
    type: 'feature'
  },
  {
    title: 'Video Production Automation',
    description: 'Streamline video production workflows with AI automation for marketing, training, and customer engagement content at scale.',
    path: '/#features',
    type: 'feature'
  },

  // Company Information
  {
    title: 'Contact Information',
    description: 'Phone: 1 (888) 895-7770, Email: contactus@phaetonai.com, Located in Thornhill, ON. 6D - 7398 Yonge St Unit #2047.',
    path: '/contact',
    type: 'page'
  },
  {
    title: 'Schedule a Demo',
    description: 'Book a personalized demonstration of our AI solutions tailored to your business needs and requirements.',
    path: '/contact',
    type: 'page'
  },
  {
    title: 'Get Custom Pricing',
    description: 'Contact us for personalized pricing quotes tailored to your business needs and requirements. All pricing available on request.',
    path: '/contact',
    type: 'page'
  },

  // Technical & Implementation
  {
    title: 'Implementation Process',
    description: 'Our 4-step process: Initial Consultation, Custom Solution Design, AI Implementation, Training & Optimization. 2-4 weeks for standard solutions.',
    path: '/#how-it-works',
    type: 'page'
  },
  {
    title: 'Security & Compliance',
    description: 'Enterprise-grade security with PIPEDA, HIPAA compliance and secure cloud storage on Microsoft Azure and AWS servers.',
    path: '/privacy',
    type: 'page'
  },
  {
    title: 'Data Storage',
    description: 'All data stored securely on Microsoft Azure and AWS servers with encryption, 30-day retention policy.',
    path: '/privacy',
    type: 'page'
  },
  {
    title: 'Custom AI Implementation',
    description: 'Contact us for detailed information about implementation costs and setup requirements for your AI solutions.',
    path: '/#pricing',
    type: 'pricing'
  },

  // Updated Service Details
  {
    title: 'AI Inbound and Outbound Callers',
    description: 'Transform customer service and outreach with intelligent call handling, routing, and automated campaigns. Cost per call available on request.',
    path: '/#pricing',
    type: 'feature'
  },
  {
    title: 'Contact Us for Pricing',
    description: 'All solutions feature custom pricing based on your specific needs. First 10 calls free with transparent pricing and no hidden fees.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'Phone Numbers Included',
    description: 'Basic solution includes 1 phone number, Standard includes 5 phone numbers, Premium includes 10 phone numbers.',
    path: '/#pricing',
    type: 'pricing'
  },
  {
    title: 'AWS Secure Storage',
    description: 'Secure data storage on AWS servers with encryption, compliance monitoring, and 24/7 security monitoring.',
    path: '/privacy',
    type: 'feature'
  },
  {
    title: 'Microsoft Azure Integration',
    description: 'Enterprise-grade infrastructure with Microsoft Azure for scalable, reliable AI solutions.',
    path: '/privacy',
    type: 'feature'
  },
  {
    title: 'Weekly Blog Updates',
    description: 'Stay informed with our weekly AI insights and business intelligence blog posts covering industry trends.',
    path: '/blog',
    type: 'page'
  },
  {
    title: 'AI Blog Generation',
    description: 'Automated weekly blog post generation with comprehensive AI content covering business applications and trends.',
    path: '/admin/blog',
    type: 'feature'
  },
  {
    title: 'Service Level Agreement',
    description: '99.9% uptime guarantee with 24-hour support response time. Reliable service with comprehensive SLA.',
    path: '/terms',
    type: 'page'
  },
  {
    title: 'Refund Policy',
    description: '7-day refund policy for initial subscription purchase. Contact us for details about implementation and setup policies.',
    path: '/terms',
    type: 'pricing'
  },
  {
    title: 'User Responsibilities',
    description: 'Guidelines for responsible use of AI services including compliance with laws and proper usage of AI-generated content.',
    path: '/terms',
    type: 'page'
  }
];

const categories = ["All", "Services", "Pricing", "Technical", "Compliance", "Support"];

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnBlogPage = location.pathname === '/blog';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load blog posts for search
    const loadBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, keywords')
          .order('published_at', { ascending: false });

        if (!error && data) {
          setBlogPosts(data);
        }
      } catch (error) {
        console.error('Error loading blog posts for search:', error);
      }
    };

    loadBlogPosts();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const searchTerms = query.toLowerCase().split(' ');
      
      // Search static content
      const staticResults = staticSearchableContent.filter(item =>
        searchTerms.every(term =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term)
        )
      );

      // Search blog posts
      const blogResults: SearchResult[] = blogPosts
        .filter(post =>
          searchTerms.every(term =>
            post.title.toLowerCase().includes(term) ||
            post.excerpt.toLowerCase().includes(term) ||
            post.keywords?.some(keyword => keyword.toLowerCase().includes(term))
          )
        )
        .map(post => ({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          type: 'blog' as const
        }));

      // Combine and sort results (blog posts first, then static content)
      const combinedResults = [...blogResults, ...staticResults];
      setResults(combinedResults);
    } else {
      setResults([]);
    }
  }, [query, blogPosts]);

  const handleSearchClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    if (result.path.startsWith('/#')) {
      const [_, section] = result.path.split('#');
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(result.path);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-purple-100 text-purple-800';
      case 'pricing':
        return 'bg-green-100 text-green-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={handleSearchClick}
        className={`p-2 hover:text-gray-700 focus:outline-none ${isOnBlogPage ? 'text-white hover:text-gray-200' : 'text-gray-500'}`}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen max-w-md bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search features, pricing, pages, blog posts..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-4 divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-4"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor(result.type)}`}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="mt-4 text-center text-gray-500 py-4">
                No results found for "{query}"
              </div>
            )}

            {query.length < 2 && (
              <div className="mt-4 text-center text-gray-500 py-4">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;