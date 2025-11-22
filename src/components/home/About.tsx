import React, { useState } from 'react';
import { Zap, Award, Globe, Shield } from 'lucide-react';

const stats = [
  {
    value: '24/7',
    label: 'AI Support',
    icon: Globe,
  },
  {
    value: '15+',
    label: 'AI Technologies',
    icon: Zap,
  },
  {
    value: '99%',
    label: 'Client Satisfaction',
    icon: Award,
  },
  {
    value: '100%',
    label: 'PIPEDA Compliant',
    icon: Shield,
  },
];

const About = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="section-title">Why Choose Phaeton AI</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed mx-auto lg:mx-0 max-w-2xl">
              At Phaeton AI Consulting, we combine cutting-edge natural language processing with personalized design to deliver chatbots, voice assistants, and automation solutions that align perfectly with your business goals.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed mx-auto lg:mx-0 max-w-2xl">
              Our team of experts focuses on creating AI solutions that reflect your unique brand identity, drive tangible results, and keep you ahead of the competition with state-of-the-art AI communication technologies.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Privacy Compliance</h3>
              <p className="text-gray-700">
                We maintain strict compliance with PIPEDA (Personal Information Protection and Electronic Documents Act) guidelines, ensuring the highest standards of security and privacy for all data and communications.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center mb-4">
                    <stat.icon className="h-8 w-8 text-gray-700" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto lg:mx-0 w-full">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-lg">
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse rounded-lg flex items-center justify-center">
                  <div className="text-blue-400 text-lg font-medium">Loading...</div>
                </div>
              )}
              <img
                src="https://phaetonai.ca/clients/phaetonai/images/phaetonimage2.jpg"
                alt="Professional AI development team at Phaeton AI creating custom chatbot and voice assistant solutions for enterprise automation and digital transformation"
                className={`w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-lg transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                width="600"
                height="450"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
            <div className="absolute -inset-4 bg-blue-50 rounded-lg -z-10 transform -rotate-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;