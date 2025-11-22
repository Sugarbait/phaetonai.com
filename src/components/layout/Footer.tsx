import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: 'about' } });
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <Link to="/">
                <img
                  src="https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo-White.png"
                  alt="Phaeton AI - Enterprise artificial intelligence solutions for business automation, chatbots, and voice assistants"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering businesses with intelligent AI solutions that drive growth and innovation.
            </p>
            <div className="flex space-x-4">
              <SocialIcon type="twitter" />
              <SocialIcon type="linkedin" />
              <SocialIcon type="youtube" />
              <SocialIcon type="instagram" />
              <SocialIcon type="tiktok" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-left">Company</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#about" onClick={handleAboutClick} className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-left">Support</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Get Help</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-left">Contact</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-400 mt-1" />
                <span>6D - 7398 Yonge St Unit #2047<br />Thornhill, ON L4J 8J2<br />Canada</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-blue-400 mt-1" />
                <span>1 (888) 895-7770</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-blue-400 mt-1" />
                <a href="mailto:contactus@phaetonai.com" className="hover:text-blue-400 transition-colors">
                  contactus@phaetonai.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Phaeton AI. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-6 flex-wrap gap-y-2">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link>
            <Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ type }: { type: 'twitter' | 'linkedin' | 'youtube' | 'instagram' | 'tiktok' }) => {
  const getHref = (type: string) => {
    switch (type) {
      case 'twitter':
        return 'https://x.com/PhaetonAIinc';
      case 'linkedin':
        return 'https://www.linkedin.com/in/pierre-robert-phaeton-3971b3336?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app';
      case 'youtube':
        return 'https://www.youtube.com/@phaetonai';
      case 'instagram':
        return 'https://www.instagram.com/phaetonai/';
      case 'tiktok':
        return 'https://www.tiktok.com/@phaetonai?_t=8r0S4PsFLj4&_r=1';
      default:
        return '#';
    }
  };

  return (
    <a 
      href={getHref(type)} 
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {type === 'twitter' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
        </svg>
      )}
      {type === 'linkedin' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
        </svg>
      )}
      {type === 'youtube' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )}
      {type === 'instagram' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )}
      {type === 'tiktok' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )}
    </a>
  );
};

export default Footer;