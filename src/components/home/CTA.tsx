import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to Transform Your Customer Interactions?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Contact us today to discover how our AI-powered solutions can help you achieve your business goals and deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => navigate('/contact')}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;