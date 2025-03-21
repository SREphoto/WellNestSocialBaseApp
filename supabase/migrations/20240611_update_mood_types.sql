-- First, create a new type for the mood types
DO $ BEGIN
    CREATE TYPE mood_type_new AS ENUM ('serene', 'calm', 'neutral', 'uneasy', 'alert', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $;

-- Create a temporary column with the new type
ALTER TABLE moods ADD COLUMN mood_type_new mood_type_new;

-- Update the temporary column based on existing values
UPDATE moods SET mood_type_new = 'serene'::mood_type_new WHERE mood_type = 'happy';
UPDATE moods SET mood_type_new = 'calm'::mood_type_new WHERE mood_type = 'content';
UPDATE moods SET mood_type_new = 'neutral'::mood_type_new WHERE mood_type = 'neutral';
UPDATE moods SET mood_type_new = 'uneasy'::mood_type_new WHERE mood_type = 'sad';
UPDATE moods SET mood_type_new = 'urgent'::mood_type_new WHERE mood_type = 'stressed';

-- Drop the old column and rename the new one
ALTER TABLE moods DROP COLUMN mood_type;
ALTER TABLE moods RENAME COLUMN mood_type_new TO mood_type;
