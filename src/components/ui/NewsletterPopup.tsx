import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { toast, Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    // Clean up old localStorage keys on component mount
    const hasOldSubmitted = localStorage.getItem('newsletter_submitted');
    const hasOldClosed = localStorage.getItem('newsletter_closed');
    
    if (hasOldSubmitted || hasOldClosed) {
      // Migrate users with old keys - hide for one month
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      localStorage.setItem('newsletter_hidden_until', oneMonthFromNow.toISOString());
      localStorage.removeItem('newsletter_submitted');
      localStorage.removeItem('newsletter_closed');
    }
    
    const newsletterHiddenUntil = localStorage.getItem('newsletter_hidden_until');
    
    if (isDevelopment) {
      // In development, always show popup for testing (ignore localStorage)
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    } else {
      // Check if popup should remain hidden
      if (newsletterHiddenUntil) {
        const hiddenUntilDate = new Date(newsletterHiddenUntil);
        if (Date.now() < hiddenUntilDate.getTime()) {
          // Still within the hide period, don't show popup
          return;
        } else {
          // Hide period has expired, remove the flag
          localStorage.removeItem('newsletter_hidden_until');
        }
      }
      
      // Show popup after 5 seconds if not in hide period
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDevelopment]);

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBackgroundImageLoaded(true);
    img.src = "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg";
  }, []);

  const createAdvancedFireworks = () => {
    // Immediate spectacular opening burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500', '#FF69B4', '#4169E1'],
      startVelocity: 45,
      zIndex: 10003
    });

    // Advanced fireworks sequence with multiple effects
    const duration = 6000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10003 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Create a more spectacular fireworks show
    const fireworksInterval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(fireworksInterval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create multiple bursts from different positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FF69B4', '#4169E1', '#00CED1', '#32CD32']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FF69B4', '#4169E1', '#00CED1', '#32CD32']
      });
    }, 250);

    // Add some special star bursts
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500'],
        shapes: ['star'],
        scalar: 1.2,
        zIndex: 10003
      });
    }, 1000);

    // Add heart shapes for extra celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#FF69B4', '#FFB6C1', '#FF1493'],
        shapes: ['square'],
        scalar: 1.5,
        zIndex: 10003
      });
    }, 2000);

    // Final grand finale
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#FF4500'],
        zIndex: 10003
      });
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FF69B4', '#4169E1', '#00CED1'],
        zIndex: 10003
      });
    }, 4000);
  };

  const handleClose = () => {
    setIsVisible(false);
    if (!isDevelopment) {
      // Hide popup for one month (30 days) - only in production
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      localStorage.setItem('newsletter_hidden_until', oneMonthFromNow.toISOString());
      
      // Clean up old keys if they exist
      localStorage.removeItem('newsletter_submitted');
      localStorage.removeItem('newsletter_closed');
    }
    // In development mode, don't set localStorage so popup shows every time
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      setShowConfetti(true);
      createAdvancedFireworks();
      toast.success('🎉 Successfully subscribed to newsletter!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      });
      if (!isDevelopment) {
        // Hide popup for one month after successful subscription - only in production
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        localStorage.setItem('newsletter_hidden_until', oneMonthFromNow.toISOString());
        
        // Clean up old keys if they exist
        localStorage.removeItem('newsletter_submitted');
        localStorage.removeItem('newsletter_closed');
      }
      // In development mode, don't set localStorage so popup shows every time
      
      setTimeout(() => {
        setShowConfetti(false);
        setIsVisible(false);
      }, 6000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0" style={{ zIndex: 9999 }}>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50" 
          onClick={handleClose}
          style={{ zIndex: 10000 }}
        />
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10001 }}>
          <Toaster position="top-right" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[2] p-2 text-gray-100 hover:text-white bg-gray-800/50 hover:bg-gray-800/70 rounded-full transition-colors shadow-lg"
              aria-label="Close newsletter popup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 to-blue-950/95">
              {/* Background image with loading state */}
              {!backgroundImageLoaded && (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse"></div>
              )}
              <img
                src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg"
                alt="Advanced artificial intelligence technology and data analytics representing cutting-edge AI automation solutions for modern businesses"
                className={`w-full h-full object-cover mix-blend-overlay transition-opacity duration-300 ${
                  backgroundImageLoaded ? 'opacity-40' : 'opacity-0'
                }`}
                width="400"
                height="600"
                onLoad={() => setBackgroundImageLoaded(true)}
              />
            </div>

            <div className="relative p-8">
              <div className="flex justify-center mb-4">
                <img
                  src="https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo-White.png"
                  alt="Phaeton AI - Subscribe for exclusive insights on artificial intelligence, business automation, and digital transformation strategies"
                  className="h-12 w-auto"
                  width="200"
                  height="48"
                />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Join the AI Revolution
                </h3>
                <p className="text-blue-50">
                  Get exclusive AI insights, updates, and special offers delivered straight to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  fullWidth
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-white font-bold text-lg py-3 shadow-lg transform hover:scale-[1.02] transition-all duration-200 hover:shadow-xl"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
              </form>

              <p className="text-xs text-blue-100 mt-4 text-center">
                By subscribing, you agree to receive our newsletter. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10004 }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-2xl animate-fade-in border-2 border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold mb-2">
                Thank you for subscribing!
              </h3>
              <p className="text-blue-100">
                Welcome to the Phaeton AI community!
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsletterPopup;