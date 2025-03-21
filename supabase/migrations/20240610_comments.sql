-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_id UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for comments
alter publication supabase_realtime add table comments;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS comments_mood_id_idx ON comments(mood_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
