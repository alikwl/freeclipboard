/*
  # Add Admin Functionality

  1. Security
    - Add RLS policies for admin access
    - Create admin role checking function
  
  2. Functions
    - Function to check if user is admin
    - Function to promote/demote users
*/

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user email is admin email or has admin role
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND (
      email = 'admin@freeclipboard.com' 
      OR email LIKE '%@admin.freeclipboard.com'
      OR (raw_user_meta_data->>'role') = 'admin'
    )
  );
END;
$$;

-- Create function to promote/demote users (admin only)
CREATE OR REPLACE FUNCTION admin_update_user_plan(target_user_id uuid, new_plan text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Validate plan
  IF new_plan NOT IN ('free', 'pro') THEN
    RAISE EXCEPTION 'Invalid plan. Must be free or pro.';
  END IF;
  
  -- Update user plan
  UPDATE users 
  SET plan = new_plan::text
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;
END;
$$;

-- Add RLS policy for admin access to users table
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete all users"
  ON users
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Add RLS policy for admin access to items table
CREATE POLICY "Admins can read all items"
  ON items
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete all items"
  ON items
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));