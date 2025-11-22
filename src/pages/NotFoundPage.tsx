import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4 pt-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <HelpCircle className="w-4 h-4 mr-2" />
            Error 404
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
            We're sorry, but the page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>

        {/* Image - Error on Screen */}
        <div className="mb-8">
          <div className="relative mx-auto w-full max-w-sm">
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="w-full h-64 bg-gradient-to-br from-red-100 to-red-200 animate-pulse rounded-lg flex items-center justify-center">
                <div className="text-red-400 text-lg font-medium">Loading...</div>
              </div>
            )}
            
            <img 
              src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg"
              alt="Computer screen showing system error message and malfunction"
              className={`w-full h-64 object-cover rounded-lg shadow-lg transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            
            {/* Decorative elements - Error themed */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-600 rounded-full opacity-30"></div>
          </div>
        </div>

        {/* Helpful suggestions */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">What can you do?</h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Check the URL for any typos
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Return to our homepage
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Use the search feature to find what you need
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Contact our support team for assistance
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-6 border-t border-gray-200 max-w-md mx-auto mb-12">
          <p className="text-gray-600 text-sm text-center">
            Still need help?{' '}
            <button 
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
            >
              Contact our support team
            </button>
            {' '}or{' '}
            <button 
              onClick={() => navigate('/support')}
              className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
            >
              visit our help center
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;