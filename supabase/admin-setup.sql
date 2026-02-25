-- Admin Setup for AI Exhibit
-- Run this script in Supabase SQL Editor

-- =========================================
-- ADMIN CONFIGURATION
-- =========================================

-- Option 1: Environment-based admin (recommended)
-- Set ADMIN_EMAIL in your .env.local file:
-- ADMIN_EMAIL=your-admin-email@gmail.com

-- Option 2: Database-based admin roles
-- Create an admin_users table for more flexibility

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only super_admins can view/manage admin_users
CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND role = 'super_admin'
    )
  );

-- =========================================
-- INSERT YOUR ADMIN EMAIL
-- =========================================

-- Replace with your actual admin email
INSERT INTO admin_users (email, role) 
VALUES ('your-admin-email@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- =========================================
-- ADMIN POLICIES FOR ENTRIES
-- =========================================

-- Allow admins to delete any entry
CREATE POLICY "Admins can delete any entry"
  ON entries
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Allow admins to update any entry (for featuring, etc.)
CREATE POLICY "Admins can update any entry"
  ON entries
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- =========================================
-- USEFUL ADMIN QUERIES
-- =========================================

-- View all admins
-- SELECT * FROM admin_users;

-- Add a new admin
-- INSERT INTO admin_users (email, role) VALUES ('new-admin@example.com', 'admin');

-- Remove an admin
-- DELETE FROM admin_users WHERE email = 'admin-to-remove@example.com';

-- Check if a user is admin
-- SELECT EXISTS (
--   SELECT 1 FROM admin_users 
--   WHERE email = 'user@example.com'
-- );
