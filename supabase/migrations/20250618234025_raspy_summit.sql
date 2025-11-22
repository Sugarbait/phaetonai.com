/*
  # Create chatbot interactions table for analytics

  1. New Tables
    - `chatbot_interactions`
      - `id` (uuid, primary key)
      - `session_id` (text) - Links to visitor session
      - `user_message` (text) - What the user asked
      - `bot_response` (text) - How the bot responded
      - `response_time_ms` (integer) - How long the response took
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `chatbot_interactions` table
    - Add policies for inserting and selecting interaction data

  3. Performance
    - Add indexes for common queries
*/

-- Create chatbot interactions table
CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  user_message text NOT NULL,
  bot_response text NOT NULL,
  response_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbot_interactions_session ON chatbot_interactions (session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_interactions_date ON chatbot_interactions (created_at);

-- Enable RLS
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (analytics data)
CREATE POLICY "Enable insert for all users" ON chatbot_interactions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON chatbot_interactions
  FOR SELECT TO public USING (true);