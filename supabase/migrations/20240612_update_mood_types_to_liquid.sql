-- Create the new enum type first
CREATE TYPE mood_type_new AS ENUM ('serene', 'calm', 'neutral', 'uneasy', 'alert', 'urgent');

-- Create a temporary column with the new type
ALTER TABLE moods ADD COLUMN mood_type_new mood_type_new;

-- Update the temporary column with mapped values
UPDATE moods SET 
  mood_type_new = CASE 
    WHEN mood_type::text = 'happy' THEN 'serene'::mood_type_new
    WHEN mood_type::text = 'content' THEN 'calm'::mood_type_new
    WHEN mood_type::text = 'neutral' THEN 'neutral'::mood_type_new
    WHEN mood_type::text = 'sad' THEN 'uneasy'::mood_type_new
    WHEN mood_type::text = 'stressed' THEN 'alert'::mood_type_new
    WHEN mood_type::text = 'anxious' THEN 'urgent'::mood_type_new
    ELSE 'neutral'::mood_type_new
  END;

-- Drop the old column and rename the new one
ALTER TABLE moods DROP COLUMN mood_type;
ALTER TABLE moods RENAME COLUMN mood_type_new TO mood_type;

-- Drop the old type
DROP TYPE mood_type;

-- Rename the new type to the original name
ALTER TYPE mood_type_new RENAME TO mood_type;

-- Enable realtime for the moods table
ALTER PUBLICATION supabase_realtime ADD TABLE moods;