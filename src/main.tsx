import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAnalytics } from './utils/analytics';

// Initialize analytics tracking (with error handling)
try {
  initializeAnalytics();
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

// Get root element with fallback
const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;"><div style="text-align: center;"><h1>Loading Phaeton AI...</h1><p>Please wait while the application loads.</p></div></div>';
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
