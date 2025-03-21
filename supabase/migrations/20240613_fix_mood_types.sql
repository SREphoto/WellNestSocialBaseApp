-- This migration fixes the mood types to match the new liquid drops theme

-- First convert the column to text to avoid type constraints
ALTER TABLE moods ALTER COLUMN mood_type TYPE text;

-- Update existing values to match new mood types
UPDATE moods SET 
  mood_type = CASE 
    WHEN mood_type = 'happy' THEN 'serene'
    WHEN mood_type = 'content' THEN 'calm'
    WHEN mood_type = 'neutral' THEN 'neutral'
    WHEN mood_type = 'sad' THEN 'uneasy'
    WHEN mood_type = 'stressed' THEN 'alert'
    WHEN mood_type = 'anxious' THEN 'urgent'
    ELSE 'neutral'
  END;

-- Drop the existing type if it exists
DROP TYPE IF EXISTS mood_type;

-- Create the new enum type
CREATE TYPE mood_type AS ENUM ('serene', 'calm', 'neutral', 'uneasy', 'alert', 'urgent');

-- Convert the column to use the new enum
ALTER TABLE moods ALTER COLUMN mood_type TYPE mood_type USING mood_type::mood_type;

-- Make sure realtime is enabled for the moods table
ALTER PUBLICATION supabase_realtime ADD TABLE moods;