import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Phone, Mail, Search } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Services & Solutions
  {
    id: 1,
    question: "What AI solutions does Phaeton AI offer?",
    answer: "We specialize in AI Chatbots & Voice Assistants, AI Workflow Automation, AI Inbound Assistants, AI Outbound Callers, Advanced GPT Integration, AI Video Production & Editing, AI Marketing solutions, Custom AI Schedulers, and comprehensive business automation. Our solutions are designed to transform customer interactions and streamline business operations across all industries.",
    category: "Services"
  },
  {
    id: 2,
    question: "How do AI Inbound and Outbound Callers work?",
    answer: "Our AI Inbound Assistants handle customer inquiries, route calls intelligently, and maintain your brand voice with human-like understanding. AI Outbound Callers revolutionize customer outreach with automated call campaigns that provide real-time analytics and insights, lead qualification, and appointment scheduling.",
    category: "Services"
  },
  {
    id: 3,
    question: "What is included in AI Workflow Automation?",
    answer: "Our AI Workflow Automation streamlines repetitive processes and integrates with your existing systems to enhance efficiency in data handling, customer support, marketing, inventory management, order processing, and HR operations. This includes automated data processing, intelligent routing, and seamless system integration.",
    category: "Services"
  },
  {
    id: 4,
    question: "Do you offer custom AI solutions beyond your standard packages?",
    answer: "Yes! We provide fully customized AI solutions tailored to your specific business needs. This includes custom chatbots, specialized voice assistants, industry-specific automation, advanced analytics dashboards, and integration with proprietary systems. Contact us to discuss your unique requirements.",
    category: "Services"
  },
  {
    id: 5,
    question: "What industries do you serve?",
    answer: "We serve all industries including healthcare, finance, retail, real estate, legal services, education, manufacturing, hospitality, and more. Our AI solutions are customized to meet industry-specific compliance requirements and business processes.",
    category: "Services"
  },
  {
    id: 6,
    question: "Can you help with AI strategy and consulting?",
    answer: "Absolutely! Beyond implementation, we offer AI strategy consulting, digital transformation planning, process optimization analysis, and ongoing AI advisory services to help you maximize the value of artificial intelligence in your business.",
    category: "Services"
  },
  {
    id: 43,
    question: "What AI video production and editing services do you offer?",
    answer: "Our AI video production services include automated content creation, intelligent video editing, personalized video generation, automated subtitles and translations, smart scene detection and editing, AI-powered video optimization for different platforms, and scalable video production workflows for marketing, training, and customer engagement content.",
    category: "Services"
  },
  {
    id: 44,
    question: "How does AI video editing save time and costs?",
    answer: "AI video editing reduces production time by 70-80% through automated scene detection, smart cuts, automatic color correction, intelligent audio optimization, and automated subtitle generation. This significantly reduces manual editing hours and allows for faster content turnaround while maintaining professional quality standards.",
    category: "Services"
  },
  {
    id: 45,
    question: "Can AI create personalized videos at scale?",
    answer: "Yes, our AI video solutions can generate thousands of personalized videos automatically by incorporating customer names, specific product recommendations, localized content, and tailored messaging. This is perfect for marketing campaigns, customer onboarding, training materials, and personalized communications.",
    category: "Services"
  },
  {
    id: 46,
    question: "What video formats and platforms does your AI support?",
    answer: "Our AI video solutions support all major formats including MP4, MOV, AVI, and can optimize content specifically for YouTube, Instagram, TikTok, LinkedIn, Facebook, and other social media platforms. We also support various aspect ratios, resolutions, and compression settings for different use cases.",
    category: "Technical"
  },

  // Pricing & Plans
  {
    id: 7,
    question: "How much do your AI solutions cost?",
    answer: "Our pricing varies based on your specific needs, usage requirements, and customization level. We offer flexible pricing models including subscription plans, usage-based pricing, and custom enterprise solutions. Contact us for a personalized quote tailored to your business requirements.",
    category: "Pricing"
  },
  {
    id: 8,
    question: "Do you offer different pricing tiers?",
    answer: "Yes, we offer multiple tiers including Basic, Standard, and Premium plans, each designed for different business sizes and needs. We also provide custom enterprise pricing for large organizations. Contact us to discuss which tier best fits your requirements and get detailed pricing information.",
    category: "Pricing"
  },
  {
    id: 9,
    question: "Are there any setup fees or hidden costs?",
    answer: "We believe in transparent pricing. Any setup fees, implementation costs, or additional charges will be clearly outlined in your custom quote. There are no hidden fees - everything is discussed upfront during our consultation process.",
    category: "Pricing"
  },
  {
    id: 10,
    question: "Do you offer payment plans or financing options?",
    answer: "Yes, we offer flexible payment options including monthly subscriptions, annual plans with discounts, and custom payment schedules for enterprise clients. Contact us to discuss payment arrangements that work for your budget.",
    category: "Pricing"
  },
  {
    id: 11,
    question: "What is your refund policy?",
    answer: "You may cancel your subscription at any time. If you cancel within seven (7) days of your initial subscription purchase, you may request a full refund of your subscription fees. Setup fees may be non-refundable after services have commenced. Full terms are provided in your service agreement.",
    category: "Pricing"
  },

  // Technical & Implementation
  {
    id: 12,
    question: "How long does implementation take?",
    answer: "Our implementation process follows four steps: Initial Consultation, Custom Solution Design, AI Implementation, and Training & Optimization. The timeline varies based on complexity, but most implementations are completed within 2-4 weeks for standard solutions and 4-8 weeks for complex custom implementations.",
    category: "Technical"
  },
  {
    id: 13,
    question: "Do you integrate with existing systems?",
    answer: "Yes, our AI solutions integrate seamlessly with your existing CRM systems, communication channels, workflow tools, databases, and third-party applications. We ensure compatibility and provide ongoing support for smooth integration across your entire tech stack.",
    category: "Technical"
  },
  {
    id: 14,
    question: "What technology powers your AI solutions?",
    answer: "We use the latest GPT models and advanced AI technologies for enhanced natural language understanding, content generation, and sophisticated decision-making capabilities. Our solutions are built on cutting-edge AI technology with continuous learning capabilities and cloud-based infrastructure.",
    category: "Technical"
  },
  {
    id: 15,
    question: "Can you handle high-volume operations?",
    answer: "Absolutely! Our AI solutions are built to scale and can handle high-volume operations including thousands of simultaneous conversations, calls, and automated processes. We use enterprise-grade infrastructure to ensure reliability and performance.",
    category: "Technical"
  },
  {
    id: 16,
    question: "Do you provide training and ongoing support?",
    answer: "Yes, we provide comprehensive training for your team, detailed documentation, and ongoing technical support. Our solutions also include continuous optimization and updates to ensure peak performance as your business grows.",
    category: "Technical"
  },

  // Compliance & Security
  {
    id: 17,
    question: "Are your services PIPEDA compliant?",
    answer: "Yes, we maintain strict compliance with PIPEDA (Personal Information Protection and Electronic Documents Act) guidelines, ensuring the highest standards of security and privacy for all data and communications across all our AI solutions.",
    category: "Compliance"
  },
  {
    id: 18,
    question: "How do you handle healthcare data?",
    answer: "We maintain strict compliance with HIPAA (Health Insurance Portability and Accountability Act) and PIPEDA (Personal Information Protection and Electronic Documents Act) guidelines for healthcare-related data and communications. All healthcare AI solutions include specialized security protocols.",
    category: "Compliance"
  },
  {
    id: 19,
    question: "Where is data stored and how is it secured?",
    answer: "All data is stored exclusively on secure cloud infrastructure including Microsoft Azure and AWS (Amazon Web Services) servers, both of which comply with industry-leading security standards. We implement comprehensive security measures including end-to-end encryption, multi-factor authentication, access controls, regular security audits, automated threat detection, and compliance monitoring to protect your sensitive information. Our infrastructure includes redundant backups, disaster recovery protocols, and 24/7 security monitoring.",
    category: "Compliance"
  },
  {
    id: 20,
    question: "What specific security measures do you implement?",
    answer: "Our security framework includes: end-to-end encryption for data in transit and at rest, multi-factor authentication, role-based access controls, regular penetration testing, automated security monitoring, SOC 2 compliance, ISO 27001 standards, encrypted database storage, secure API endpoints, regular security audits, and incident response protocols. All data centers feature physical security, environmental controls, and 24/7 monitoring.",
    category: "Compliance"
  },
  {
    id: 21,
    question: "Do you comply with international data protection regulations?",
    answer: "Yes, our solutions are designed to comply with major international data protection regulations including GDPR, CCPA, PIPEDA, and other regional privacy laws. We can configure our systems to meet specific regulatory requirements for your industry and location, including data residency requirements and cross-border data transfer protocols.",
    category: "Compliance"
  },

  // Support & Contact
  {
    id: 22,
    question: "How can I get support?",
    answer: "We offer multiple support channels: Phone support at 1 (888) 895-7770, email at support@phaetonai.com, and live chat with our AI assistant Astra. We provide priority support with guaranteed response times based on your service level.",
    category: "Support"
  },
  {
    id: 23,
    question: "Do you offer 24/7 support?",
    answer: "Yes, our AI solutions provide 24/7 automated support through our intelligent systems. For human support, we respond to all inquiries within 24 hours and offer priority support with faster response times for higher-tier plans.",
    category: "Support"
  },
  {
    id: 24,
    question: "How do I schedule a demo?",
    answer: "You can schedule a demo by contacting us through our contact form, calling 1 (888) 895-7770, or using the 'Schedule a Demo' button on our website. We'll arrange a personalized demonstration of our AI solutions tailored to your specific business needs.",
    category: "Support"
  },
  {
    id: 25,
    question: "Do you provide ongoing maintenance and updates?",
    answer: "Yes, all our AI solutions include ongoing maintenance, regular updates, performance monitoring, and continuous optimization. We ensure your AI systems stay current with the latest technology and continue to meet your evolving business needs.",
    category: "Support"
  },
  {
    id: 26,
    question: "Can you provide references or case studies?",
    answer: "Yes, we can provide references and case studies relevant to your industry and use case. Contact us to learn about successful implementations and how other businesses have benefited from our AI solutions.",
    category: "Support"
  },

  // Additional Business & ROI Questions
  {
    id: 27,
    question: "What ROI can I expect from implementing AI solutions?",
    answer: "Our clients typically see significant ROI within 3-6 months through cost savings, increased efficiency, and improved customer satisfaction. Benefits include 40-60% reduction in support costs, 24/7 availability, faster response times, increased lead conversion rates, and reduced staffing overhead. We provide detailed ROI projections during our consultation.",
    category: "Services"
  },
  {
    id: 28,
    question: "How do AI chatbots handle complex customer inquiries?",
    answer: "Our AI chatbots use advanced natural language processing to understand context and intent. For complex issues, they seamlessly escalate to human agents while providing the agent with complete conversation history. The AI continues to learn from interactions to handle increasingly complex scenarios over time.",
    category: "Technical"
  },
  {
    id: 29,
    question: "Can AI solutions work in multiple languages?",
    answer: "Yes, our AI solutions support multiple languages including English, French, Spanish, Portuguese, German, Italian, Dutch, and many others. We can configure language detection, translation capabilities, and region-specific customizations to serve your global customer base effectively.",
    category: "Technical"
  },
  {
    id: 30,
    question: "What happens if the AI system goes down?",
    answer: "We maintain 99.9% uptime with redundant systems and automatic failover capabilities. In the rare event of downtime, our systems automatically route to backup servers. We provide real-time monitoring, immediate alerts, and have disaster recovery protocols to minimize any service interruption.",
    category: "Technical"
  },
  {
    id: 31,
    question: "How does AI automation affect existing employees?",
    answer: "AI automation is designed to augment human capabilities, not replace employees. It handles routine tasks, allowing your team to focus on higher-value activities like strategy, complex problem-solving, and customer relationship building. We provide change management guidance to ensure smooth transitions.",
    category: "Services"
  },
  {
    id: 32,
    question: "Can you integrate with popular CRM systems like Salesforce, HubSpot, or Microsoft Dynamics?",
    answer: "Absolutely! We provide seamless integration with all major CRM systems including Salesforce, HubSpot, Microsoft Dynamics, Pipedrive, Zoho, and many others. Our integrations sync customer data, conversation history, leads, and analytics for a unified business view.",
    category: "Technical"
  },
  {
    id: 34,
    question: "How do you ensure AI responses stay on-brand and accurate?",
    answer: "We implement brand voice training, custom knowledge bases, response guidelines, and ongoing monitoring. Our AI learns your company's tone, terminology, and policies. We also provide content review tools and can implement human-in-the-loop approval for sensitive responses.",
    category: "Technical"
  },
  {
    id: 35,
    question: "What are the minimum technical requirements for implementation?",
    answer: "Our cloud-based solutions require minimal technical infrastructure. You need: stable internet connection, modern web browsers, and basic system admin access for integrations. Most implementations work with existing hardware and don't require additional server infrastructure.",
    category: "Technical"
  },
  {
    id: 36,
    question: "How quickly can I see results after implementation?",
    answer: "Most clients see immediate improvements in response times and availability. Full benefits typically emerge within 2-4 weeks as the AI learns from interactions. Key metrics like reduced response times, increased customer satisfaction, and cost savings are measurable from day one.",
    category: "Services"
  },
  {
    id: 38,
    question: "What kind of analytics and reporting do you provide?",
    answer: "We provide detailed analytics including conversation volume, response accuracy, customer satisfaction scores, resolution rates, peak usage times, common topics, escalation patterns, and ROI metrics. Custom reports and real-time dashboards are available.",
    category: "Services"
  },
  {
    id: 39,
    question: "Can the AI handle appointment scheduling and calendar integration?",
    answer: "Yes, our AI can manage appointment scheduling with integration to Google Calendar, Outlook, Calendly, and other scheduling systems. It can check availability, book appointments, send confirmations, handle rescheduling, and manage waiting lists automatically.",
    category: "Services"
  },
  {
    id: 41,
    question: "How do you handle sensitive or confidential information?",
    answer: "We implement strict data handling protocols including encryption at rest and in transit, access controls, audit logs, and compliance with privacy regulations. Sensitive data can be masked, tokenized, or processed in isolated environments with additional security measures.",
    category: "Compliance"
  },
  {
    id: 42,
    question: "What training is provided for our team?",
    answer: "We provide comprehensive training including system administration, best practices, troubleshooting, and ongoing optimization. Training includes live sessions, documentation, video tutorials, and ongoing support to ensure your team maximizes the AI solution's potential.",
    category: "Support"
  },

  // Security & Encryption
  {
    id: 47,
    question: "How is data encrypted in your system?",
    answer: "We implement military-grade encryption with AES-256 standard for data at rest and TLS 1.2+ for data in transit. All database connections use SSL/TLS encryption, API communications are HTTPS-only, and sensitive data fields can be encrypted with column-level encryption. Encryption keys are managed securely by our infrastructure providers.",
    category: "Compliance"
  },
  {
    id: 48,
    question: "What is your data encryption standard?",
    answer: "We use industry-standard AES-256 encryption for sensitive data storage, TLS 1.3 for secure communications, and end-to-end encryption for data transmission. All encryption meets or exceeds NIST cryptographic standards and international security requirements.",
    category: "Compliance"
  },
  {
    id: 49,
    question: "Are communications between my systems and your platform encrypted?",
    answer: "Yes, all communications are encrypted end-to-end using TLS 1.2+ protocols. This includes API calls, webhook deliveries, data uploads, and real-time streaming. All external and internal communications are transmitted exclusively over HTTPS secure connections.",
    category: "Compliance"
  },
  {
    id: 50,
    question: "What happens if there's a data breach?",
    answer: "We maintain strict incident response protocols. In the unlikely event of a breach, we immediately notify affected customers, conduct forensic investigation, document all details, and take corrective action. We maintain cyber liability insurance and follow regulated breach notification requirements.",
    category: "Compliance"
  },
  {
    id: 51,
    question: "How often do you conduct security audits?",
    answer: "We conduct security audits on a quarterly basis, with annual third-party penetration testing and security assessments. Our infrastructure undergoes continuous automated security scanning, vulnerability assessments, and compliance monitoring. Security is audited before every major release.",
    category: "Compliance"
  },
  {
    id: 52,
    question: "Are you SOC 2 compliant?",
    answer: "Yes, our infrastructure and operations are designed to meet SOC 2 Type II standards. We maintain detailed security controls, audit trails, and monitoring to ensure compliance with Trust Service Criteria for security, availability, processing integrity, confidentiality, and privacy.",
    category: "Compliance"
  },
  {
    id: 53,
    question: "Do you meet ISO 27001 security standards?",
    answer: "Our security practices align with ISO 27001 standards for information security management. We implement comprehensive information security controls, risk management procedures, access controls, and asset management according to ISO 27001 requirements.",
    category: "Compliance"
  },
  {
    id: 54,
    question: "How do you protect against DDoS attacks?",
    answer: "Our infrastructure includes built-in DDoS protection through multiple layers: network-level filtering, rate limiting, automated traffic analysis, and failover systems. We partner with leading cloud providers who maintain enterprise-grade DDoS mitigation services with automatic threat detection and response.",
    category: "Compliance"
  },
  {
    id: 55,
    question: "What authentication methods do you support?",
    answer: "We support multiple authentication methods including username/password, multi-factor authentication (MFA), single sign-on (SSO), OAuth 2.0, SAML, API keys, and JWT tokens. Organizations can enforce strong password policies, session timeouts, and role-based access controls.",
    category: "Compliance"
  },
  {
    id: 56,
    question: "Is multi-factor authentication (MFA) available?",
    answer: "Yes, multi-factor authentication is available and highly recommended for all accounts. We support authenticator apps, SMS codes, and hardware security keys. MFA significantly reduces the risk of unauthorized access even if passwords are compromised.",
    category: "Compliance"
  },
  {
    id: 57,
    question: "How do you handle API security and authentication?",
    answer: "Our APIs use industry-standard authentication including OAuth 2.0, API keys with scoping, and JWT tokens. All API communications require HTTPS, support rate limiting, request signing, and comprehensive logging. API keys can be rotated regularly and have granular permission controls.",
    category: "Technical"
  },
  {
    id: 58,
    question: "What data do you log and how long is it retained?",
    answer: "We maintain comprehensive audit logs for all administrative actions, API calls, data access, and security events. Logs are retained for 90 days with archival options for longer retention. Logs are encrypted, tamper-protected, and reviewed regularly for security threats.",
    category: "Compliance"
  },
  {
    id: 59,
    question: "How do you ensure least-privilege access?",
    answer: "We implement the principle of least privilege where users and services only have access to data and functions they absolutely need. Access is enforced through role-based access controls (RBAC), attribute-based access controls (ABAC), and regular access reviews. All privileged actions require approval.",
    category: "Compliance"
  },
  {
    id: 60,
    question: "What payment security measures are in place?",
    answer: "We use PCI DSS compliant payment processors and never store full credit card details. Payment information is tokenized and encrypted, handled by certified payment service providers, and all transactions are secured with SSL/TLS encryption.",
    category: "Compliance"
  },
  {
    id: 61,
    question: "How do you protect against common web vulnerabilities?",
    answer: "We protect against OWASP Top 10 vulnerabilities including SQL injection, XSS, CSRF, and more through: parameterized queries, input validation, output encoding, security headers (CSP, X-Frame-Options, X-Content-Type-Options), CORS protection, and regular security testing.",
    category: "Technical"
  },
  {
    id: 62,
    question: "Is source code security scanning performed?",
    answer: "Yes, we perform continuous source code scanning using industry-leading tools to detect vulnerabilities, code quality issues, and security weaknesses. All code commits undergo automated security analysis before deployment, and regular penetration testing validates overall security.",
    category: "Technical"
  },
  {
    id: 63,
    question: "How are third-party dependencies managed for security?",
    answer: "All third-party dependencies are regularly scanned for known vulnerabilities, updated promptly when security patches are released, and validated before integration. We maintain a software bill of materials (SBOM) and monitor CVE databases for any vulnerabilities in our dependencies.",
    category: "Technical"
  },
  {
    id: 64,
    question: "What is your security disclosure process?",
    answer: "We take security vulnerabilities seriously and have a responsible disclosure process. Security researchers can report vulnerabilities to security@phaetonai.ca. We commit to responding within 48 hours, investigating thoroughly, and providing fixes. Reporters are credited and may receive recognition.",
    category: "Compliance"
  },
  {
    id: 65,
    question: "Do you have cyber liability insurance?",
    answer: "Yes, we maintain comprehensive cyber liability insurance covering data breach response, network security liability, privacy liability, and regulatory defense. This provides additional protection for our clients in the unlikely event of a security incident.",
    category: "Compliance"
  }
];

