import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Eye, Globe, Clock, TrendingUp, MapPin, Calendar, LogOut, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  todaysViews: number;
  todaysVisitors: number;
  topPages: Array<{ path: string; views: number }>;
  topCountries: Array<{ country: string; visitors: number }>;
  topCities: Array<{ city: string; visitors: number }>;
  hourlyStats: Array<{ hour: number; visitors: number }>;
  recentInteractions: Array<{
    user_message: string;
    bot_response: string;
    created_at: string;
    response_time_ms: number;
  }>;
}

const SiteDataPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('30days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVisitors: 0,
    totalPageViews: 0,
    todaysViews: 0,
    todaysVisitors: 0,
    topPages: [],
    topCountries: [],
    topCities: [],
    hourlyStats: [],
    recentInteractions: []
  });

  // Check authentication on mount and reload when date range changes
  useEffect(() => {
    const authStatus = sessionStorage.getItem('analytics_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadAnalyticsData();
    }
  }, [dateRange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication
    if (username === 'admin' && password === '$Ineed1millie$_phaetonai') {
      setIsAuthenticated(true);
      sessionStorage.setItem('analytics_auth', 'true');
      setError('');
      loadAnalyticsData();
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('analytics_auth');
    setUsername('');
    setPassword('');
    setError('');
    setAnalyticsData({
      totalVisitors: 0,
      totalPageViews: 0,
      todaysViews: 0,
      todaysVisitors: 0,
      topPages: [],
      topCountries: [],
      topCities: [],
      hourlyStats: [],
      recentInteractions: []
    });
  };

  const clearOldTimezoneData = async () => {
    try {
      // Clear localStorage completely
      localStorage.removeItem('site_analytics');
      
      // Clear sessionStorage to reset session tracking
      sessionStorage.removeItem('analytics_session_id');
      sessionStorage.removeItem('user_location');
      
      // If Supabase is available, clear today's incorrect hourly data
      if (supabase) {
        const now = new Date();
        const torontoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
        const today = torontoTime.toISOString().split('T')[0];
        
        // Remove potentially incorrect hourly stats for today
        await supabase
          .from('analytics_hourly_stats')
          .delete()
          .eq('date_hour', today);
          
        console.log('Cleared Supabase hourly data for today:', today);
      }
      
      // Reset analytics data state to empty
      setAnalyticsData({
        totalVisitors: 0,
        totalPageViews: 0,
        todaysViews: 0,
        todaysVisitors: 0,
        topPages: [],
        topCountries: [],
        topCities: [],
        hourlyStats: [],
        recentInteractions: []
      });
      
      console.log('Completely cleared all analytics data. Please browse the site to generate fresh data.');
      alert('All analytics data cleared! Please browse some pages on your site to generate new, correctly timed data, then refresh this page.');
      
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Error clearing data. Check console for details.');
    }
  };

  const loadAnalyticsData = async () => {
    if (!supabase) {
      console.warn('Supabase not available, using localStorage data');
      loadLocalStorageData();
      return;
    }

    setLoading(true);
    try {
      // Get current date (using UTC to avoid timezone issues)
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Calculate start date based on selected range
      const startDate = new Date(now);
      if (dateRange === 'today') {
        // Start from today - beginning of day
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === '7days') {
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === '30days') {
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
      } else {
        // 'all' - go back 1 year
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
      }

      const startDateString = startDate.toISOString().split('T')[0];
      console.log(`Current date: ${today}, Start date for query: ${startDateString}, Range: ${dateRange}`);
      console.log(`Will query for geo data >= ${startDate.toISOString()}`);

      const { data: visitors } = await supabase
        .from('analytics_visitors')
        .select('session_id')
        .gte('date_visited', startDateString)
        .order('created_at', { ascending: false });

      const uniqueVisitors = new Set(visitors?.map(v => v.session_id) || []).size;

      // Get total page views based on selected date range
      const { data: pageViews } = await supabase
        .from('analytics_page_views')
        .select('view_count')
        .gte('date_viewed', startDateString);

      const totalViews = pageViews?.reduce((sum, pv) => sum + pv.view_count, 0) || 0;

      // Get today's page views
      const { data: todaysPageViews } = await supabase
        .from('analytics_page_views')
        .select('view_count')
        .eq('date_viewed', today);

      const todaysViews = todaysPageViews?.reduce((sum, pv) => sum + pv.view_count, 0) || 0;

      // Get today's unique visitors
      const { data: todaysVisitorData } = await supabase
        .from('analytics_visitors')
        .select('session_id')
        .eq('date_visited', today)
        .order('created_at', { ascending: false });

      const todaysVisitorsCount = new Set(todaysVisitorData?.map(v => v.session_id) || []).size;
      // Get top pages
      const { data: topPagesData } = await supabase
        .from('analytics_page_views')
        .select('page_path, view_count')
        .gte('date_viewed', startDateString)
        .order('view_count', { ascending: false })
        .limit(10);

      // Process and aggregate page views by path
      const pageViewsMap: { [key: string]: number } = {};
      topPagesData?.forEach(page => {
        const path = page.page_path || '/';
        pageViewsMap[path] = (pageViewsMap[path] || 0) + page.view_count;
      });

      // Convert to array and sort by views
      const aggregatedPages = Object.entries(pageViewsMap)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Get geographic data based on date range
      console.log(`Loading geographic data from ${startDateString} (dateRange: ${dateRange})`);

      const { data: geoData, error: geoError } = await supabase
        .from('analytics_geolocations')
        .select('country, city, created_at')
        .gte('created_at', startDate.toISOString());

      if (geoError) {
        console.error('Error loading geo data:', geoError);
      }

      console.log(`Loaded ${geoData?.length || 0} geo records from database`);

      // Process geographic data
      const countryCount: { [key: string]: number } = {};
      const cityCount: { [key: string]: number } = {};

      geoData?.forEach(geo => {
        if (geo.country) {
          countryCount[geo.country] = (countryCount[geo.country] || 0) + 1;
        }
        if (geo.city && geo.city !== 'Unknown') {
          cityCount[geo.city] = (cityCount[geo.city] || 0) + 1;
        }
      });

      console.log('Country counts:', countryCount);
      console.log('City counts:', cityCount);

      const topCountries = Object.entries(countryCount)
        .map(([country, visitors]) => ({ country, visitors }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10);

      const topCities = Object.entries(cityCount)
        .map(([city, visitors]) => ({ city, visitors }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10);

      // Get hourly stats for today
      const { data: hourlyData } = await supabase
        .from('analytics_hourly_stats')
        .select('hour_of_day, session_id')
        .eq('date_hour', today);

      // Simple hourly data processing
      const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        visitors: Math.floor(Math.random() * 10) // Simple demo data
      }));

      // Get recent chatbot interactions
      const { data: interactions } = await supabase
        .from('chatbot_interactions')
        .select('user_message, bot_response, created_at, response_time_ms')
        .order('created_at', { ascending: false })
        .limit(10);

      setAnalyticsData({
        totalVisitors: uniqueVisitors,
        totalPageViews: totalViews,
        todaysViews,
        todaysVisitors: todaysVisitorsCount,
        topPages: aggregatedPages,
        topCountries,
        topCities,
        hourlyStats,
        recentInteractions: interactions || []
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
      loadLocalStorageData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalStorageData = () => {
    try {
      const stored = localStorage.getItem('site_analytics');
      
      // Use Toronto time consistently
      const now = new Date();
      const torontoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
      const today = torontoTime.toISOString().split('T')[0];
      const todayDateString = torontoTime.toDateString();
      const currentHour = torontoTime.getHours();
      
      // Initialize hourly stats for today
      const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        visitors: 0
      }));
      
      console.log(`Current Toronto time: ${torontoTime.toLocaleString()}, Hour: ${currentHour}`);
      
      if (stored) {
        const localData = JSON.parse(stored);
        
        // Process hourly visitors from localStorage - only show reasonable hours
        const todayHourlyData = localData.hourlyVisitors?.[todayDateString];
        if (todayHourlyData && typeof todayHourlyData === 'object') {
          Object.entries(todayHourlyData).forEach(([hourStr, sessions]) => {
            const hour = parseInt(hourStr);
            
            // VALIDATION: Only accept data for hours that make sense
            // Don't show data for future hours (like 21/9PM when it's 10AM)
            if (hour >= 0 && hour <= 23 && Array.isArray(sessions) && hour <= currentHour + 1) {
              // Count unique sessions for this hour
              const uniqueSessions = new Set(sessions);
              hourlyStats[hour].visitors = uniqueSessions.size;
              console.log(`Hour ${hour}: ${uniqueSessions.size} unique visitors from localStorage (VALID)`);
            } else if (hour > currentHour + 1) {
              console.log(`Rejecting future hour data: Hour ${hour} when current is ${currentHour}`);
            }
          });
        }
        
        // Process localStorage data
        let totalVisitors = 0;
        let totalPageViews = 0;
        let todaysVisitors = 0;
        let todaysViews = 0;
        
        console.log('Processing localStorage data for analytics...');
        const localPageViewsMap: { [key: string]: number } = {};
        
        Object.values(localData.visitors || {}).forEach((dayVisitors: any) => {
          if (Array.isArray(dayVisitors)) {
            totalVisitors += dayVisitors.length;
          }
        });

        // Calculate today's unique visitors from localStorage
        const todayVisitors = localData.visitors?.[todayDateString];
        if (Array.isArray(todayVisitors)) {
          todaysVisitors = todayVisitors.length;
          console.log(`Today's visitors from localStorage: ${todaysVisitors}`);
        }

        Object.values(localData.pageViews || {}).forEach((dayViews: any) => {
          if (typeof dayViews === 'object') {
            Object.entries(dayViews).forEach(([path, views]) => {
              // Ensure we have a valid path, default to '/' if empty or undefined
              const cleanPath = path && path.trim() !== '' ? path : '/';
              localPageViewsMap[cleanPath] = (localPageViewsMap[cleanPath] || 0) + (views as number);
              totalPageViews += views as number;
            });
          }
        });

        // Calculate today's views from localStorage
        const todayPageViews = localData.pageViews?.[todayDateString];
        if (typeof todayPageViews === 'object') {
          todaysViews = Object.values(todayPageViews).reduce((sum: number, views: any) => sum + (views as number), 0);
        }

        // Convert to array and sort by views, ensuring we have distinct paths
        const topPages = Object.entries(localPageViewsMap)
          .map(([path, views]) => ({ path, views }))
          .filter(page => page.path && page.path.trim() !== '') // Filter out empty paths
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);

        const topCountries = Object.entries(localData.countries || {})
          .map(([country, visitors]) => ({ country, visitors: visitors as number }))
          .sort((a, b) => b.visitors - a.visitors)
          .slice(0, 10);

        const topCities = Object.entries(localData.cities || {})
          .map(([city, visitors]) => ({ city, visitors: visitors as number }))
          .sort((a, b) => b.visitors - a.visitors)
          .slice(0, 10);

        setAnalyticsData({
          totalVisitors,
          totalPageViews,
          todaysVisitors,
          todaysViews,
          topPages,
          topCountries,
          topCities,
          hourlyStats,
          recentInteractions: []
        });
        
        console.log('Final hourly stats from localStorage:', hourlyStats.filter(h => h.visitors > 0));
      }
    } catch (error) {
      console.error('Error loading localStorage data:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 min-h-screen relative overflow-hidden">
        {/* Digital technological background - same as admin blog pages */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Circuit board pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  {/* Horizontal lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                  <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  
                  {/* Vertical lines */}
                  <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                  <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  
                  {/* Circuit nodes */}
                  <circle cx="20" cy="20" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                  <circle cx="50" cy="50" r="1.5" fill="rgba(59, 130, 246, 0.8)"/>
                  <circle cx="80" cy="80" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                  <circle cx="80" cy="20" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                  <circle cx="20" cy="80" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                  
                  {/* Small rectangles (chips) */}
                  <rect x="18" y="48" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                  <rect x="78" y="18" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)"/>
            </svg>
          </div>

          {/* Digital grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}>
          </div>

          {/* Glowing orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>

          {/* Binary code pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-blue-300 text-xs font-mono transform rotate-12">
              01001000 01100101 01101100 01101100 01101111
            </div>
            <div className="absolute top-32 right-20 text-blue-300 text-xs font-mono transform -rotate-6">
              01000001 01001001 00100000 01010000 01101111
            </div>
            <div className="absolute bottom-20 left-1/3 text-blue-300 text-xs font-mono transform rotate-3">
              01110111 01100101 01110010 01100101 01100100
            </div>
          </div>

          {/* Hexagonal tech pattern */}
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagon" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                  <polygon points="30,2 45,15 45,37 30,50 15,37 15,15" 
                           fill="none" 
                           stroke="rgba(59, 130, 246, 0.3)" 
                           strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagon)"/>
            </svg>
          </div>
        </div>

        {/* Login form with beautiful styling - RAISED HIGHER */}
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="flex items-start justify-center pt-8 sm:pt-12 md:pt-16 min-h-screen">
            <div className="w-full max-w-md mx-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="p-6 sm:p-8">
                  {/* Header with logo */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo-White.png"
                        alt="Phaeton AI"
                        className="h-12 w-auto"
                        width="200"
                        height="48"
                      />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Site Analytics</h1>
                    <p className="text-sm sm:text-base text-blue-100">Please login to access the analytics dashboard</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 text-base"
                        placeholder="Enter username"
                        required
                        autoComplete="username"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 text-base"
                        placeholder="Enter password"
                        required
                        autoComplete="current-password"
                      />
                    </div>

                    {error && (
                      <div className="text-red-300 text-sm text-center bg-red-500/20 backdrop-blur-sm p-3 rounded-lg border border-red-400/30">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 transition-all duration-200 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Login to Analytics Dashboard
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-white/20 text-center">
                    <p className="text-xs text-blue-200">
                      Secure access to Phaeton AI analytics system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Site Analytics Dashboard</h1>
                <p className="text-gray-600 text-sm sm:text-base">Real-time website analytics and visitor insights</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={async () => {
                    setLoading(true);
                    await clearOldTimezoneData();
                    setLoading(false);
                  }}
                  className="bg-orange-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-xs sm:text-sm"
                  title="Clear all timezone-incorrect data (localStorage + Supabase)"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Reset All Data
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Date Range:</span>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2">
                  <button
                    onClick={() => setDateRange('today')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      dateRange === 'today'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setDateRange('7days')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      dateRange === '7days'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setDateRange('30days')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      dateRange === '30days'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setDateRange('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      dateRange === 'all'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {dateRange === 'today' ? "Today's" : dateRange === '7days' ? '7-Day' : dateRange === '30days' ? '30-Day' : 'Total'} Visitors
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{analyticsData.totalVisitors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {dateRange === 'today' ? "Today's" : dateRange === '7days' ? '7-Day' : dateRange === '30days' ? '30-Day' : 'Total'} Views
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{analyticsData.totalPageViews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Views</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{analyticsData.todaysViews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Visitors</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{analyticsData.todaysVisitors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Interactions</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{analyticsData.recentInteractions.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Data */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            {/* Hourly Visitor Chart */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 xl:col-span-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                  Today's Visitor Activity by Hour
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last 24 hours</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Toronto Time: {(() => {
                      const now = new Date();
                      const torontoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
                      return torontoTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      });
                    })()}
                  </div>
                </div>
              </div>
              
              {analyticsData.hourlyStats.some(stat => stat.visitors > 0) ? (
                <div className="relative">
                  {/* Enhanced High-Resolution Line Chart */}
                  <div className="relative h-80 border-b border-l border-gray-200 pl-12 pb-6">
                    <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4"/>
                          <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05"/>
                        </linearGradient>
                        <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(37, 99, 235)"/>
                          <stop offset="50%" stopColor="rgb(59, 130, 246)"/>
                          <stop offset="100%" stopColor="rgb(96, 165, 250)"/>
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {(() => {
                        const maxVisitors = Math.max(...analyticsData.hourlyStats.map(s => s.visitors), 1);
                        // Get current Toronto time to match analytics tracking
                        const now = new Date();
                        const torontoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
                        const currentHour = torontoTime.getHours();
                        
                        // Create high-resolution interpolated points
                        const createSmoothCurve = () => {
                          const points = [];
                          const resolution = 4; // 4x more points for smoother curves
                          
                          for (let i = 0; i < analyticsData.hourlyStats.length - 1; i++) {
                            const current = analyticsData.hourlyStats[i];
                            const next = analyticsData.hourlyStats[i + 1];
                            
                            for (let j = 0; j < resolution; j++) {
                              const t = j / resolution;
                              const smoothT = t * t * (3 - 2 * t); // Smoothstep interpolation
                              
                              const x = ((i + smoothT) / (analyticsData.hourlyStats.length - 1)) * 1000;
                              const interpolatedValue = current.visitors + (next.visitors - current.visitors) * smoothT;
                              const y = 400 - (interpolatedValue / maxVisitors) * 350; // 350 to leave space at top
                              
                              points.push({ x, y, hour: current.hour + smoothT });
                            }
                          }
                          
                          // Add the last point
                          const lastStat = analyticsData.hourlyStats[analyticsData.hourlyStats.length - 1];
                          points.push({
                            x: 1000,
                            y: 400 - (lastStat.visitors / maxVisitors) * 350,
                            hour: lastStat.hour
                          });
                          
                          return points;
                        };
                        
                        const smoothPoints = createSmoothCurve();
                        const pathData = smoothPoints.map((point, index) => 
                          `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                        ).join(' ');
                        
                        const areaPathData = `M 0 400 L ${smoothPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L 1000 400 Z`;
                        
                        return (
                          <>
                            {/* Grid lines for better readability */}
                            <g stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1">
                              {/* Horizontal grid lines */}
                              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                                <line
                                  key={`h-grid-${index}`}
                                  x1="0"
                                  y1={400 - ratio * 350}
                                  x2="1000"
                                  y2={400 - ratio * 350}
                                  strokeDasharray="5,5"
                                />
                              ))}
                              {/* Vertical grid lines */}
                              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                                <line
                                  key={`v-grid-${index}`}
                                  x1={ratio * 1000}
                                  y1="0"
                                  x2={ratio * 1000}
                                  y2="400"
                                  strokeDasharray="5,5"
                                />
                              ))}
                            </g>
                            
                            {/* Area under the curve */}
                            <path
                              d={areaPathData}
                              fill="url(#lineGradient)"
                              className="opacity-60"
                            />
                            
                            {/* Main line with enhanced styling */}
                            <path
                              d={pathData}
                              fill="none"
                              stroke="url(#lineStroke)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              filter="url(#glow)"
                              className="drop-shadow-lg"
                            />
                            
                            {/* Data points with enhanced styling */}
                            {analyticsData.hourlyStats.map((stat, index) => {
                              const x = (index / (analyticsData.hourlyStats.length - 1)) * 1000;
                              const y = 400 - (stat.visitors / maxVisitors) * 350;
                              const isCurrentHour = stat.hour === currentHour;
                              const hasData = stat.visitors > 0;
                              
                              return (
                                <g key={index}>
                                  {/* Outer glow for current hour */}
                                  {isCurrentHour && (
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="12"
                                      fill="rgba(59, 130, 246, 0.2)"
                                      className="animate-pulse"
                                    />
                                  )}
                                  
                                  {/* Main data point */}
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r={isCurrentHour ? "6" : hasData ? "4" : "2"}
                                    fill={isCurrentHour ? "rgb(37, 99, 235)" : hasData ? "rgb(59, 130, 246)" : "rgb(156, 163, 175)"}
                                    stroke="white"
                                    strokeWidth="2"
                                    className="drop-shadow-md cursor-pointer hover:r-8 transition-all duration-200"
                                  />
                                  
                                  {/* Tooltip on hover */}
                                  <g className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <rect
                                      x={x - 35}
                                      y={y - 35}
                                      width="70"
                                      height="25"
                                      fill="rgba(0, 0, 0, 0.8)"
                                      rx="4"
                                    />
                                    <text
                                      x={x}
                                      y={y - 18}
                                      textAnchor="middle"
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="500"
                                    >
                                      {stat.hour}:00 - {stat.visitors}
                                    </text>
                                  </g>
                                </g>
                              );
                            })}
                            
                            {/* Current time indicator */}
                          </>
                        );
                      })()}
                    </svg>
                    
                    {/* Enhanced hour labels */}
                    <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-gray-600 font-medium">
                      {[0, 3, 6, 9, 12, 15, 18, 21, 23].map(hour => {
                        // Get current Toronto time to highlight current hour
                        const now = new Date();
                        const torontoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
                        const currentHour = torontoTime.getHours();
                        const isCurrentHour = hour === currentHour;
                        
                        return (
                        <span key={hour} className="transform -translate-x-1/2">
                          {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </span>
                        );
                      })}
                    </div>
                    
                    {/* Enhanced Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-600 font-medium">
                      {(() => {
                        const maxVisitors = Math.max(...analyticsData.hourlyStats.map(s => s.visitors), 1);
                        return [maxVisitors, Math.floor(maxVisitors * 0.75), Math.floor(maxVisitors * 0.5), Math.floor(maxVisitors * 0.25), 0].map((value, index) => (
                          <span key={index} className="text-right pr-3 bg-gray-50 px-1 rounded">
                            {value}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                  
                  {/* Chart Summary */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-600">
                        {analyticsData.todaysVisitors}
                      </div>
                      <div className="text-xs text-blue-600">Total Today</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">
                        {Math.max(...analyticsData.hourlyStats.map(s => s.visitors))}
                      </div>
                      <div className="text-xs text-green-600">Peak Hour</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600">
                        {analyticsData.hourlyStats.filter(s => s.visitors > 0).length}
                      </div>
                      <div className="text-xs text-purple-600">Active Hours</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">
                        {(() => {
                          const activeHours = analyticsData.hourlyStats.filter(s => s.visitors > 0);
                          return activeHours.length > 0 
                            ? Math.round(activeHours.reduce((sum, stat) => sum + stat.visitors, 0) / activeHours.length)
                            : 0;
                        })()}
                      </div>
                      <div className="text-xs text-orange-600">Avg/Hour</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Hourly Data Yet</h4>
                  <p className="text-sm text-gray-500 mb-1">Visitor activity will appear here throughout the day</p>
                  <p className="text-xs text-gray-400">Check back later to see when visitors are most active</p>
                </div>
              )}
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Top Pages</h3>
              <div className="space-y-2 sm:space-y-3">
                {analyticsData.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1 mr-4 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-base sm:text-lg text-gray-900 font-bold">
                          {page.path === '/' ? 'Homepage' : page.path}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 ml-6">
                        Page URL
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-lg font-bold text-blue-600">{page.views}</span>
                    </div>
                  </div>
                ))}
                {analyticsData.topPages.length === 0 && (
                  <div className="text-center py-8">
                    <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No page data available</p>
                    <p className="text-xs text-gray-400 mt-1">Page views will appear here once visitors browse the site</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Top Countries</h3>
              <div className="space-y-2 sm:space-y-3">
                {analyticsData.topCountries.slice(0, 5).map((country, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      <span className="ml-2 text-sm sm:text-base text-gray-900 font-semibold">{country.country}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-lg font-bold text-green-600">{country.visitors}</span>
                    </div>
                  </div>
                ))}
                {analyticsData.topCountries.length === 0 && (
                  <div className="text-center py-8">
                    <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No geographic data available</p>
                    <p className="text-xs text-gray-400 mt-1">Visitor locations will appear here once traffic is detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* No Data Message */}
          {analyticsData.totalVisitors === 0 && analyticsData.totalPageViews === 0 && (
            <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Analytics Data Available</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Analytics data will appear here once visitors start using the website.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteDataPage;