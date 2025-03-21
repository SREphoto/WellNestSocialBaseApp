-- Add sample users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'sarah@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'alex@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'jordan@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'taylor@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'morgan@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add corresponding public users
INSERT INTO public.users (id, full_name, avatar_url, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Alex Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Jordan Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'Taylor Williams', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'Morgan Lee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add sample moods
INSERT INTO public.moods (id, user_id, mood_type, message, created_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'serene', 'Feeling at peace after my morning meditation session.', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'calm', 'Just finished a good book. Feeling relaxed.', NOW() - INTERVAL '3 hours'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'neutral', 'Regular day at work. Nothing special.', NOW() - INTERVAL '5 hours'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 'uneasy', 'Bit stressed about the upcoming deadline.', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', 'alert', 'Just got some unexpected news. Processing it.', NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'calm', 'Had a nice walk in the park. Fresh air does wonders.', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'urgent', 'Need to talk to someone. Having a difficult time.', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'serene', 'Weekend getaway was exactly what I needed.', NOW() - INTERVAL '3 days');

-- Add friend connections
INSERT INTO public.friends (user_id, friend_id, status, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'accepted', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'accepted', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'accepted', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'accepted', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'accepted', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'accepted', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'pending', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'pending', NOW() - INTERVAL '12 hours');

-- Add comments on moods
INSERT INTO public.comments (id, user_id, mood_id, content, created_at)
SELECT 
  gen_random_uuid(),
  f.friend_id,
  m.id,
  CASE 
    WHEN m.mood_type = 'serene' OR m.mood_type = 'calm' THEN 'So happy to see you doing well! 💚'
    WHEN m.mood_type = 'neutral' THEN 'Hope your day gets better! 🌻'
    WHEN m.mood_type = 'uneasy' OR m.mood_type = 'alert' THEN 'Here if you need to talk. 💙'
    WHEN m.mood_type = 'urgent' THEN 'Sending you strength. Called you - check your phone. ❤️'
  END,
  m.created_at + INTERVAL '30 minutes'
FROM public.moods m
JOIN public.friends f ON m.user_id = f.user_id
WHERE f.status = 'accepted'
LIMIT 10;