const categories = ["All", "Services", "Pricing", "Technical", "Compliance", "Support"];

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-16">
      <SEOHead 
        title="Frequently Asked Questions | Phaeton AI - AI Solutions Support"
        description="Get answers to common questions about Phaeton AI's enterprise AI solutions, pricing, implementation, security compliance, and technical support. Expert insights for all your AI needs."
        keywords={[
          "AI FAQ",
          "artificial intelligence questions",
          "AI implementation help",
          "chatbot support questions",
          "voice assistant FAQ",
          "AI pricing questions",
          "PIPEDA compliance questions",
          "AI security FAQ",
          "enterprise AI support",
          "AI consulting questions"
        ]}
        canonical="https://phaetonai.com/faq"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": "Phaeton AI Frequently Asked Questions",
            "description": "Comprehensive FAQ covering AI solutions, pricing, implementation, and support for enterprise artificial intelligence services.",
            "url": "https://phaetonai.com/faq",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What AI solutions does Phaeton AI offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We specialize in AI Chatbots & Voice Assistants, AI Workflow Automation, AI Inbound Assistants, AI Outbound Callers, Advanced GPT Integration, AI Video Production & Editing, AI Marketing solutions, Custom AI Schedulers, and comprehensive business automation."
                }
              },
              {
                "@type": "Question",
                "name": "Are your services PIPEDA compliant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we maintain strict compliance with PIPEDA guidelines, ensuring the highest standards of security and privacy for all data and communications across all our AI solutions."
                }
              },
              {
                "@type": "Question",
                "name": "How long does implementation take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most implementations are completed within 2-4 weeks for standard solutions and 4-8 weeks for complex custom implementations, following our four-step process."
                }
              }
            ]
          }
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="section-subtitle">
              Find answers to common questions about Phaeton AI's services, pricing, and implementation
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.question}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="ml-4">
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-16 bg-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
              <p className="text-gray-600">
                Our team is here to help. Contact us through any of these channels for personalized assistance and pricing information:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-2">Talk to our AI Assistant Astra</p>
                <a 
                  href="tel:1-888-895-7770" 
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  1 (888) 895-7770
                </a>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-2">Get detailed assistance</p>
                <a 
                  href="mailto:support@phaetonai.com" 
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  support@phaetonai.com
                </a>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-2">Chat with Astra instantly</p>
                <p className="text-blue-600 font-semibold">
                  Click the chat icon below
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-4">
                  Contact us today for a personalized consultation and custom pricing quote tailored to your business needs.
                </p>
                <a 
                  href="/contact" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Custom Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;