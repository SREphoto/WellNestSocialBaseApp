-- Add policy to allow service role to insert into users table
DO $$
BEGIN
    -- Check if the policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Service role can insert users'
    ) THEN
        -- Create policy to allow service role to insert users
        CREATE POLICY "Service role can insert users" ON public.users
            FOR INSERT WITH CHECK (true);
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Users can update own data'
    ) THEN
        -- Create policy to allow users to update their own data
        CREATE POLICY "Users can update own data" ON public.users
            FOR UPDATE USING (auth.uid()::text = user_id);
    END IF;
END
$$;
