/*
  # Clear newsletter subscriptions

  This migration safely removes all existing newsletter subscription data while preserving the table structure
  and security policies.
*/

-- Delete all existing records from newsletter_subscriptions
DELETE FROM newsletter_subscriptions;