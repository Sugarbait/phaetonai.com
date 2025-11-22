/*
  # Fix analytics_visitors table unique constraint

  1. Data Cleanup
    - Remove duplicate records with same session_id and date_visited
    - Keep only the earliest record for each session_id/date_visited combination

  2. Schema Changes
    - Add unique constraint on (session_id, date_visited) combination
    - This enables proper upsert operations for analytics tracking

  3. Performance
    - Maintain existing indexes
    - Ensure analytics operations work efficiently
*/

-- First, remove duplicate records keeping only the earliest one for each session_id/date_visited combination
DELETE FROM analytics_visitors 
WHERE id NOT IN (
  SELECT DISTINCT ON (session_id, date_visited) id
  FROM analytics_visitors
  ORDER BY session_id, date_visited, created_at ASC
);

-- Now add the unique constraint
ALTER TABLE analytics_visitors 
ADD CONSTRAINT analytics_visitors_session_date_unique 
UNIQUE (session_id, date_visited);