import React from 'react';
import VoiceAgent from '../voice/VoiceAgent';

const VoiceAgentShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="section-title">
            Experience Our AI Voice Agent
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed whitespace-nowrap">
            Ask Astra about our services, pricing, and how we can transform your business with AI solutions.
          </p>
        </div>

        {/* Voice Agent Component */}
        <div className="flex justify-center">
          <VoiceAgent />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Interaction</h3>
            <p className="text-gray-600">
              Experience low-latency voice conversations with natural language understanding powered by advanced AI.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Human-Like Responses</h3>
            <p className="text-gray-600">
              Get intelligent answers about Phaeton AI services from our voice assistant with natural conversation flow.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Ready</h3>
            <p className="text-gray-600">
              Built on enterprise-grade infrastructure with security and reliability you can trust for your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceAgentShowcase;
