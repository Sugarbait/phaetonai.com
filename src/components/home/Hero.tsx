import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Snowflake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { useHolidayTheme } from '../../hooks/useHolidayTheme';

const heroImages = [
  {
    src: 'https://phaetonai.ca/clients/phaetonai/images/phaet1.png',
    alt: 'Phaeton AI team developing enterprise AI chatbot solutions and voice assistant technology for business automation'
  },
  {
    src: 'https://phaetonai.ca/clients/phaetonai/images/phaet2.png',
    alt: 'Advanced artificial intelligence systems and machine learning data visualization dashboards for enterprise analytics'
  },
  {
    src: 'https://phaetonai.ca/clients/phaetonai/images/phaet3.png',
    alt: 'Professional AI consultants implementing conversational AI and intelligent automation solutions for global businesses'
  },
  {
    src: 'https://phaetonai.ca/clients/phaetonai/images/phaetonimage.jpg',
    alt: 'Innovative AI technology and intelligent automation systems powering modern business transformation'
  },
  {
    src: 'https://phaetonai.ca/clients/phaetonai/images/phaetonimage3.jpg',
    alt: 'Cutting-edge AI development and deployment for scalable business automation and digital innovation'
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const { isHolidaySeason } = useHolidayTheme();
  // Select random image during initialization to prevent flash
  const [heroImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    return heroImages[randomIndex];
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <section className={`relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden transition-all duration-500 ${
      isHolidaySeason
        ? 'bg-gradient-to-b from-red-50 to-red-100'
        : 'bg-gradient-to-b from-slate-50 to-slate-100'
    }`}>
      <div className="absolute inset-0 top-24 h-[calc(100%-6rem)]">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fullScreen: {
              enable: false,
              zIndex: 1
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "grab",
                },
                resize: true,
              },
              modes: {
                grab: {
                  distance: 140,
                  links: {
                    opacity: 0.5
                  }
                },
              },
            },
            particles: {
              color: {
                value: isHolidaySeason ? "#dc2626" : "#3178ff",
              },
              links: {
                color: isHolidaySeason ? "#dc2626" : "#3178ff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
          className="h-full"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in text-center lg:text-left">
            {isHolidaySeason && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Snowflake className="h-5 w-5 text-red-600 animate-pulse" />
                <p className="text-lg font-semibold text-red-600">Happy Holidays!</p>
                <Snowflake className="h-5 w-5 text-red-600 animate-pulse" />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
              Transform Customer Interactions with{' '}
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                isHolidaySeason
                  ? 'from-red-600 via-red-500 to-red-400'
                  : 'from-blue-600 via-blue-500 to-blue-400'
              }`}>
                Enterprise AI Solutions
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed mx-auto lg:mx-0 max-w-2xl">
              Phaeton AI is Canada's leading artificial intelligence consulting company specializing in enterprise-grade AI chatbot development, intelligent voice assistants, machine learning implementation, and PIPEDA-compliant business automation solutions that drive digital transformation and operational excellence for modern businesses worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                fullWidth 
                className="sm:w-auto"
                onClick={() => navigate('/contact')}
              >
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl mx-auto lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
              <div className="relative">
                <img
                  src={heroImage.src}
                  alt={heroImage.alt}
                  className={`w-full h-auto object-cover rounded-lg shadow-xl relative z-10 transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  width="800"
                  height="600"
                  onLoad={() => setImageLoaded(true)}
                />
                {/* Colored background decoration centered behind image */}
                <div
                  className={`absolute inset-0 rounded-lg transition-colors duration-500 ${
                    isHolidaySeason ? 'bg-red-200' : 'bg-blue-200'
                  }`}
                  style={{
                    transform: 'rotate(3deg) translate(0px, 16px)',
                    zIndex: -1
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;