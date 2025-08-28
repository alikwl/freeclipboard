import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate Supabase URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.includes('supabase.co') || url.includes('localhost');
  } catch {
    return false;
  }
};

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseKey || !isValidUrl(supabaseUrl)) {
  console.warn('⚠️  Supabase not configured properly');
  console.warn('Please update your .env file with your actual Supabase credentials:');
  console.warn('VITE_SUPABASE_URL=https://gioaqijhtbccukvxonvo.supabase.co');
  console.warn('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.warn('');
  console.warn('You can find these values in your Supabase project Dashboard > Settings > API');
  console.warn('Create a new Supabase project at https://supabase.com if you haven\'t already');
  console.warn('');
  console.warn('Current values:');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl);
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');
}

// Use valid fallback URL to prevent client initialization errors
const clientUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = supabaseKey || 'placeholder-key';

export const supabase = createClient(
  clientUrl,
  clientKey
);

export interface ClipboardItem {
  id: string;
  user_id: string;
  content: string;
  title: string;
  tags: string[];
  pinned: boolean;
  is_shared: boolean;
  is_multi_snippet: boolean;
  category_id?: string;
  created_at: string;
  updated_at: string;
  excerpt?: string;
  language?: string;
  sanitized_content?: string;
  is_template: boolean;
  view_count: number;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Snippet {
  id: string;
  item_id: string;
  title: string;
  content: string;
  language: string;
  order_index: number;
  created_at: string;
}

export interface Share {
  id: string;
  item_id: string;
  token: string;
  expires_at: string;
  password_hash?: string;
  one_time: boolean;
  views_count: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: 'free' | 'pro';
  created_at: string;
}