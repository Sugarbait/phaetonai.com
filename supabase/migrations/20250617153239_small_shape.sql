/*
  # Reset all analytics data to zero

  This migration clears all existing analytics data to provide a fresh start
  for tracking website analytics.

  1. Data Cleanup
    - Clear all visitor records
    - Clear all page view data  
    - Clear all geolocation data
    - Clear all hourly statistics

  2. Fresh Start
    - All counters reset to zero
    - All historical data removed
    - Ready for new analytics tracking
*/

-- Clear all analytics data in the correct order (respecting any potential foreign key constraints)
DELETE FROM analytics_hourly_stats;
DELETE FROM analytics_geolocations;
DELETE FROM analytics_page_views;
DELETE FROM analytics_visitors;

-- Note: VACUUM commands removed as they cannot run inside a transaction block
-- The DELETE operations will free up the data, and PostgreSQL will handle cleanup automatically