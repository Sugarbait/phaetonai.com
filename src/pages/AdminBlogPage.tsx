import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, User, Tag, Wand2, RefreshCw, AlertTriangle, X, TrendingUp, LogOut, Clock, Play, Pause, Settings, Activity } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  keywords: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  ai_generated?: boolean;
  generation_method?: string;
}

interface CronJob {
  jobid: number;
  jobname: string;
  schedule: string;
  active: boolean;
  database: string;
  username: string;
}

interface CronJobRun {
  jobid: number;
  runid: number;
  status: string;
  return_message: string;
  start_time: string;
  end_time: string;
  jobname: string;
}

const AdminBlogPage = () => {
  console.log('=== ADMIN BLOG PAGE RENDERING ===');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    post: BlogPost | null;
  }>({ isOpen: false, post: null });
  const navigate = useNavigate();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Auto-posting state
  const [autoPostingEnabled, setAutoPostingEnabled] = useState(false);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [cronJobRuns, setCronJobRuns] = useState<CronJobRun[]>([]);
  const [autoPostingLoading, setAutoPostingLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('0 13 * * 1'); // Default: Monday 1 PM UTC
  const [customScheduleMode, setCustomScheduleMode] = useState(false);
  const [customCronExpression, setCustomCronExpression] = useState('');
  const [cronExpressionError, setCronExpressionError] = useState('');

  // UI state
  const [showAutoPostingControls, setShowAutoPostingControls] = useState(false);
  const [postFilter, setPostFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  // Visual schedule builder state
  const [scheduleBuilderMode, setScheduleBuilderMode] = useState<'beginner' | 'expert'>('beginner');
  const [visualSchedule, setVisualSchedule] = useState({
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'custom',
    time: { hour: 8, minute: 0, period: 'AM' as 'AM' | 'PM' },
    timezone: 'EST' as 'EST' | 'PST' | 'CST' | 'MST' | 'UTC',
    daysOfWeek: [1] as number[], // 0=Sunday, 1=Monday, etc.
    dayOfMonth: 1,
    interval: 1, // For custom intervals
    intervalUnit: 'hours' as 'minutes' | 'hours' | 'days' | 'weeks'
  });

  // Check authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchPosts();
      fetchAutoPostingStatus();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Debug postFilter changes
  useEffect(() => {
    console.log('=== POST FILTER CHANGED ===');
    console.log('New postFilter value:', postFilter);
    console.log('Posts length:', posts.length);
    
    if (posts.length > 0) {
      const filteredCount = posts.filter(post => {
        const isPublished = post.published_at !== null && post.published_at !== '';
        switch (postFilter) {
          case 'published':
            return isPublished;
          case 'unpublished':
            return !isPublished;
          default:
            return true;
        }
      }).length;
      console.log('Filtered posts count:', filteredCount);
    }
  }, [postFilter, posts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === '$Ineed1millie$_phaetonai') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
      
      // Show success message
      toast.success('Successfully logged in to admin panel');
      
      // Load posts after successful authentication
      setLoading(true);
      try {
        await fetchPosts();
      } catch (error) {
        console.error('Error loading posts after login:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    // Clear admin authentication data only
    sessionStorage.removeItem('admin_auth');
    
    // Update state immediately
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError('');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Clear any cached data
    setPosts([]);
    setLoading(false);
  };

  const fetchPosts = async () => {
    try {
      // Use admin function to get all posts (bypasses RLS)
      const response = await fetch('https://cpkslvmydfdevdftieck.supabase.co/functions/v1/admin-get-posts', {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      const data = result.posts;
      console.log('Posts data:', data);
      
      // Debug published_at values and categorize posts
      if (data) {
        const publishedPosts = [];
        const unpublishedPosts = [];
        
        data.forEach((post, index) => {
          console.log(`Post ${index}: "${post.title}" - published_at:`, post.published_at, typeof post.published_at);
          const isPublished = post.published_at !== null && post.published_at !== '';
          if (isPublished) {
            publishedPosts.push(post.title);
          } else {
            unpublishedPosts.push(post.title);
          }
        });
        
        console.log('Published posts:', publishedPosts.length, publishedPosts);
        console.log('Unpublished posts:', unpublishedPosts.length, unpublishedPosts);
      }
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch blog posts');
    }
  };

  // Auto-posting management functions
  const fetchAutoPostingStatus = async () => {
    try {
      setAutoPostingLoading(true);
      
      // Prevent race conditions by checking if we already have a valid state
      const currentLocalStorage = localStorage.getItem('auto_posting_enabled');
      console.log('Current localStorage state before fetch:', currentLocalStorage);
      const supabaseUrl = 'https://cpkslvmydfdevdftieck.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE';
      const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const functionUrl = `${baseUrl}/functions/v1/manage-auto-posting`;
      
      console.log('=== FETCHING AUTO POSTING STATUS ===');
      console.log('Function URL:', functionUrl);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ action: 'status' })
      });

      console.log('Status response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Status fetch error:', errorText);
        throw new Error(`Failed to fetch auto-posting status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Auto posting status result:', result);
      if (result.success) {
        setCronJobs(result.result.jobs || []);
        setCronJobRuns(result.result.recentRuns || []);
        
        // Check if weekly blog generation is active
        const weeklyJob = result.result.jobs.find((job: CronJob) => 
          job.jobname === 'weekly-blog-generation' && job.active
        );
        
        // Check localStorage for user's last enable action first
        // This preserves external cron functionality when Supabase pg_cron isn't available
        const localStorageStatus = localStorage.getItem('auto_posting_enabled');
        const localStorageSchedule = localStorage.getItem('auto_posting_schedule');
        
        if (weeklyJob) {
          // Real cron job found - use that status and preserve it in localStorage
          setAutoPostingEnabled(true);
          setSelectedSchedule(weeklyJob.schedule);
          localStorage.setItem('auto_posting_enabled', 'true');
          localStorage.setItem('auto_posting_schedule', weeklyJob.schedule);
        } else if (localStorageStatus === 'true') {
          // No internal cron job but user previously enabled - external cron may be active
          // Preserve the enabled state to prevent auto-posting from appearing disabled
          setAutoPostingEnabled(true);
          if (localStorageSchedule) {
            setSelectedSchedule(localStorageSchedule);
          }
        } else {
          // No cron job and no local storage - inactive
          setAutoPostingEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error fetching auto-posting status:', error);
      toast.error('Failed to fetch auto-posting status');
    } finally {
      setAutoPostingLoading(false);
    }
  };

  const manageAutoPosting = async (action: string, schedule?: string) => {
    try {
      setAutoPostingLoading(true);
      const supabaseUrl = 'https://cpkslvmydfdevdftieck.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE';
      const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const functionUrl = `${baseUrl}/functions/v1/manage-auto-posting`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ 
          action, 
          schedule: schedule || selectedSchedule,
          jobName: 'weekly-blog-generation'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} auto-posting`);
      }

      const result = await response.json();
      if (result.success) {
        toast.success(result.result.message);
        
        // Update UI state based on action
        switch (action) {
          case 'enable':
            setAutoPostingEnabled(true);
            localStorage.setItem('auto_posting_enabled', 'true');
            localStorage.setItem('auto_posting_schedule', schedule || selectedSchedule);
            break;
          case 'disable':
            setAutoPostingEnabled(false);
            localStorage.setItem('auto_posting_enabled', 'false');
            break;
          case 'test':
            toast.success('Test blog generation started - check your posts in a few minutes');
            break;
        }
        
        // Refresh status after action
        await fetchAutoPostingStatus();
        if (action === 'test') {
          // Also refresh posts to show the new test post
          setTimeout(() => fetchPosts(), 30000); // Wait 30 seconds then refresh
        }
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error(`Error ${action} auto-posting:`, error);
      toast.error(`Failed to ${action} auto-posting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAutoPostingLoading(false);
    }
  };

  // Cron expression validation and helper functions
  const validateCronExpression = (expression: string): { isValid: boolean; error: string; description: string } => {
    if (!expression.trim()) {
      return { isValid: false, error: 'Cron expression cannot be empty', description: '' };
    }

    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      return { isValid: false, error: 'Cron expression must have exactly 5 parts: minute hour day month weekday', description: '' };
    }

    const [minute, hour, day, month, weekday] = parts;

    // Basic validation for each part
    const validateField = (value: string, min: number, max: number, fieldName: string): string => {
      if (value === '*') return '';
      if (value.includes('/')) {
        const [range, step] = value.split('/');
        if (isNaN(Number(step)) || Number(step) <= 0) {
          return `Invalid step value in ${fieldName}`;
        }
        if (range !== '*' && (isNaN(Number(range)) || Number(range) < min || Number(range) > max)) {
          return `Invalid range in ${fieldName}`;
        }
        return '';
      }
      if (value.includes('-')) {
        const [start, end] = value.split('-');
        if (isNaN(Number(start)) || isNaN(Number(end)) || 
            Number(start) < min || Number(start) > max ||
            Number(end) < min || Number(end) > max ||
            Number(start) >= Number(end)) {
          return `Invalid range in ${fieldName}`;
        }
        return '';
      }
      if (value.includes(',')) {
        const values = value.split(',');
        for (const v of values) {
          if (isNaN(Number(v)) || Number(v) < min || Number(v) > max) {
            return `Invalid value in ${fieldName}`;
          }
        }
        return '';
      }
      if (isNaN(Number(value)) || Number(value) < min || Number(value) > max) {
        return `${fieldName} must be between ${min} and ${max}`;
      }
      return '';
    };

    // Validate each field
    let error = validateField(minute, 0, 59, 'minute');
    if (!error) error = validateField(hour, 0, 23, 'hour');
    if (!error) error = validateField(day, 1, 31, 'day of month');
    if (!error) error = validateField(month, 1, 12, 'month');
    if (!error) error = validateField(weekday, 0, 7, 'day of week'); // 0 and 7 both mean Sunday

    if (error) {
      return { isValid: false, error, description: '' };
    }

    // Generate description
    const description = describeCronExpression(expression);
    return { isValid: true, error: '', description };
  };

  const describeCronExpression = (expression: string): string => {
    const [minute, hour, day, month, weekday] = expression.trim().split(/\s+/);
    
    // Common patterns
    if (expression === '0 13 * * 1') return 'Every Monday at 1:00 PM UTC (8:00 AM EST)';
    if (expression === '0 9 * * 1') return 'Every Monday at 9:00 AM UTC (4:00 AM EST)';
    if (expression === '0 17 * * 1') return 'Every Monday at 5:00 PM UTC (12:00 PM EST)';
    if (expression === '0 13 * * *') return 'Every day at 1:00 PM UTC (8:00 AM EST)';
    if (expression === '0 13 * * 1-5') return 'Weekdays at 1:00 PM UTC (8:00 AM EST)';
    if (expression === '0 */6 * * *') return 'Every 6 hours';
    if (expression === '*/30 * * * *') return 'Every 30 minutes';
    
    // Build description
    let desc = '';
    
    // Frequency
    if (weekday !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (weekday.includes('-')) {
        const [start, end] = weekday.split('-');
        desc += `Every ${days[Number(start)]} to ${days[Number(end)]}`;
      } else if (weekday.includes(',')) {
        const dayList = weekday.split(',').map(d => days[Number(d)]);
        desc += `Every ${dayList.join(', ')}`;
      } else {
        desc += `Every ${days[Number(weekday)]}`;
      }
    } else if (day !== '*') {
      desc += `On day ${day} of every month`;
    } else {
      desc += 'Every day';
    }
    
    // Time
    if (hour !== '*' && minute !== '*') {
      const h = Number(hour);
      const m = Number(minute);
      const estHour = h - 5; // Convert UTC to EST (simplified)
      desc += ` at ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} UTC`;
      if (estHour >= 0) {
        desc += ` (${estHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} EST)`;
      }
    } else if (hour.includes('/')) {
      desc += ` every ${hour.split('/')[1]} hours`;
    } else if (minute.includes('/')) {
      desc += ` every ${minute.split('/')[1]} minutes`;
    }
    
    return desc;
  };

  const handleCustomCronChange = (expression: string) => {
    setCustomCronExpression(expression);
    const validation = validateCronExpression(expression);
    setCronExpressionError(validation.error);
  };

  const getActiveSchedule = () => {
    if (scheduleBuilderMode === 'beginner' && !customScheduleMode) {
      return visualScheduleToCron(visualSchedule);
    }
    return customScheduleMode ? customCronExpression : selectedSchedule;
  };

  // Visual schedule builder helper functions
  const convertTimezone = (hour: number, fromTz: string, toTz: string = 'UTC'): number => {
    const offsets: Record<string, number> = {
      'EST': -5, 'PST': -8, 'CST': -6, 'MST': -7, 'UTC': 0
    };
    
    if (fromTz === toTz) return hour;
    
    const fromOffset = offsets[fromTz] || 0;
    const toOffset = offsets[toTz] || 0;
    
    let utcHour = hour - fromOffset + toOffset;
    
    // Handle overflow/underflow
    if (utcHour >= 24) utcHour -= 24;
    if (utcHour < 0) utcHour += 24;
    
    return utcHour;
  };

  const visualScheduleToCron = (schedule: typeof visualSchedule): string => {
    const { frequency, time, timezone, daysOfWeek, dayOfMonth, interval, intervalUnit } = schedule;
    
    // Convert 12-hour to 24-hour format
    let hour = time.hour;
    if (time.period === 'PM' && hour !== 12) hour += 12;
    if (time.period === 'AM' && hour === 12) hour = 0;
    
    // Convert to UTC
    const utcHour = convertTimezone(hour, timezone);
    
    const minute = time.minute;
    
    switch (frequency) {
      case 'daily':
        return `${minute} ${utcHour} * * *`;
        
      case 'weekly':
        const days = daysOfWeek.join(',');
        return `${minute} ${utcHour} * * ${days}`;
        
      case 'monthly':
        return `${minute} ${utcHour} ${dayOfMonth} * *`;
        
      case 'custom':
        switch (intervalUnit) {
          case 'minutes':
            return `*/${interval} * * * *`;
          case 'hours':
            return `${minute} */${interval} * * *`;
          case 'days':
            return `${minute} ${utcHour} */${interval} * *`;
          case 'weeks':
            return `${minute} ${utcHour} * * ${daysOfWeek[0] || 1}/${interval * 7}`;
          default:
            return `${minute} ${utcHour} * * *`;
        }
        
      default:
        return `${minute} ${utcHour} * * 1`;
    }
  };

  const cronToVisualSchedule = (cronExpression: string): typeof visualSchedule => {
    const [minute, hour, day, month, weekday] = cronExpression.split(' ');
    
    // Convert hour from UTC to EST (simplified)
    const utcHour = parseInt(hour);
    const estHour = utcHour <= 5 ? utcHour + 19 : utcHour - 5;
    const period = estHour >= 12 ? 'PM' : 'AM';
    const displayHour = estHour > 12 ? estHour - 12 : estHour === 0 ? 12 : estHour;
    
    // Determine frequency type
    let frequency: typeof visualSchedule.frequency = 'weekly';
    let daysOfWeek = [1];
    
    if (weekday === '*') {
      frequency = 'daily';
    } else if (weekday.includes(',')) {
      frequency = 'weekly';
      daysOfWeek = weekday.split(',').map(d => parseInt(d));
    } else if (weekday.includes('-')) {
      frequency = 'weekly';
      const [start, end] = weekday.split('-');
      daysOfWeek = Array.from({length: parseInt(end) - parseInt(start) + 1}, (_, i) => parseInt(start) + i);
    } else if (day !== '*') {
      frequency = 'monthly';
    }
    
    return {
      frequency,
      time: { hour: displayHour, minute: parseInt(minute), period: period as 'AM' | 'PM' },
      timezone: 'EST' as const,
      daysOfWeek,
      dayOfMonth: parseInt(day) || 1,
      interval: 1,
      intervalUnit: 'hours' as const
    };
  };

  const getScheduleDescription = (schedule: typeof visualSchedule): string => {
    const { frequency, time, timezone, daysOfWeek, dayOfMonth, interval, intervalUnit } = schedule;
    
    const timeStr = `${time.hour}:${time.minute.toString().padStart(2, '0')} ${time.period} ${timezone}`;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    switch (frequency) {
      case 'daily':
        return `Every day at ${timeStr}`;
        
      case 'weekly':
        const selectedDays = daysOfWeek.map(d => dayNames[d]).join(', ');
        return `Every ${selectedDays} at ${timeStr}`;
        
      case 'monthly':
        const dayStr = dayOfMonth === 1 ? '1st' : dayOfMonth === 2 ? '2nd' : dayOfMonth === 3 ? '3rd' : `${dayOfMonth}th`;
        return `${dayStr} day of every month at ${timeStr}`;
        
      case 'custom':
        return `Every ${interval} ${intervalUnit}`;
        
      default:
        return `Custom schedule at ${timeStr}`;
    }
  };

  const getNextScheduledPosts = (schedule: typeof visualSchedule, count: number = 4): Date[] => {
    const cronExpression = visualScheduleToCron(schedule);
    const dates: Date[] = [];
    const now = new Date();
    
    // Simple implementation - for production, use a proper cron parser
    const [minute, hour, day, month, weekday] = cronExpression.split(' ');
    
    if (schedule.frequency === 'daily') {
      for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        date.setHours(parseInt(hour), parseInt(minute), 0, 0);
        if (date > now) dates.push(date);
      }
    } else if (schedule.frequency === 'weekly') {
      let currentDate = new Date(now);
      let foundDates = 0;
      
      for (let i = 0; i < 14 && foundDates < count; i++) { // Check next 2 weeks
        currentDate.setDate(now.getDate() + i);
        if (schedule.daysOfWeek.includes(currentDate.getDay())) {
          const scheduleDate = new Date(currentDate);
          scheduleDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
          if (scheduleDate > now) {
            dates.push(scheduleDate);
            foundDates++;
          }
        }
      }
    }
    
    return dates.slice(0, count);
  };

  const updateVisualSchedule = (updates: Partial<typeof visualSchedule>) => {
    setVisualSchedule(prev => ({ ...prev, ...updates }));
  };

  const createTestPost = async () => {
    try {
      setIsGenerating(true);
      console.log('Creating unpublished blog post using generate-blog-post function...');
      
      // Supabase configuration
      const supabaseUrl = 'https://cpkslvmydfdevdftieck.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE';
      const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const functionUrl = `${baseUrl}/functions/v1/generate-blog-post`;
      
      console.log('Function URL:', functionUrl);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          autoPublish: true // Generate as published by default
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Function error:', errorText);
        throw new Error(`Function returned status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Test post creation result:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success('Unpublished blog post created successfully!');
      
      // Switch to unpublished filter to show the new post
      setPostFilter('unpublished');
      await fetchPosts();
      
    } catch (error) {
      console.error('Error creating test post:', error);
      toast.error('Failed to create blog post: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIPost = async () => {
    setIsGenerating(true);
    
    // Show informative toast about generation time
    toast.loading('Generating comprehensive AI blog post (1200+ words)... This may take 1-3 minutes.', {
      id: 'ai-generation',
      duration: 10000
    });
    
    try {
      console.log('Starting AI blog post generation...');
      
      // Supabase configuration
      const supabaseUrl = 'https://cpkslvmydfdevdftieck.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE';

      // Ensure URL doesn't have trailing slash and construct function URL properly
      const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const functionUrl = `${baseUrl}/functions/v1/generate-blog-post`;
      console.log('Function URL:', functionUrl);
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Blog generation timeout reached - this may be normal for comprehensive posts');
        controller.abort();
      }, 180000); // 3 minute timeout for comprehensive blogs with AI image generation
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          autoPublish: true, // Generate as published by default
          wordCountRequirement: '1000-2500 words mandatory',
          htmlFormatting: 'lowercase tags with no spaces required',
          noCTA: true, // Ensure no CTA boxes are included
          noWordCountInTitle: true, // Ensure no word count in title
          forceUniqueSlug: true, // Force unique slug generation
          timestamp: Date.now() // Add timestamp for uniqueness
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || `HTTP ${response.status}`;
        } catch {
          errorText = await response.text();
        }
        console.error('Edge Function error response:', errorText);
        throw new Error(`Edge Function returned status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('AI generation result:', result);

      if (result.error) {
        throw new Error(result.error);
      }

      // Dismiss loading toast
      toast.dismiss('ai-generation');
      
      if (result.skipped) {
        toast.success('Blog post generation skipped - already generated today');
      } else {
        toast.success(`AI blog post generated successfully! (${result.post?.wordCount || 'Unknown'} words)`);
      }
      
      await fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error generating AI post:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Blog generation timed out after 3 minutes. This can happen with comprehensive posts. Please try again or check the function logs.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error: Unable to connect to Supabase. Please check your internet connection and Supabase configuration.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: Please check your Supabase Edge Function configuration.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Dismiss loading toast
      toast.dismiss('ai-generation');
      
      toast.error(`Error generating AI post: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const expandBlogPost = async (postId: string, targetWordCount: number = 2000) => {
    setIsExpanding(postId);
    try {
      console.log(`Starting blog post expansion for post ${postId}...`);
      
      // Supabase configuration
      const supabaseUrl = 'https://cpkslvmydfdevdftieck.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE';

      // Ensure URL doesn't have trailing slash and construct function URL properly
      const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const functionUrl = `${baseUrl}/functions/v1/generate-comprehensive-blog`;
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Blog generation timeout reached - this may be normal for comprehensive posts');
        controller.abort();
      }, 180000); // 3 minute timeout for comprehensive blogs with AI image generation
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          postId,
          targetWordCount,
          wordCountRequirement: '1000-2500 words mandatory',
          htmlFormatting: 'lowercase tags with no spaces required',
          noCTA: true, // Ensure no CTA boxes are included
          noWordCountInTitle: true // Ensure no word count in title
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || `HTTP ${response.status}`;
        } catch {
          errorText = await response.text();
        }
        console.error('Expansion function error response:', errorText);
        throw new Error(`Failed to expand blog post: ${errorText}`);
      }

      const result = await response.json();
      console.log('Blog expansion result:', result);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(`Blog post expanded successfully! New word count: ${result.post.newWordCount}`);
      await fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error expanding blog post:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Blog generation timed out after 3 minutes. This can happen with comprehensive posts. Please try again or check the function logs.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error: Unable to connect to Supabase. Please check your internet connection and Supabase configuration.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: Please check your Supabase Edge Function configuration.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Error expanding blog post: ${errorMessage}`);
    } finally {
      setIsExpanding(null);
    }
  };

  const togglePublishStatus = async (postId: string, currentStatus: boolean) => {
    try {
      console.log(`Toggling publish status for post ${postId} from ${currentStatus} to ${!currentStatus}`);
      
      // Supabase configuration
      const supabaseUrl = 'https://cpkslvmydfdevdftieck.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE';

      // Ensure URL doesn't have trailing slash and construct function URL properly
      const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const functionUrl = `${baseUrl}/functions/v1/update-blog-post-status`;
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const requestPayload = {
        postId,
        published: !currentStatus
      };
      console.log('Sending request to update-blog-post-status:', requestPayload);
      console.log('Function URL:', functionUrl);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}` };
        }
        throw new Error(errorData.error || 'Failed to update post status');
      }

      const result = await response.json();
      console.log('Update result:', result);
      console.log('Updated post data:', result.data);
      
      if (!result.success) {
        throw new Error(result.error || 'Update failed');
      }

      toast.success(result.message || `Post ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      
      // If we just unpublished a post, switch to unpublished filter to show it
      if (currentStatus === true) { // Was published, now unpublished
        console.log('Post was unpublished, switching to unpublished filter');
        setPostFilter('unpublished');
      }
      
      await fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error updating post status:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Blog generation timed out after 3 minutes. This can happen with comprehensive posts. Please try again or check the function logs.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error: Unable to connect to Supabase. Please check your internet connection and Supabase configuration.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: Please check your Supabase Edge Function configuration.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Error updating post status: ${errorMessage}`);
    }
  };

  const openDeleteConfirmation = (post: BlogPost) => {
    setDeleteConfirmation({ isOpen: true, post });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, post: null });
  };

  const confirmDeletePost = async () => {
    if (!deleteConfirmation.post) return;

    try {
      const response = await fetch('https://cpkslvmydfdevdftieck.supabase.co/functions/v1/admin-delete-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE`
        },
        body: JSON.stringify({
          postId: deleteConfirmation.post.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Post deleted successfully');
      await fetchPosts();
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleViewPost = (postId: string) => {
    navigate(`/admin/blog/view/${postId}`);
  };

  const handleEditPost = (postId: string) => {
    navigate(`/admin/blog/edit/${postId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getWordCount = (content: string) => {
    return content.split(' ').length;
  };

  const getWordCountColor = (wordCount: number) => {
    if (wordCount < 1000) return 'text-red-600 bg-red-100';
    if (wordCount < 1500) return 'text-yellow-600 bg-yellow-100';
    if (wordCount < 2500) return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  // Calculate AI generated posts count using the ai_generated flag
  const aiGeneratedCount = posts.filter(post => post.ai_generated === true).length;

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 min-h-screen relative overflow-hidden">
        <Toaster position="top-right" />
        
        {/* Digital technological background - same as blog pages */}
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
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Blog Administration</h1>
                    <p className="text-sm sm:text-base text-blue-100">Please login to access the admin panel</p>
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
                      Login to Admin Panel
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-white/20 text-center">
                    <p className="text-xs text-blue-200">
                      Secure access to Phaeton AI blog management system
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
              <p className="text-gray-600 text-sm sm:text-base">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Blog Administration</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your blog posts and generate AI content</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={createTestPost}
                disabled={isGenerating}
                className="bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Create Unpublished Post
                  </>
                )}
              </button>
              <button
                onClick={generateAIPost}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Generating (1-3 min)...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Generate AI Post
                  </>
                )}
              </button>
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New Post
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Published</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {posts.filter(post => post.published_at).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {posts.filter(post => !post.published_at).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">AI Generated</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {aiGeneratedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Posting Controls */}
          <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Auto-Posting Controls
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Manage automated blog post generation schedule</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAutoPostingControls(!showAutoPostingControls)}
                    className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {showAutoPostingControls ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Show
                      </>
                    )}
                  </button>
                  {autoPostingLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                  ) : (
                    <>
                      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        autoPostingEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Activity className="w-3 h-3 mr-1" />
                        {autoPostingEnabled ? (cronJobs.length > 0 ? 'Active' : 'Configured') : 'Inactive'}
                      </div>
                      {autoPostingEnabled && cronJobs.length === 0 && (
                        <div className="ml-2 px-2 py-1 bg-green-50 text-green-700 text-xs rounded border">
                          ✅ Auto-posting active via external cron
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {showAutoPostingControls && (
              <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Control Panel */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Schedule Settings</h3>
                  
                  {/* Schedule Builder Mode Toggle */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Schedule Builder
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setScheduleBuilderMode('beginner');
                            setCustomScheduleMode(false);
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            scheduleBuilderMode === 'beginner' && !customScheduleMode
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          disabled={autoPostingLoading}
                        >
                          Visual Builder
                        </button>
                        <button
                          onClick={() => {
                            setScheduleBuilderMode('expert');
                            setCustomScheduleMode(false);
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            scheduleBuilderMode === 'expert' && !customScheduleMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          disabled={autoPostingLoading}
                        >
                          Presets
                        </button>
                        <button
                          onClick={() => {
                            setScheduleBuilderMode('expert');
                            setCustomScheduleMode(true);
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            customScheduleMode
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          disabled={autoPostingLoading}
                        >
                          Advanced
                        </button>
                      </div>
                    </div>

                    {/* Visual Schedule Builder */}
                    {scheduleBuilderMode === 'beginner' && !customScheduleMode ? (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-green-600" />
                          Visual Schedule Builder
                        </h4>
                        
                        {/* Frequency Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            How often should posts be generated?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['daily', 'weekly', 'monthly', 'custom'].map((freq) => (
                              <button
                                key={freq}
                                onClick={() => updateVisualSchedule({ frequency: freq as any })}
                                className={`px-3 py-2 text-sm rounded-md capitalize ${
                                  visualSchedule.frequency === freq
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                                disabled={autoPostingLoading}
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What time should posts be generated?
                          </label>
                          <div className="flex items-center space-x-2">
                            <select
                              value={visualSchedule.time.hour}
                              onChange={(e) => updateVisualSchedule({ 
                                time: { ...visualSchedule.time, hour: parseInt(e.target.value) } 
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={autoPostingLoading}
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                                <option key={hour} value={hour}>{hour}</option>
                              ))}
                            </select>
                            <span className="text-gray-500">:</span>
                            <select
                              value={visualSchedule.time.minute}
                              onChange={(e) => updateVisualSchedule({ 
                                time: { ...visualSchedule.time, minute: parseInt(e.target.value) } 
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={autoPostingLoading}
                            >
                              {[0, 15, 30, 45].map(minute => (
                                <option key={minute} value={minute}>
                                  {minute.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            <select
                              value={visualSchedule.time.period}
                              onChange={(e) => updateVisualSchedule({ 
                                time: { ...visualSchedule.time, period: e.target.value as 'AM' | 'PM' } 
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={autoPostingLoading}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>

                        {/* Timezone Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What timezone?
                          </label>
                          <select
                            value={visualSchedule.timezone}
                            onChange={(e) => updateVisualSchedule({ timezone: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled={autoPostingLoading}
                          >
                            <option value="EST">Eastern Time (EST/EDT)</option>
                            <option value="CST">Central Time (CST/CDT)</option>
                            <option value="MST">Mountain Time (MST/MDT)</option>
                            <option value="PST">Pacific Time (PST/PDT)</option>
                            <option value="UTC">UTC (Universal Time)</option>
                          </select>
                        </div>

                        {/* Days of Week Selection (for weekly) */}
                        {visualSchedule.frequency === 'weekly' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Which days of the week?
                            </label>
                            <div className="grid grid-cols-7 gap-1">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <button
                                  key={day}
                                  onClick={() => {
                                    const newDays = visualSchedule.daysOfWeek.includes(index)
                                      ? visualSchedule.daysOfWeek.filter(d => d !== index)
                                      : [...visualSchedule.daysOfWeek, index].sort();
                                    updateVisualSchedule({ daysOfWeek: newDays });
                                  }}
                                  className={`px-2 py-2 text-xs rounded ${
                                    visualSchedule.daysOfWeek.includes(index)
                                      ? 'bg-green-600 text-white'
                                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                  disabled={autoPostingLoading}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Day of Month Selection (for monthly) */}
                        {visualSchedule.frequency === 'monthly' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Which day of the month?
                            </label>
                            <select
                              value={visualSchedule.dayOfMonth}
                              onChange={(e) => updateVisualSchedule({ dayOfMonth: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={autoPostingLoading}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>
                                  {day === 1 ? '1st' : day === 2 ? '2nd' : day === 3 ? '3rd' : `${day}th`} day
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Custom Interval Selection */}
                        {visualSchedule.frequency === 'custom' && (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Custom Interval
                            </label>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Every</span>
                              <input
                                type="number"
                                min="1"
                                max="999"
                                value={visualSchedule.interval}
                                onChange={(e) => updateVisualSchedule({ interval: parseInt(e.target.value) || 1 })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={autoPostingLoading}
                              />
                              <select
                                value={visualSchedule.intervalUnit}
                                onChange={(e) => updateVisualSchedule({ intervalUnit: e.target.value as any })}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={autoPostingLoading}
                              >
                                <option value="minutes">minutes</option>
                                <option value="hours">hours</option>
                                <option value="days">days</option>
                                <option value="weeks">weeks</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Live Preview */}
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Schedule Preview
                          </h5>
                          <p className="text-sm text-green-700">
                            {getScheduleDescription(visualSchedule)}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Cron: {visualScheduleToCron(visualSchedule)}
                          </p>
                          
                          {/* Next Posts Preview */}
                          <div className="mt-3">
                            <p className="text-xs font-medium text-green-800 mb-1">Next 3 posts:</p>
                            <div className="space-y-1">
                              {getNextScheduledPosts(visualSchedule, 3).map((date, index) => (
                                <p key={index} className="text-xs text-green-600">
                                  {date.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric', 
                                    hour: 'numeric', 
                                    minute: '2-digit',
                                    timeZoneName: 'short'
                                  })}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : scheduleBuilderMode === 'expert' && !customScheduleMode ? (
                      <select
                        value={selectedSchedule}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={autoPostingLoading}
                      >
                        <option value="0 13 * * 1">Every Monday at 8:00 AM EST</option>
                        <option value="0 13 * * 2">Every Tuesday at 8:00 AM EST</option>
                        <option value="0 13 * * 3">Every Wednesday at 8:00 AM EST</option>
                        <option value="0 13 * * 4">Every Thursday at 8:00 AM EST</option>
                        <option value="0 13 * * 5">Every Friday at 8:00 AM EST</option>
                        <option value="0 9 * * 1">Every Monday at 4:00 AM EST</option>
                        <option value="0 17 * * 1">Every Monday at 12:00 PM EST</option>
                        <option value="0 13 * * *">Every day at 8:00 AM EST</option>
                        <option value="0 13 * * 1-5">Weekdays at 8:00 AM EST</option>
                        <option value="0 */6 * * *">Every 6 hours</option>
                        <option value="*/30 * * * *">Every 30 minutes (Testing Only)</option>
                      </select>
                    ) : (
                      /* Custom Cron Expression Input */
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            value={customCronExpression}
                            onChange={(e) => handleCustomCronChange(e.target.value)}
                            placeholder="0 13 * * 1"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                              cronExpressionError ? 'border-red-300' : 'border-gray-300'
                            }`}
                            disabled={autoPostingLoading}
                          />
                          {cronExpressionError && (
                            <div className="absolute right-2 top-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        
                        {/* Error Message */}
                        {cronExpressionError && (
                          <div className="mt-1 text-red-600 text-xs">
                            {cronExpressionError}
                          </div>
                        )}
                        
                        {/* Description */}
                        {customCronExpression && !cronExpressionError && (
                          <div className="mt-1 text-green-600 text-xs">
                            ✓ {validateCronExpression(customCronExpression).description}
                          </div>
                        )}
                        
                        {/* Cron Helper */}
                        <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
                          <div className="font-medium text-gray-700 mb-2">Cron Format: minute hour day month weekday</div>
                          <div className="grid grid-cols-2 gap-2 text-gray-600">
                            <div><strong>Examples:</strong></div>
                            <div></div>
                            <div>0 13 * * 1</div>
                            <div>Every Monday at 1 PM UTC</div>
                            <div>0 */6 * * *</div>
                            <div>Every 6 hours</div>
                            <div>0 13 * * 1-5</div>
                            <div>Weekdays at 1 PM UTC</div>
                            <div>*/30 * * * *</div>
                            <div>Every 30 minutes</div>
                            <div>0 13 1 * *</div>
                            <div>1st day of every month</div>
                            <div>0 13 * * 1,3,5</div>
                            <div>Mon, Wed, Fri at 1 PM UTC</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {autoPostingEnabled ? (
                      <button
                        onClick={() => manageAutoPosting('disable')}
                        disabled={autoPostingLoading}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Disable Auto-Posting
                      </button>
                    ) : (
                      <button
                        onClick={() => manageAutoPosting('enable', getActiveSchedule())}
                        disabled={autoPostingLoading || (customScheduleMode && (cronExpressionError || !customCronExpression))}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Enable Auto-Posting
                      </button>
                    )}
                    
                    <button
                      onClick={() => manageAutoPosting('test')}
                      disabled={autoPostingLoading}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Test Generation
                    </button>
                    
                    <button
                      onClick={fetchAutoPostingStatus}
                      disabled={autoPostingLoading}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </button>
                  </div>
                </div>

                {/* Status Panel */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
                  
                  {cronJobRuns.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cronJobRuns.slice(0, 5).map((run, index) => (
                        <div key={`${run.jobid}-${run.runid}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <div>
                            <span className="font-medium">{run.jobname}</span>
                            <div className="text-gray-500">
                              {new Date(run.start_time).toLocaleString()}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            run.status === 'succeeded' || run.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : run.status === 'failed' || run.status === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {run.status || 'running'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                  
                  {/* Current Schedule Display */}
                  {autoPostingEnabled && cronJobs.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-sm text-blue-800">
                        <Clock className="w-4 h-4 mr-2" />
                        <strong>Schedule:</strong>
                        <span className="ml-1">
                          {(() => {
                            const job = cronJobs.find(job => job.jobname === 'weekly-blog-generation');
                            if (job) {
                              return describeCronExpression(job.schedule);
                            }
                            return customScheduleMode && customCronExpression
                              ? describeCronExpression(customCronExpression)
                              : describeCronExpression(selectedSchedule);
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Blog Posts</h2>
                
                {/* Post Filter Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setPostFilter('all')}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        postFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All ({posts.length})
                    </button>
                    <button
                      onClick={() => setPostFilter('published')}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        postFilter === 'published'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Published ({posts.filter(post => post.published_at !== null && post.published_at !== '').length})
                    </button>
                    <button
                      onClick={() => {
                        console.log('=== UNPUBLISHED FILTER CLICKED ===');
                        console.log('Current postFilter:', postFilter);
                        console.log('Total posts:', posts.length);
                        console.log('Posts array:', posts);
                        setPostFilter('unpublished');
                        console.log('Set postFilter to: unpublished');
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        postFilter === 'unpublished'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Unpublished ({posts.filter(post => {
                        console.log(`Button count - Post: "${post.title}", published_at: ${post.published_at}`);
                        return post.published_at === null || post.published_at === '';
                      }).length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {posts.filter(post => {
              const isPublished = post.published_at !== null && post.published_at !== '';
              switch (postFilter) {
                case 'published':
                  return isPublished;
                case 'unpublished':
                  return !isPublished;
                default:
                  return true; // 'all'
              }
            }).length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-3 sm:mb-4">
                  <Edit className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {posts.length === 0 ? 'No blog posts yet' : 
                   postFilter === 'published' ? 'No published posts' :
                   postFilter === 'unpublished' ? 'No unpublished posts' :
                   'No posts found'}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                  {posts.length === 0 ? 'Get started by creating your first blog post or generating one with AI.' :
                   postFilter === 'published' ? 'All your posts are still in draft mode. Publish some posts to see them here.' :
                   postFilter === 'unpublished' ? 'All your posts have been published. Create new drafts to see them here.' :
                   'Try changing the filter to see your posts.'}
                </p>
                {posts.length === 0 && (
                  <button
                    onClick={generateAIPost}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                        Generating (1-3 min)...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Generate Your First AI Post
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Word Count
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keywords
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.filter(post => {
                      const isPublished = post.published_at !== null && post.published_at !== '';
                      const shouldShow = (() => {
                        switch (postFilter) {
                          case 'published':
                            return isPublished;
                          case 'unpublished':
                            return !isPublished;
                          default:
                            return true; // 'all'
                        }
                      })();
                      
                      console.log(`Filtering post "${post.title}": published_at=${post.published_at}, isPublished=${isPublished}, filter=${postFilter}, shouldShow=${shouldShow}`);
                      return shouldShow;
                    }).map((post) => {
                      const wordCount = getWordCount(post.content);
                      const wordCountColor = getWordCountColor(wordCount);
                      
                      return (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center">
                              {post.image_url && (
                                <img
                                  src={post.image_url}
                                  alt={post.title}
                                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-cover mr-2 sm:mr-3 md:mr-4 flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 flex items-center">
                                  {truncateText(post.title, 40)}
                                  {post.ai_generated && (
                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      <Wand2 className="w-2.5 h-2.5 mr-1" />
                                      AI
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                                  {truncateText(post.excerpt || '', 50)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published_at
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.published_at ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${wordCountColor}`}>
                              {wordCount} words
                            </span>
                            {wordCount < 1000 && (
                              <div className="mt-1">
                                <button
                                  onClick={() => expandBlogPost(post.id, 2000)}
                                  disabled={isExpanding === post.id}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                >
                                  {isExpanding === post.id ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                      Expanding...
                                    </>
                                  ) : (
                                    <>
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                      Expand to 2000+
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden md:inline">{formatDate(post.created_at)}</span>
                              <span className="md:hidden">{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-wrap gap-1">
                              {post.keywords?.slice(0, 2).map((keyword, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                >
                                  <Tag className="w-2.5 h-2.5 mr-1" />
                                  {keyword.length > 15 ? keyword.substring(0, 15) + '...' : keyword}
                                </span>
                              ))}
                              {post.keywords?.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{post.keywords.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                              <button
                                onClick={() => handleViewPost(post.id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View post"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => togglePublishStatus(post.id, !!post.published_at)}
                                className={`p-1 ${
                                  post.published_at
                                    ? 'text-yellow-600 hover:text-yellow-900'
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={post.published_at ? 'Unpublish' : 'Publish'}
                              >
                                {post.published_at ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                              </button>
                              <button
                                onClick={() => handleEditPost(post.id)}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Edit post"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(post)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete post"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && deleteConfirmation.post && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Blog Post</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete "<strong>{deleteConfirmation.post.title}</strong>"? 
                  This will permanently remove the post and all its content.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:space-x-3">
                <button
                  onClick={closeDeleteConfirmation}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePost}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogPage;