// Analytics utility functions for tracking visitor data
import { supabase } from '../lib/supabase';

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Get current Toronto time
function getTorontoTime(): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
}

// Get user's geographic location using IP (cached in session)
async function getGeolocation(): Promise<{ country: string; city: string }> {
  // Check if we already have location cached in this session
  const cachedLocation = sessionStorage.getItem('user_location');
  if (cachedLocation) {
    return JSON.parse(cachedLocation);
  }

  try {
    // Use a free IP geolocation service - try ipapi.co first
    console.log('Fetching user location from ipapi.co...');
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();

      // Check if we got valid data (not rate limited)
      if (data.country_name && data.country_name !== 'Unknown' && !data.error) {
        const location = {
          country: data.country_name,
          city: data.city || 'Unknown'
        };

        // Cache the location for this session
        sessionStorage.setItem('user_location', JSON.stringify(location));
        console.log('Location cached from ipapi.co:', location);
        return location;
      }
    }
  } catch (error) {
    console.log('ipapi.co failed, trying alternative service:', error);
  }

  // Try alternative geolocation service
  try {
    console.log('Trying alternative geolocation service...');
    const response = await fetch('https://freeipapi.com/api/json');
    if (response.ok) {
      const data = await response.json();
      if (data.countryName) {
        const location = {
          country: data.countryName,
          city: data.cityName || 'Unknown'
        };
        sessionStorage.setItem('user_location', JSON.stringify(location));
        console.log('Location cached from freeipapi:', location);
        return location;
      }
    }
  } catch (error) {
    console.log('Alternative service also failed:', error);
  }

  // Fallback to Canada/Toronto for localhost development
  const fallback = {
    country: 'Canada',
    city: 'Toronto'
  };
  sessionStorage.setItem('user_location', JSON.stringify(fallback));
  console.log('Using fallback location:', fallback);
  return fallback;
}

// Track page view
export async function trackPageView(path: string = window.location.pathname): Promise<void> {
  try {
    const sessionId = getSessionId();
    const torontoTime = getTorontoTime();
    const today = torontoTime.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentHour = torontoTime.getHours();
    
    console.log(`Tracking page view: ${path} at Toronto time: ${torontoTime.toLocaleString()}, Hour: ${currentHour}`);

    // Get geographic location
    const location = await getGeolocation();
    console.log(`Visitor location: ${location.city}, ${location.country}`);

    // Store in localStorage as backup
    const stored = localStorage.getItem('site_analytics') || '{}';
    const analytics = JSON.parse(stored);
    
    // Initialize structure if needed
    if (!analytics.visitors) analytics.visitors = {};
    if (!analytics.pageViews) analytics.pageViews = {};
    if (!analytics.countries) analytics.countries = {};
    if (!analytics.cities) analytics.cities = {};
    if (!analytics.hourlyVisitors) analytics.hourlyVisitors = {};
    
    const todayString = torontoTime.toDateString();
    
    // Track visitor
    if (!analytics.visitors[todayString]) {
      analytics.visitors[todayString] = [];
    }
    if (!analytics.visitors[todayString].includes(sessionId)) {
      analytics.visitors[todayString].push(sessionId);
    }
    
    // Track page view
    if (!analytics.pageViews[todayString]) {
      analytics.pageViews[todayString] = {};
    }
    analytics.pageViews[todayString][path] = (analytics.pageViews[todayString][path] || 0) + 1;
    
    // Track hourly visitors using Toronto time
    if (!analytics.hourlyVisitors[todayString]) {
      analytics.hourlyVisitors[todayString] = {};
    }
    if (!analytics.hourlyVisitors[todayString][currentHour]) {
      analytics.hourlyVisitors[todayString][currentHour] = [];
    }
    if (!analytics.hourlyVisitors[todayString][currentHour].includes(sessionId)) {
      analytics.hourlyVisitors[todayString][currentHour].push(sessionId);
    }
    
    // Track geographic data - always track since we now have fallback
    analytics.countries[location.country] = (analytics.countries[location.country] || 0) + 1;
    analytics.cities[location.city] = (analytics.cities[location.city] || 0) + 1;
    
    localStorage.setItem('site_analytics', JSON.stringify(analytics));

    // Track in Supabase if available
    if (supabase) {
      try {
        // Track visitor
        const { data: existingVisitor } = await supabase
          .from('analytics_visitors')
          .select('id')
          .eq('session_id', sessionId)
          .eq('date_visited', today)
          .maybeSingle();

        if (!existingVisitor) {
          await supabase
            .from('analytics_visitors')
            .insert({
              session_id: sessionId,
              date_visited: today
            });
        }

        // Track page view
        const { data: existingPageView } = await supabase
          .from('analytics_page_views')
          .select('id, view_count')
          .eq('page_path', path)
          .eq('date_viewed', today)
          .maybeSingle();

        if (existingPageView) {
          await supabase
            .from('analytics_page_views')
            .update({
              view_count: existingPageView.view_count + 1,
              updated_at: torontoTime.toISOString()
            })
            .eq('id', existingPageView.id);
        } else {
          await supabase
            .from('analytics_page_views')
            .insert({
              page_path: path,
              date_viewed: today,
              view_count: 1
            });
        }

        // Track hourly stats using Toronto time
        const { data: existingHourlyStat } = await supabase
          .from('analytics_hourly_stats')
          .select('id')
          .eq('date_hour', today)
          .eq('hour_of_day', currentHour)
          .eq('session_id', sessionId)
          .maybeSingle();

        if (!existingHourlyStat) {
          await supabase
            .from('analytics_hourly_stats')
            .insert({
              date_hour: today,
              hour_of_day: currentHour,
              session_id: sessionId
            });
        }

        // Track geolocation data in Supabase - always track since we have valid fallback
        const { data: existingGeo } = await supabase
          .from('analytics_geolocations')
          .select('id')
          .eq('session_id', sessionId)
          .eq('country', location.country)
          .eq('city', location.city)
          .maybeSingle();

        if (!existingGeo) {
          await supabase
            .from('analytics_geolocations')
            .insert({
              session_id: sessionId,
              country: location.country,
              city: location.city,
              date_visited: today
            });
        }

        console.log(`Successfully tracked analytics for Toronto hour: ${currentHour} from ${location.city}, ${location.country}`);

      } catch (error) {
        console.error('Error tracking in Supabase:', error);
      }
    }

  } catch (error) {
    console.error('Error in trackPageView:', error);
  }
}

// Initialize analytics tracking
export function initializeAnalytics(): void {
  // Track initial page view
  trackPageView();

  // Track page views on navigation (for SPAs)
  let currentPath = window.location.pathname;
  
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      trackPageView(currentPath);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Track page views on popstate (back/forward navigation)
  window.addEventListener('popstate', () => {
    trackPageView();
  });

  console.log('Analytics tracking initialized with Toronto timezone');
}