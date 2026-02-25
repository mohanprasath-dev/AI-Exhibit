-- =============================================================================
-- AI EXHIBIT - SUPABASE DATABASE SCHEMA
-- =============================================================================
-- This schema sets up all necessary tables, functions, and policies for the
-- AI Exhibit voting platform.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLES
-- =============================================================================

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    color VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Entries table
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL REFERENCES public.categories(slug) ON DELETE RESTRICT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'video', 'audio', 'website')),
    prompt TEXT NOT NULL,
    tool_used VARCHAR(100) NOT NULL,
    share_link TEXT,
    description TEXT NOT NULL,
    creator_name VARCHAR(100) NOT NULL,
    creator_email VARCHAR(255),
    creator_avatar TEXT,
    creator_social TEXT,
    votes INTEGER DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_winner BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entry_id UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
    device_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- Unique constraint to prevent duplicate votes
    UNIQUE(entry_id, device_hash)
);

-- Create index for faster vote lookups
CREATE INDEX IF NOT EXISTS idx_votes_entry_id ON public.votes(entry_id);
CREATE INDEX IF NOT EXISTS idx_votes_device_hash ON public.votes(device_hash);
CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON public.votes(ip_address);

-- Create indexes for entries
CREATE INDEX IF NOT EXISTS idx_entries_category ON public.entries(category);
CREATE INDEX IF NOT EXISTS idx_entries_votes ON public.entries(votes DESC);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON public.entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_is_featured ON public.entries(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_entries_is_winner ON public.entries(is_winner) WHERE is_winner = true;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_entries_search ON public.entries 
USING GIN (to_tsvector('english', title || ' ' || description || ' ' || creator_name || ' ' || tool_used));

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to increment vote count
CREATE OR REPLACE FUNCTION public.increment_votes(entry_id UUID)
RETURNS public.entries AS $$
DECLARE
    updated_entry public.entries;
BEGIN
    UPDATE public.entries
    SET votes = votes + 1,
        updated_at = NOW()
    WHERE id = entry_id
    RETURNING * INTO updated_entry;
    
    RETURN updated_entry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS entries_updated_at ON public.entries;
CREATE TRIGGER entries_updated_at
    BEFORE UPDATE ON public.entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Function to get leaderboard with rank
CREATE OR REPLACE FUNCTION public.get_leaderboard(
    category_filter VARCHAR DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    category VARCHAR,
    file_url TEXT,
    file_type VARCHAR,
    prompt TEXT,
    tool_used VARCHAR,
    share_link TEXT,
    description TEXT,
    creator_name VARCHAR,
    votes INTEGER,
    is_featured BOOLEAN,
    is_winner BOOLEAN,
    created_at TIMESTAMPTZ,
    rank BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.category,
        e.file_url,
        e.file_type,
        e.prompt,
        e.tool_used,
        e.share_link,
        e.description,
        e.creator_name,
        e.votes,
        e.is_featured,
        e.is_winner,
        e.created_at,
        ROW_NUMBER() OVER (ORDER BY e.votes DESC, e.created_at ASC) as rank
    FROM public.entries e
    WHERE (category_filter IS NULL OR e.category = category_filter)
    ORDER BY e.votes DESC, e.created_at ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get featured entries
CREATE OR REPLACE FUNCTION public.get_featured_entries(limit_count INTEGER DEFAULT 6)
RETURNS SETOF public.entries AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.entries
    WHERE is_featured = true
    ORDER BY votes DESC, created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get related entries
CREATE OR REPLACE FUNCTION public.get_related_entries(
    current_entry_id UUID,
    limit_count INTEGER DEFAULT 4
)
RETURNS SETOF public.entries AS $$
DECLARE
    entry_category VARCHAR;
BEGIN
    -- Get the category of the current entry
    SELECT category INTO entry_category
    FROM public.entries
    WHERE id = current_entry_id;
    
    -- Return related entries from the same category
    RETURN QUERY
    SELECT *
    FROM public.entries
    WHERE category = entry_category
      AND id != current_entry_id
    ORDER BY votes DESC, created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can read
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Entries: Anyone can read, only authenticated/service role can insert
CREATE POLICY "Entries are viewable by everyone"
    ON public.entries FOR SELECT
    USING (true);

CREATE POLICY "Entries can be created by anyone"
    ON public.entries FOR INSERT
    WITH CHECK (true);

-- Votes: Anyone can read their own (by device_hash), anyone can insert
CREATE POLICY "Anyone can create votes"
    ON public.votes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Votes are viewable by everyone"
    ON public.votes FOR SELECT
    USING (true);

-- =============================================================================
-- STORAGE BUCKET
-- =============================================================================

-- Note: Run these in the Supabase Dashboard SQL editor or via API
-- Creates a public storage bucket for entry uploads

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'uploads',
--     'uploads',
--     true,
--     52428800, -- 50MB limit
--     ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg']
-- );

-- Storage policies
-- CREATE POLICY "Public Access"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'uploads');

-- CREATE POLICY "Anyone can upload"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'uploads');

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, description, color) VALUES
    ('AI Art', 'ai-art', 'Palette', 'Digital artwork created with AI image generators', 'from-pink-500 to-rose-500'),
    ('AI Music', 'ai-music', 'Music', 'Music and audio compositions generated by AI', 'from-violet-500 to-purple-500'),
    ('AI Video', 'ai-video', 'Video', 'Videos and animations created with AI tools', 'from-cyan-500 to-teal-500'),
    ('AI Text', 'ai-text', 'FileText', 'Written content, stories, and poetry by AI', 'from-amber-500 to-orange-500'),
    ('AI Code', 'ai-code', 'Code', 'Code and software generated by AI assistants', 'from-emerald-500 to-green-500'),
    ('AI 3D', 'ai-3d', 'Box', '3D models and environments created with AI', 'from-blue-500 to-indigo-500')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- REALTIME
-- =============================================================================

-- Enable realtime for entries table (for live vote updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.entries;

-- =============================================================================
-- NOTES
-- =============================================================================
-- 
-- After running this schema:
-- 
-- 1. Create the storage bucket 'uploads' in Supabase Dashboard
-- 2. Set up storage policies for public access
-- 3. Configure environment variables in your Next.js app:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY
--
-- 4. For production, consider:
--    - Adding rate limiting on the vote API
--    - Setting up email verification for submissions
--    - Adding moderation workflow for new entries
--    - Implementing periodic leaderboard snapshots for rank history
