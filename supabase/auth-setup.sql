-- =====================================================
-- Google Authentication Setup for AI Exhibit
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Add user_id column to entries table (if not exists)
-- This links entries to authenticated users

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'entries' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.entries 
        ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON public.entries(user_id);

-- 3. Update RLS policies to allow users to manage their own entries

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON public.entries;

-- Create new policies
CREATE POLICY "Users can insert their own entries"
ON public.entries FOR INSERT
WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
);

CREATE POLICY "Users can update their own entries"
ON public.entries FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
ON public.entries FOR DELETE
USING (auth.uid() = user_id);

-- 4. Create a function to get user profile
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid uuid)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'id', id,
    'email', email,
    'full_name', raw_user_meta_data->>'full_name',
    'avatar_url', raw_user_meta_data->>'avatar_url'
  )
  FROM auth.users
  WHERE id = user_uuid;
$$;

-- 5. Create a view for user entries (entries with user info)
CREATE OR REPLACE VIEW public.user_entries AS
SELECT 
    e.*,
    u.raw_user_meta_data->>'full_name' as user_full_name,
    u.raw_user_meta_data->>'avatar_url' as user_avatar_url
FROM public.entries e
LEFT JOIN auth.users u ON e.user_id = u.id;

-- Grant access to the view
GRANT SELECT ON public.user_entries TO anon, authenticated;

-- =====================================================
-- Supabase Dashboard Setup (Manual Steps)
-- =====================================================

/*
STEP 1: Enable Google Provider
--------------------------------
1. Go to Authentication > Providers in Supabase Dashboard
2. Find "Google" and click to enable it
3. You'll need:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)

STEP 2: Set up Google Cloud Console
------------------------------------
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Go to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Application type: Web application
6. Add Authorized redirect URIs:
   - https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   - http://localhost:3000/auth/callback (for local development)
7. Copy the Client ID and Client Secret

STEP 3: Add to Supabase
------------------------
1. Paste Client ID and Client Secret in Supabase Google provider settings
2. Save changes

STEP 4: Update Environment Variables
--------------------------------------
Add these to your .env.local file (already have the first two):

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STEP 5: Test Authentication
----------------------------
1. Run npm run dev
2. Click "Sign In" in the navbar
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. You should be redirected back and see your profile

*/
