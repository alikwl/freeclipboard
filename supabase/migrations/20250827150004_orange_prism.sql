/*
  # Fix RLS Policies for Data Isolation

  1. Security Fix
    - Ensure users can only see their own items
    - Remove admin override for regular data access
    - Keep admin access separate from user data access

  2. Changes
    - Update items policies to strictly enforce user_id matching
    - Separate admin functions from regular user data access
*/

-- Drop existing policies that might allow cross-user access
DROP POLICY IF EXISTS "Admins can read all items" ON items;
DROP POLICY IF EXISTS "Admins can delete all items" ON items;

-- Ensure users can only access their own items
DROP POLICY IF EXISTS "Users can read own items" ON items;
CREATE POLICY "Users can read own items"
  ON items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own items" ON items;
CREATE POLICY "Users can insert own items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own items" ON items;
CREATE POLICY "Users can update own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own items" ON items;
CREATE POLICY "Users can delete own items"
  ON items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin access should be through separate admin functions, not through regular item access
-- This ensures data isolation while still allowing admin management through proper channels