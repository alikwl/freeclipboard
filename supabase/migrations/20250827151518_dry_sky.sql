/*
  # Enhanced Clipboard Features

  1. Enhanced Items Table
    - Add excerpt, language, sanitized_content columns
    - Add full-text search index
    - Add template functionality

  2. Templates Table
    - User templates for reusable snippets
    - Variables support

  3. Activity Tracking
    - Track item views and actions
    - Analytics for usage patterns

  4. Enhanced Sharing
    - Better share tracking
    - QR code support
*/

-- Add new columns to items table
DO $$
BEGIN
  -- Add excerpt column for previews
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE items ADD COLUMN excerpt text;
  END IF;

  -- Add language detection
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'language'
  ) THEN
    ALTER TABLE items ADD COLUMN language text DEFAULT 'text';
  END IF;

  -- Add sanitized content
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'sanitized_content'
  ) THEN
    ALTER TABLE items ADD COLUMN sanitized_content text;
  END IF;

  -- Add template flag
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'is_template'
  ) THEN
    ALTER TABLE items ADD COLUMN is_template boolean DEFAULT false;
  END IF;

  -- Add view count
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE items ADD COLUMN view_count integer DEFAULT 0;
  END IF;
END $$;

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  variables text[] DEFAULT '{}',
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own templates"
  ON templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create activity tracking table
CREATE TABLE IF NOT EXISTS item_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL, -- 'view', 'copy', 'share', 'edit'
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE item_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities for own items"
  ON item_activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM items 
      WHERE items.id = item_activities.item_id 
      AND items.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create activities"
  ON item_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add full-text search index
CREATE INDEX IF NOT EXISTS items_search_idx 
ON items USING gin(to_tsvector('english', title || ' ' || content));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_is_template ON items(user_id, is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_items_language ON items(language);
CREATE INDEX IF NOT EXISTS idx_templates_user_category ON templates(user_id, category);
CREATE INDEX IF NOT EXISTS idx_activities_item_action ON item_activities(item_id, action);

-- Update shares table with QR support
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shares' AND column_name = 'qr_generated'
  ) THEN
    ALTER TABLE shares ADD COLUMN qr_generated boolean DEFAULT false;
  END IF;
END $$;

-- Function to auto-generate excerpt
CREATE OR REPLACE FUNCTION generate_excerpt()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate excerpt from first 150 characters
  NEW.excerpt := LEFT(REGEXP_REPLACE(NEW.content, '\s+', ' ', 'g'), 150);
  
  -- Auto-detect language (simple heuristics)
  IF NEW.content ~* '(function|const|let|var|class|import|export)' THEN
    NEW.language := 'javascript';
  ELSIF NEW.content ~* '(def|import|class|if __name__|print\()' THEN
    NEW.language := 'python';
  ELSIF NEW.content ~* '(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)' THEN
    NEW.language := 'sql';
  ELSIF NEW.content ~* '(<html|<div|<span|<p>|<script)' THEN
    NEW.language := 'html';
  ELSIF NEW.content ~* '(\{|\}|\.css|@media|:hover)' THEN
    NEW.language := 'css';
  ELSE
    NEW.language := 'text';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-excerpt
DROP TRIGGER IF EXISTS trigger_generate_excerpt ON items;
CREATE TRIGGER trigger_generate_excerpt
  BEFORE INSERT OR UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION generate_excerpt();