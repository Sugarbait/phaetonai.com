import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CTO, TechVision Inc.',
    content: 'Phaeton AI has transformed how we analyze customer data. The insights we\'ve gained have directly contributed to a 40% increase in customer retention.',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Data Science Lead, Global Finance',
    content: 'The predictive modeling capabilities of Phaeton AI are unmatched. We\'ve been able to forecast market trends with remarkable accuracy, giving us a significant competitive edge.',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jennifer Lee',
    role: 'CEO, Innovate Retail',
    content: 'Implementing Phaeton AI allowed us to optimize our supply chain and inventory management. The ROI was evident within the first quarter, and we haven\'t looked back since.',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    rating: 4,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({});

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Hear from organizations that have transformed their operations with Phaeton AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-md p-8 md:p-12">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
            </div>

            <div className="mt-4">
              <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                "{activeTestimonial.content}"
              </p>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="relative w-12 h-12 mr-4">
                    {/* Loading placeholder for avatar */}
                    {!imageLoaded[activeTestimonial.id] && (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse"></div>
                    )}
                    <img 
                      src={activeTestimonial.avatar} 
                      alt={activeTestimonial.name} 
                      className={`w-12 h-12 rounded-full object-cover transition-opacity duration-300 ${
                        imageLoaded[activeTestimonial.id] ? 'opacity-100' : 'opacity-0 absolute inset-0'
                      }`}
                      width="48"
                      height="48"
                      onLoad={() => handleImageLoad(activeTestimonial.id)}
                      onError={() => handleImageLoad(activeTestimonial.id)}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{activeTestimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{activeTestimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star 
                      key={index}
                      className={`h-5 w-5 ${
                        index < activeTestimonial.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials