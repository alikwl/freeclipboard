/*
  # Add Categories and Multi-Snippets Support

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `color` (text, hex color)
      - `icon` (text, lucide icon name)
      - `created_at` (timestamp)
    
    - `snippets`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key to items)
      - `title` (text)
      - `content` (text)
      - `language` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Schema Changes
    - Add `category_id` to items table
    - Add `is_multi_snippet` boolean to items table

  3. Security
    - Enable RLS on new tables
    - Add policies for user access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'folder',
  created_at timestamptz DEFAULT now()
);

-- Create snippets table for multi-snippet support
CREATE TABLE IF NOT EXISTS snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Snippet',
  content text NOT NULL,
  language text DEFAULT 'text',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE items ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'is_multi_snippet'
  ) THEN
    ALTER TABLE items ADD COLUMN is_multi_snippet boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can manage own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Snippets policies
CREATE POLICY "Users can manage snippets for own items"
  ON snippets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = snippets.item_id
      AND items.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = snippets.item_id
      AND items.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_item_id ON snippets(item_id);
CREATE INDEX IF NOT EXISTS idx_snippets_order ON snippets(item_id, order_index);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);

-- Insert default categories for existing users
INSERT INTO categories (user_id, name, color, icon)
SELECT 
  id as user_id,
  'General' as name,
  '#3B82F6' as color,
  'folder' as icon
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE categories.user_id = users.id
);