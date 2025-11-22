import React, { useEffect } from 'react';
import SEOHead from '../components/seo/SEOHead';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16">
      <SEOHead 
        title="Terms of Service | Phaeton AI - AI Solutions Legal Terms"
        description="Read Phaeton AI's comprehensive Terms of Service covering AI consulting services, subscription billing, data privacy, PIPEDA compliance, and service level agreements for enterprise AI solutions."
        keywords={[
          "AI terms of service",
          "artificial intelligence legal terms",
          "AI consulting terms",
          "PIPEDA compliance terms",
          "AI subscription terms",
          "chatbot service agreement",
          "voice assistant terms",
          "enterprise AI contract",
          "AI business automation terms",
          "artificial intelligence SLA"
        ]}
        canonical="https://phaetonai.com/terms"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Phaeton AI Terms of Service",
            "description": "Legal terms and conditions for using Phaeton AI's artificial intelligence consulting services and solutions.",
            "url": "https://phaetonai.com/terms",
            "dateModified": "2025-06-06",
            "publisher": {
              "@type": "Organization",
              "name": "Phaeton AI"
            }
          }
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-12">Phaeton AI Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">Last Updated: June 6, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. INTRODUCTION</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service ("Terms") govern your access to and use of the services, products, and technologies (collectively, the "Services") provided by Phaeton AI Consulting ("Phaeton AI," "we," "us," or "our"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. DESCRIPTION OF SERVICES</h2>
              <p className="text-gray-700 mb-4">Phaeton AI Consulting specializes in providing custom AI solutions, including but not limited to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>AI Workflow Automation</li>
                <li>AI-Powered Chatbots & Voice Assistants</li>
                <li>Smart Brand Identity</li>
                <li>AI Social Media Solutions</li>
                <li>Sales and Lead Generation Automation</li>
                <li>Inventory & Order Management Solutions</li>
                <li>Human Resources Automation</li>
                <li>AI Inbound Assistants</li>
                <li>AI Outbound Callers</li>
                <li>Data Analysis & Reporting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. SUBSCRIPTION AND BILLING</h2>
              <h3 className="text-xl font-semibold mb-3">3.1 Subscription Model</h3>
              <p className="text-gray-700 mb-4">
                Our Services are offered on a subscription basis with a one-time setup fee. Additional charges may apply based on per-minute usage of certain features.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.2 Payment Terms</h3>
              <p className="text-gray-700 mb-4">
                You agree to pay all fees associated with your subscription plan. Fees are non-refundable except as provided in Section 3.3 below.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.3 Cancellation and Refund Policy</h3>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time. If you cancel within seven (7) days of your initial subscription purchase, you may request a full refund of your subscription fees. After this seven-day period, no refunds will be issued for the current billing period. The one-time setup fee is non-refundable after services have commenced.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.4 Changes to Fees</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to change our subscription fees at any time. Any fee changes will be communicated to you in advance and will take effect at the start of the next billing cycle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. LIMITED LICENSE</h2>
              <p className="text-gray-700 mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use our Services for your internal business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. USER RESPONSIBILITIES</h2>
              <p className="text-gray-700 mb-4">
                Users agree to use Phaeton AI services responsibly and in compliance with applicable laws. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Engaging in illegal activities or violating any regulations</li>
                <li>Misusing AI-generated content in ways that could cause harm, spread misinformation, or infringe on intellectual property rights</li>
                <li>Attempting unauthorized access to Phaeton AI systems or interfering with normal operation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. INTELLECTUAL PROPERTY</h2>
              <h3 className="text-xl font-semibold mb-3">6.1 Our Intellectual Property</h3>
              <p className="text-gray-700 mb-4">
                All intellectual property rights in the Services, including but not limited to software, designs, graphics, logos, and content, are owned by Phaeton AI or its licensors.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain all rights to any content you provide to us for use with the Services. By providing content to us, you grant us a worldwide, royalty-free license to use, reproduce, modify, and distribute such content solely for the purpose of providing the Services to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. SERVICE LEVEL AGREEMENT (SLA)</h2>
              <p className="text-gray-700 mb-4">
                Phaeton AI is committed to providing reliable services with a 99.9% uptime guarantee. Additionally, support inquiries will be responded to within 24 hours. While every effort is made to maintain uninterrupted service, Phaeton AI shall not be liable for interruptions due to unforeseen technical issues or maintenance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. DATA PRIVACY & SECURITY</h2>
              <p className="text-gray-700 mb-4">
                Phaeton AI complies with PIPEDA (Personal Information Protection and Electronic Documents Act) to ensure the protection and responsible handling of user data. Security measures include encryption, secure access controls, and compliance with industry best practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. TERMINATION CLAUSE</h2>
              <p className="text-gray-700 mb-4">
                Phaeton AI reserves the right to suspend or terminate user accounts under the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Abuse or violation of service terms</li>
                <li>Attempting to hack, reverse-engineer, or exploit Phaeton AI systems</li>
                <li>Any unauthorized efforts to extract proprietary AI insights beyond intended use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. LIMITATIONS OF LIABILITY</h2>
              <p className="text-gray-700 mb-4">
                To the extent permitted by law, Phaeton AI shall not be liable for indirect, incidental, or consequential damages resulting from the use of its services. Users agree that Phaeton AI's liability is limited to the amount paid for the subscription in the preceding term.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. UPDATES TO TERMS</h2>
              <p className="text-gray-700 mb-4">
                Phaeton AI may update these Terms of Service periodically. Users will be notified of any changes via an official notification on the website. Continued use of the services after updates constitute acceptance of the revised terms.
              </p>
            </section>
            
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-700 text-center">
                By using Phaeton AI Consulting services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;