import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for custom event to close mobile menu
  useEffect(() => {
    const handleCloseMobileMenu = () => {
      setIsOpen(false);
    };

    window.addEventListener('closeMobileMenu', handleCloseMobileMenu);
    return () => {
      window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status for site data page
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('analytics_auth');
      setIsAuthenticated(authStatus === 'true');
    };

    checkAuth();
    
    // Listen for storage changes to update auth status
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically since sessionStorage changes don't trigger storage event
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
  };

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isOnBlogPage = location.pathname === '/blog';
  const isOnBlogPostPage = location.pathname.startsWith('/blog/'); // Check for individual blog posts
  const isOnAdminBlogPage = location.pathname.startsWith('/admin/blog'); // Check for admin blog page and its subpages
  const isOnSiteDataPage = location.pathname === '/sitedata';
  
  // Use white text and logo on blog pages and blog post pages when NOT scrolled
  // Admin blog pages should use dark text/logo when not scrolled
  
  // Use dark text and logo on admin blog pages and site data page when NOT scrolled
  // Use white text and logo on blog pages and blog post pages when NOT scrolled
  const shouldUseWhiteText = ((isOnBlogPage || isOnBlogPostPage) && !scrolled);
  
  // Use dark text and logo on admin blog pages and site data page when NOT scrolled
  const shouldUseDarkText = ((isOnAdminBlogPage || isOnSiteDataPage) && !scrolled);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' 
          : shouldUseWhiteText ? 'bg-transparent' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center space-x-2"
            >
              <img
                src={shouldUseWhiteText ? "https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo-White.png" : "https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo.png"}
                alt="Phaeton AI - Leading artificial intelligence consulting company specializing in enterprise chatbot development and voice assistant solutions"
                className="h-8 w-auto transition-opacity duration-300"
                loading="eager"
                width="200"
                height="32"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center space-x-8 ${shouldUseWhiteText ? 'text-white' : shouldUseDarkText ? 'text-gray-900' : ''}`}>
            <NavLinks scrollToSection={scrollToSection} isWhiteText={shouldUseWhiteText} isDarkText={shouldUseDarkText} />
            <SearchBar />
            <Button 
              variant="primary"
              onClick={handleContactClick}
            >
              Contact Us
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <SearchBar />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`hover:text-gray-700 focus:outline-none ${shouldUseWhiteText ? 'text-white' : shouldUseDarkText ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        } overflow-hidden bg-white`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <NavLinksMobile scrollToSection={scrollToSection} />
          <Button 
            variant="primary" 
            onClick={(e) => {
              handleContactClick(e);
              setIsOpen(false);
            }}
            fullWidth
          >
            Contact Us
          </Button>
        </div>
      </div>
    </header>
  );
};

const NavLinks = ({ scrollToSection, isWhiteText, isDarkText }: { scrollToSection: (id: string) => void, isWhiteText: boolean, isDarkText?: boolean }) => {
  const linkClasses = isWhiteText 
    ? "text-white hover:text-blue-200 transition-colors font-semibold tracking-wide text-[15px] uppercase hover:scale-105 transform duration-200"
    : isDarkText
      ? "text-gray-900 hover:text-blue-600 transition-colors font-semibold tracking-wide text-[15px] uppercase hover:scale-105 transform duration-200"
      : "text-gray-700 hover:text-blue-600 transition-colors font-semibold tracking-wide text-[15px] uppercase hover:scale-105 transform duration-200";

  return (
    <>
      <button onClick={() => scrollToSection('features')} className={linkClasses}>Features</button>
      <button onClick={() => scrollToSection('how-it-works')} className={linkClasses}>How It Works</button>
      <Link to="/blog" className={linkClasses}>Blog</Link>
      <button onClick={() => scrollToSection('about')} className={linkClasses}>About Us</button>
      <button onClick={() => scrollToSection('pricing')} className={linkClasses}>Pricing</button>
    </>
  );
};

const NavLinksMobile = ({ scrollToSection }: { scrollToSection: (id: string) => void }) => {
  const navigate = useNavigate();
  
  const handleBlogClick = () => {
    navigate('/blog');
    // Close the mobile menu by triggering a state change in parent
    const event = new CustomEvent('closeMobileMenu');
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col space-y-4">
      <button 
        onClick={() => scrollToSection('features')}
        className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left font-semibold tracking-wide text-[15px] uppercase"
      >
        Features
      </button>
      <button 
        onClick={() => scrollToSection('how-it-works')}
        className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left font-semibold tracking-wide text-[15px] uppercase"
      >
        How It Works
      </button>
      <button 
        onClick={handleBlogClick}
        className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left font-semibold tracking-wide text-[15px] uppercase"
      >
        Blog
      </button>
      <button 
        onClick={() => scrollToSection('about')}
        className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left font-semibold tracking-wide text-[15px] uppercase"
      >
        About Us
      </button>
      <button 
        onClick={() => scrollToSection('pricing')}
        className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left font-semibold tracking-wide text-[15px] uppercase"
      >
        Pricing
      </button>
    </div>
  );
};

export default Navbar;