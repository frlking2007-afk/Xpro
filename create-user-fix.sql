-- QUICK FIX: Create user for frlking2007@gmail.com
-- Run this in Supabase Dashboard → SQL Editor

-- Method 1: Direct user creation (admin only)
INSERT INTO auth.users (
  instance_id,
  id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  app_metadata,
  user_metadata,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'frlking2007@gmail.com',
  NOW(),
  NULL,
  NULL,
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "FRL King", "username": "frlking2007"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Method 2: Create profile for the user
-- This will work after user exists
INSERT INTO public.profiles (id, username, full_name)
SELECT 
  u.id,
  'frlking2007',
  'FRL King'
FROM auth.users u 
WHERE u.email = 'frlking2007@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Check if user exists
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'frlking2007@gmail.com';

-- Check if profile exists
SELECT p.id, p.username, p.full_name, p.updated_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'frlking2007@gmail.com';

COMMIT;
