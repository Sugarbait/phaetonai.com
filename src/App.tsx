import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminBlogPage from './pages/AdminBlogPage';
import BlogEditPage from './pages/BlogEditPage';
import BlogViewPage from './pages/BlogViewPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SupportPage from './pages/SupportPage';
import FAQPage from './pages/FAQPage';
import SecurityPage from './pages/SecurityPage';
import HeroPage from './pages/HeroPage';
import SiteDataPage from './pages/SiteDataPage';
import NotFoundPage from './pages/NotFoundPage';
import NewsletterPopup from './components/ui/NewsletterPopup';
import ChatWidget from './components/ui/ChatWidget';
import FallingSnow from './components/holiday/FallingSnow';
import { useHolidayTheme } from './hooks/useHolidayTheme';

function AppContent() {
  const { isHolidaySeason } = useHolidayTheme();

  return (
    <div className={`min-h-screen transition-all duration-500 text-slate-900 ${
      isHolidaySeason
        ? 'bg-gradient-to-b from-red-50 to-red-100'
        : 'bg-gradient-to-b from-slate-50 to-slate-100'
    }`}>
      {isHolidaySeason && <FallingSnow />}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/blog/edit/:id" element={<BlogEditPage />} />
          <Route path="/admin/blog/view/:id" element={<BlogViewPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/hero" element={<HeroPage />} />
          <Route path="/sitedata" element={<SiteDataPage />} />
          {/* 404 Catch-all route - must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <NewsletterPopup />
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;