import React, { useEffect } from 'react';
import { trackPageView } from '../../utils/analytics';

interface AnalyticsTrackerProps {
  path?: string;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ path }) => {
  useEffect(() => {
    // Track the page view when component mounts or path changes
    trackPageView(path);
  }, [path]);

  // This component doesn't render anything visible
  return null;
};

export default AnalyticsTracker;