import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const steps = [
  {
    id: 1,
    title: "Initial Consultation",
    description: "We begin by understanding your unique communication challenges and business goals. Our team analyzes your current workflows and identifies opportunities for AI integration.",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  },
  {
    id: 2,
    title: "Custom Solution Design",
    description: "Our experts design tailored AI solutions that align with your brand identity, whether it's chatbots, voice assistants, or automated callers, ensuring seamless integration with your existing systems.",
    image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
  },
  {
    id: 3,
    title: "AI Implementation",
    description: "We deploy your customized AI solutions, integrating them with your communication channels and workflow systems while ensuring security and data privacy compliance.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
  },
  {
    id: 4,
    title: "Training & Optimization",
    description: "Your AI solutions continuously learn and improve through real-world interactions, while our team provides ongoing support and optimization to enhance performance and user satisfaction.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({});
  const navigate = useNavigate();

  const handleImageLoad = (stepId: number) => {
    setImageLoaded(prev => ({ ...prev, [stepId]: true }));
  };

  const activeStepData = steps.find(step => step.id === activeStep);

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">How Phaeton AI Works</h2>
          <p className="section-subtitle">
            Our proven process for implementing intelligent AI solutions that transform your customer interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-1">
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-lg">
                {/* Loading placeholder */}
                {!imageLoaded[activeStep] && (
                  <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse rounded-lg flex items-center justify-center">
                    <div className="text-blue-400 text-lg font-medium">Loading...</div>
                  </div>
                )}
                <img
                  src={activeStepData?.image}
                  alt={`${activeStepData?.title} - Professional AI implementation process showing ${activeStepData?.title.toLowerCase()} for enterprise chatbot and voice assistant deployment`}
                  className={`w-full h-[300px] md:h-[400px] object-cover transition-opacity duration-300 ${
                    imageLoaded[activeStep] ? 'opacity-100' : 'opacity-0'
                  }`}
                  width="600"
                  height="400"
                  onLoad={() => handleImageLoad(activeStep)}
                  onError={() => handleImageLoad(activeStep)}
                />
              </div>
              <div className="absolute -inset-4 bg-blue-100 rounded-lg -z-10"></div>
            </div>
          </div>

          <div className="order-2">
            <div className="flex mb-8">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex-1 py-4 border-b-2 text-sm font-medium ${
                    activeStep === step.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Step {step.id}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">
                {activeStepData?.title}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {activeStepData?.description}
              </p>
              <div className="flex justify-center">
                <Button onClick={() => navigate('/contact')}>Schedule a Demo</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;