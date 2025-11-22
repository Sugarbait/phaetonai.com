import React, { useEffect } from 'react';
import SEOHead from '../components/seo/SEOHead';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16">
      <SEOHead 
        title="Privacy Policy | Phaeton AI - Data Protection & PIPEDA Compliance"
        description="Learn how Phaeton AI protects your privacy and personal data. Our comprehensive privacy policy covers PIPEDA compliance, data security, retention policies, and user rights for all AI services."
        keywords={[
          "AI privacy policy",
          "PIPEDA compliance",
          "data protection AI",
          "artificial intelligence privacy",
          "chatbot data privacy",
          "voice assistant privacy",
          "AI data security",
          "personal information protection",
          "enterprise AI privacy",
          "HIPAA compliant AI"
        ]}
        canonical="https://phaetonai.com/privacy"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Phaeton AI Privacy Policy",
            "description": "Comprehensive privacy policy detailing how Phaeton AI protects user data and maintains PIPEDA compliance across all AI services.",
            "url": "https://phaetonai.com/privacy",
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
          <h1 className="section-title mb-12">Phaeton AI Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">Last Updated: June 6, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. INTRODUCTION</h2>
              <p className="text-gray-700 mb-4">
                Phaeton AI Consulting ("Phaeton AI," "we," "us," or "our") is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, store, and protect the information we collect when you use our AI consulting services, including our chatbots, voice assistants, and AI-powered caller solutions ("Services").
              </p>
              <p className="text-gray-700 mb-4">
                Please read this Privacy Policy carefully to understand our practices regarding your personal information and how we will treat it. By using our Services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. CONSENT & DATA COLLECTION</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 User Consent</h3>
              <p className="text-gray-700 mb-4">
                Users have the right to consent or deny the collection of their personal information before interacting with our AI assistant. We will clearly inform you about what data we collect and why we need it.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.2 Information We Collect</h3>
              <p className="text-gray-700 mb-4">We collect the following types of personal information:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Contact information (such as name, address, email address, telephone number)</li>
                <li>Health information (for clients in the healthcare sector)</li>
                <li>Date of birth</li>
                <li>Business information (such as company name, job title)</li>
                <li>Payment information (such as billing address and payment method details)</li>
                <li>Usage data related to interactions with our AI solutions</li>
                <li>Performance data related to our Services</li>
                <li>Technical data related to your use of our systems</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.3 Data Collection Methods</h3>
              <p className="text-gray-700 mb-4">
                Data will be collected through secure and encrypted methods, ensuring maximum protection. We collect information directly from you when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Register for our Services</li>
                <li>Use our AI solutions</li>
                <li>Communicate with us</li>
                <li>Provide information for customization of our Services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. HOW WE USE YOUR INFORMATION</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Service Provision and Improvement</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>To provide and maintain our Services</li>
                <li>To improve and personalize your experience</li>
                <li>To develop new features and functionality</li>
                <li>To process transactions and fulfill orders</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Communication</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>To respond to your inquiries and provide customer support</li>
                <li>To send administrative information, such as updates to our terms or privacy policy</li>
                <li>To provide information about your account and Services</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.3 Legal and Security Purposes</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>To comply with applicable laws and regulations</li>
                <li>To enforce our Terms of Service</li>
                <li>To detect, prevent, and address technical issues, fraud, or illegal activity</li>
                <li>To protect the rights, property, and safety of our users and the public</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. DATA STORAGE & SECURITY</h2>
              
              <h3 className="text-xl font-semibold mb-3">4.1 Data Storage</h3>
              <p className="text-gray-700 mb-4">
                All personal information will be stored exclusively on Microsoft Azure servers, which comply with industry-leading security standards. Our AI assistant follows strict data security protocols to protect user information.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Security Measures</h3>
              <p className="text-gray-700 mb-4">
                We implement comprehensive security measures including encryption, access controls, and regular security audits to protect your personal data from unauthorized access, disclosure, alteration, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. DATA RETENTION & REMOVAL</h2>
              
              <h3 className="text-xl font-semibold mb-3">5.1 Retention Period</h3>
              <p className="text-gray-700 mb-4">
                Personal data collected by our AI assistant will be stored securely for 30 days from the date of collection or last interaction, whichever is later.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.2 Data Removal</h3>
              <p className="text-gray-700 mb-4">
                After 30 days, all stored personal data will be permanently removed from our system using secure deletion methods that ensure the data cannot be recovered.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. USER RIGHTS & ACCESS</h2>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Right to Access</h3>
              <p className="text-gray-700 mb-4">
                Users can request access to their personal data at any time during the retention period. We will provide you with information about what data we have collected and how it has been used.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Right to Correction</h3>
              <p className="text-gray-700 mb-4">
                If any personal information is inaccurate or incomplete, users may submit a request for correction, and updates will be made promptly upon verification.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.3 How to Exercise Your Rights</h3>
              <p className="text-gray-700 mb-4">
                Requests for data access, corrections, or deletion can be made by contacting us at:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Email: <a href="mailto:privacy@phaetonai.com" className="text-blue-600 hover:text-blue-800">privacy@phaetonai.com</a></li>
                <li>Phone: <a href="tel:+18888957770" className="text-blue-600 hover:text-blue-800">1 (888) 895-7770</a></li>
                <li>Mail: 6D - 7398 Yonge St Unit #2047, Thornhill, ON L4J 8J2, Canada</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. INFORMATION SHARING AND DISCLOSURE</h2>
              
              <h3 className="text-xl font-semibold mb-3">7.1 No Sale or Sharing of Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We do not sell, rent, or otherwise share your personal information with third parties for their direct marketing purposes. No personal data will be shared or sold to third parties.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.2 Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may engage trusted third-party companies and individuals to facilitate our Services, provide services on our behalf, or assist us in analyzing how our Services are used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.3 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your personal information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. COMPLIANCE</h2>
              
              <h3 className="text-xl font-semibold mb-3">8.1 Healthcare Compliance</h3>
              <p className="text-gray-700 mb-4">
                We maintain strict compliance with HIPAA (Health Insurance Portability and Accountability Act) and PHIPA (Personal Health Information Protection Act) guidelines, ensuring the highest standards of security and privacy for healthcare-related data and communications.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.2 PIPEDA Compliance</h3>
              <p className="text-gray-700 mb-4">
                This policy complies with PIPEDA (Personal Information Protection and Electronic Documents Act) guidelines, ensuring that we meet Canadian privacy law requirements for the collection, use, and disclosure of personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. CONTACT INFORMATION</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Email: <a href="mailto:privacy@phaetonai.com" className="text-blue-600 hover:text-blue-800">privacy@phaetonai.com</a></li>
                <li>General Contact: <a href="mailto:contactus@phaetonai.com" className="text-blue-600 hover:text-blue-800">contactus@phaetonai.com</a></li>
                <li>Phone: <a href="tel:+18888957770" className="text-blue-600 hover:text-blue-800">1 (888) 895-7770</a></li>
                <li>Address: 6D - 7398 Yonge St Unit #2047, Thornhill, ON L4J 8J2, Canada</li>
              </ul>
            </section>
            
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-700 text-center">
                By using Phaeton AI Consulting services, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;