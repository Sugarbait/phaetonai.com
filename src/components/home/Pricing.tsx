import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const tiers = [
  {
    name: 'Basic',
    description: 'Perfect for small businesses looking to get started with AI Assistants',
    features: [
      '500 calls',
      'First 10 Calls Free',
      'Includes 1 phone number',
      'Cost per Call (Contact Us)',
      'Customized AI Script Generation',
      'Dynamic Speech Synthesis Options',
      'Integration with CRM Systems',
      'Advanced Analytics and Reporting',
      'Priority Support',
      'Call Transcription and Summary',
      'Secure Data Storage on AWS Servers',
    ],
  },
  {
    name: 'Standard',
    description: 'Ideal for growing businesses requiring advanced AI capabilities',
    features: [
      '1,000 calls',
      'First 10 Calls Free',
      'Includes 5 phone numbers',
      'Cost per Call (Contact Us)',
      'Customized AI Script Generation',
      'Dynamic Speech Synthesis Options',
      'Integration with CRM Systems',
      'Advanced Analytics and Reporting',
      'Priority Support',
      'Call Transcription and Summary',
      'Secure Data Storage on AWS Servers',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    description: 'Premium AI solutions for enterprises seeking maximum scalability and customization',
    features: [
      '1,500+ calls',
      'First 10 Calls Free',
      'Includes 10 phone numbers',
      'Cost per Call (Contact Us)',
      'Customized AI Script Generation',
      'Dynamic Speech Synthesis Options',
      'Integration with CRM Systems',
      'Advanced Analytics and Reporting',
      'Priority Support',
      'Call Transcription and Summary',
      'Secure Data Storage on AWS Servers',
    ],
  },
];

const addons = [
  {
    name: 'AI Marketing',
    description: 'AI-powered marketing strategy for business growth',
    features: [
      'Custom Marketing Plan',
      'Target Audience Analysis',
      'Competitor Research',
      'Channel Recommendations',
      'Content Strategy',
      'ROI Projections',
      'Implementation Timeline',
    ],
  },
  {
    name: 'Custom AI Chatbot',
    description: 'Enhance your customer support with our intelligent chatbot solution',
    features: [
      'Unlimited Conversations',
      'Natural Language Processing',
      'Multi-language Support',
      'Custom Knowledge Base',
      'Real-time Analytics',
      'Seamless Integration',
      'Uses Latest GPT Models',
    ],
  },
  {
    name: 'Solo AI Scheduler',
    description: 'Perfect for individual professionals managing their appointments',
    features: [
      'Unlimited Appointments',
      'Calendar Integration',
      'Automated Reminders',
      'Custom Availability',
      'Client Self-booking',
      'Email Notifications',
      'Basic Analytics',
    ],
  },
  {
    name: 'Team AI Scheduler',
    description: 'Comprehensive scheduling solution for teams and organizations',
    features: [
      'Everything in Solo Scheduler',
      'Multiple Team Members',
      'Team Calendar View',
      'Resource Management',
      'Advanced Reporting',
      'Role-based Access',
      'Team Analytics',
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Digital technological background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Circuit board pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Horizontal lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                
                {/* Vertical lines */}
                <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                
                {/* Circuit nodes */}
                <circle cx="20" cy="20" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                <circle cx="50" cy="50" r="1.5" fill="rgba(59, 130, 246, 0.8)"/>
                <circle cx="80" cy="80" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                <circle cx="80" cy="20" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                <circle cx="20" cy="80" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                
                {/* Small rectangles (chips) */}
                <rect x="18" y="48" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                <rect x="78" y="18" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>

        {/* Digital grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}>
        </div>

        {/* Glowing orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Binary code pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-blue-300 text-xs font-mono transform rotate-12">
            01001000 01100101 01101100 01101100 01101111
          </div>
          <div className="absolute top-32 right-20 text-blue-300 text-xs font-mono transform -rotate-6">
            01000001 01001001 00100000 01010000 01101111
          </div>
          <div className="absolute bottom-20 left-1/3 text-blue-300 text-xs font-mono transform rotate-3">
            01110111 01100101 01110010 01100101 01100100
          </div>
        </div>

        {/* Hexagonal tech pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,2 45,15 45,37 30,50 15,37 15,15" 
                         fill="none" 
                         stroke="rgba(59, 130, 246, 0.3)" 
                         strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon)"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 pb-1 text-center text-white">
            Our Solutions
          </h2>
          <h3 className="text-2xl font-semibold text-blue-300 mb-4">AI Inbound and Outbound Callers</h3>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto text-center">
            Choose the perfect solution to transform your customer interactions with our AI-powered technology, fully PIPEDA compliant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20 ${
                tier.popular ? 'ring-2 ring-blue-400 scale-105 z-10' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-blue-100 mb-6">{tier.description}</p>
                <p className="text-sm text-blue-200 mb-6 font-medium">
                  *Contact us for pricing details
                </p>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                      <span className="text-blue-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Contact Us for Pricing
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">Add-ons</h3>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto text-center">
            Enhance your solution with powerful additional features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {addons.map((addon, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{addon.name}</h3>
                <p className="text-blue-100 mb-6">{addon.description}</p>
                <div className="space-y-4 mb-8">
                  {addon.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                      <span className="text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/contact')}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Contact Us for Pricing
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;