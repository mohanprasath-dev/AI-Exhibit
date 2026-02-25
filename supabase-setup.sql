-- ============================================
-- AI EXHIBIT - SUPABASE SETUP SCRIPT
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'audio', 'website')),
  prompt TEXT,
  tool_used TEXT,
  share_link TEXT,
  creator_name TEXT NOT NULL,
  creator_email TEXT,
  creator_avatar TEXT,
  creator_social TEXT,
  votes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  device_hash TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entry_id, device_hash)
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_entries_category ON entries(category);
CREATE INDEX IF NOT EXISTS idx_entries_votes ON entries(votes DESC);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_is_featured ON entries(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_entries_is_winner ON entries(is_winner) WHERE is_winner = true;
CREATE INDEX IF NOT EXISTS idx_votes_entry_id ON votes(entry_id);
CREATE INDEX IF NOT EXISTS idx_votes_device_hash ON votes(device_hash);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES FOR ENTRIES
-- ============================================

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Anyone can view entries" ON entries;
DROP POLICY IF EXISTS "Anyone can submit entries" ON entries;
DROP POLICY IF EXISTS "Anyone can update vote counts" ON entries;

-- Allow anyone to read entries
CREATE POLICY "Anyone can view entries" ON entries
  FOR SELECT USING (true);

-- Allow anyone to insert new entries
CREATE POLICY "Anyone can submit entries" ON entries
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update entries (for vote counts)
CREATE POLICY "Anyone can update vote counts" ON entries
  FOR UPDATE USING (true);

-- ============================================
-- 5. CREATE RLS POLICIES FOR VOTES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Anyone can vote" ON votes;

-- Allow anyone to read votes
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (true);

-- Allow anyone to insert votes
CREATE POLICY "Anyone can vote" ON votes
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 6. CREATE RLS POLICIES FOR CATEGORIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view categories" ON categories;

-- Allow anyone to read categories
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- ============================================
-- 7. CREATE STORAGE BUCKET
-- ============================================

-- Create uploads bucket (if it doesn't exist, do this manually in Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. STORAGE POLICIES
-- ============================================

-- Note: Run these only if the bucket exists
-- If you get errors, create the bucket first in Dashboard → Storage

-- Allow anyone to upload to uploads bucket
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');

-- Allow anyone to read from uploads bucket
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

-- Allow anyone to update their uploads
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
CREATE POLICY "Allow public updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads');

-- Allow anyone to delete from uploads bucket
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads');

-- ============================================
-- 9. INSERT DEFAULT CATEGORIES
-- ============================================

INSERT INTO categories (name, slug, icon, description, color) VALUES
  ('AI Art', 'ai-art', '🎨', 'AI-generated images, illustrations, and digital artwork', '#00d4ff'),
  ('AI Music', 'ai-music', '🎵', 'AI-composed music, songs, and audio creations', '#a855f7'),
  ('AI Video', 'ai-video', '🎬', 'AI-generated videos, animations, and visual effects', '#06b6d4'),
  ('AI Writing', 'ai-writing', '✍️', 'AI-generated stories, poems, and creative text', '#f59e0b'),
  ('AI Code', 'ai-code', '💻', 'AI-assisted applications, tools, and code projects', '#10b981'),
  ('AI Voice', 'ai-voice', '🎙️', 'AI-generated voice, speech, and audio narration', '#8b5cf6'),
  ('AI 3D', 'ai-3d', '🎮', 'AI-generated 3D models, scenes, and environments', '#ec4899'),
  ('Other', 'other', '✨', 'Other creative AI-generated content', '#6b7280')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- ============================================
-- 10. INSERT SAMPLE ENTRIES (OPTIONAL)
-- ============================================

-- Uncomment below to add sample entries for testing

/*
INSERT INTO entries (title, description, category, file_url, file_type, prompt, tool_used, creator_name, creator_email, votes, is_featured) VALUES
  (
    'Cosmic Dreams',
    'An ethereal journey through a neon-lit galaxy with floating crystal structures',
    'AI Art',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
    'image',
    'A vast cosmic landscape with neon purple nebulas, floating crystal structures, and a lone astronaut gazing at twin suns, hyperrealistic, 8k, cinematic lighting',
    'Midjourney v6',
    'Alex Chen',
    'alex@example.com',
    247,
    true
  ),
  (
    'Digital Forest Spirit',
    'A mystical forest guardian emerging from bioluminescent trees',
    'AI Art',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    'image',
    'Ancient forest spirit made of light and leaves, bioluminescent trees, magical atmosphere, Studio Ghibli style, detailed, 4k',
    'DALL-E 3',
    'Maya Johnson',
    'maya@example.com',
    189,
    true
  ),
  (
    'Neon City 2077',
    'A cyberpunk cityscape with flying cars and holographic billboards',
    'AI Art',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    'image',
    'Cyberpunk city at night, neon signs, flying vehicles, rain, reflections, blade runner style, ultra detailed, 8k resolution',
    'Stable Diffusion XL',
    'Jordan Park',
    'jordan@example.com',
    156,
    false
  )
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- 11. CREATE FUNCTION TO UPDATE VOTE COUNT
-- ============================================

-- Function to increment vote count atomically
CREATE OR REPLACE FUNCTION increment_vote_count(entry_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE entries
  SET votes = votes + 1,
      updated_at = now()
  WHERE id = entry_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get entry with vote status
CREATE OR REPLACE FUNCTION get_entry_with_vote_status(entry_uuid UUID, user_device_hash TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  votes INTEGER,
  has_voted BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.votes,
    EXISTS(SELECT 1 FROM votes v WHERE v.entry_id = e.id AND v.device_hash = user_device_hash) as has_voted
  FROM entries e
  WHERE e.id = entry_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Next steps:
-- 1. Make sure the 'uploads' bucket exists in Storage (create manually if needed)
-- 2. Set the bucket to PUBLIC in Storage settings
-- 3. Your app should now work!
--
-- Test by visiting: http://localhost:3000
-- ============================================
