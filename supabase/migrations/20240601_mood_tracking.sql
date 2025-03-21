-- Create mood_types enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood_type') THEN
        CREATE TYPE public.mood_type AS ENUM ('happy', 'content', 'neutral', 'sad', 'stressed');
    END IF;
END$$;

-- Create moods table
CREATE TABLE IF NOT EXISTS public.moods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id),
    mood_type mood_type NOT NULL,
    message text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone
);

-- Add RLS policies
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own moods
DROP POLICY IF EXISTS "Users can insert own moods" ON public.moods;
CREATE POLICY "Users can insert own moods"
ON public.moods FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::uuid = user_id);

-- Policy for users to update their own moods
DROP POLICY IF EXISTS "Users can update own moods" ON public.moods;
CREATE POLICY "Users can update own moods"
ON public.moods FOR UPDATE
TO authenticated
USING (auth.uid()::uuid = user_id);

-- Policy for users to view their own moods
DROP POLICY IF EXISTS "Users can view own moods" ON public.moods;
CREATE POLICY "Users can view own moods"
ON public.moods FOR SELECT
TO authenticated
USING (auth.uid()::uuid = user_id);

-- Policy for users to view moods of connections (will be updated when connections table is created)
DROP POLICY IF EXISTS "Users can view connections moods" ON public.moods;
CREATE POLICY "Users can view connections moods"
ON public.moods FOR SELECT
TO authenticated
USING (true); -- Temporarily allow all authenticated users to see all moods

-- Enable realtime for moods table
ALTER PUBLICATION supabase_realtime ADD TABLE public.moods;