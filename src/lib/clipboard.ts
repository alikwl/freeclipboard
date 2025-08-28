import { supabase, ClipboardItem, Category, Snippet } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createCategory(category: {
  name: string;
  color?: string;
  icon?: string;
}): Promise<Category> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      id: uuidv4(),
      user_id: user.id,
      name: category.name,
      color: category.color || '#3B82F6',
      icon: category.icon || 'folder',
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

// Snippets
export async function getSnippets(itemId: string): Promise<Snippet[]> {
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('item_id', itemId)
    .order('order_index');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function saveSnippets(itemId: string, snippets: Omit<Snippet, 'id' | 'item_id' | 'created_at'>[]): Promise<Snippet[]> {
  // Delete existing snippets
  await supabase
    .from('snippets')
    .delete()
    .eq('item_id', itemId);

  // Insert new snippets
  const snippetsToInsert = snippets.map((snippet, index) => ({
    id: uuidv4(),
    item_id: itemId,
    title: snippet.title,
    content: snippet.content,
    language: snippet.language,
    order_index: index,
  }));

  const { data, error } = await supabase
    .from('snippets')
    .insert(snippetsToInsert)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getClipboardItems(): Promise<ClipboardItem[]> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      categories (
        id,
        name,
        color,
        icon
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getClipboardItem(id: string): Promise<ClipboardItem> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
}

export async function saveClipboardItem(item: {
  id?: string;
  content: string;
  title: string;
  tags?: string[];
  pinned?: boolean;
  categoryId?: string;
  isMultiSnippet?: boolean;
  snippets?: Omit<Snippet, 'id' | 'item_id' | 'created_at'>[];
}): Promise<ClipboardItem> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check if user has Pro plan for multi-snippet feature
  if (item.isMultiSnippet) {
    const { data: profile } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (!profile || profile.plan !== 'pro') {
      throw new Error('Multi-snippet feature requires Pro plan');
    }
  }

  console.log('Saving item:', { id: item.id, title: item.title, contentLength: item.content.length });

  // Check item limit for free users
  if (!item.id) {
    const { data: existingItems } = await supabase
      .from('items')
      .select('id')
      .eq('user_id', user.id);

    console.log('Existing items count:', existingItems?.length || 0);

    const { data: profile } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isFreePlan = !profile || profile.plan === 'free';
    
    if (isFreePlan && existingItems && existingItems.length >= 20) {
      throw new Error('Free plan limit reached (20 items). Upgrade to Pro for unlimited storage.');
    }
  }

  const itemData = {
    user_id: user.id,
    content: item.content,
    title: item.title,
    tags: item.tags || [],
    pinned: item.pinned || false,
    category_id: item.categoryId || null,
    is_multi_snippet: item.isMultiSnippet || false,
    updated_at: new Date().toISOString(),
  };

  if (item.id) {
    const { data, error } = await supabase
      .from('items')
      .update(itemData)
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Save snippets if multi-snippet item
    if (item.isMultiSnippet && item.snippets) {
      await saveSnippets(item.id, item.snippets);
    }

    return data;
  } else {
    const { data, error } = await supabase
      .from('items')
      .insert({
        id: uuidv4(),
        ...itemData,
        is_shared: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Save snippets if multi-snippet item
    if (item.isMultiSnippet && item.snippets) {
      await saveSnippets(data.id, item.snippets);
    }

    return data;
  }
}

export async function deleteClipboardItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

export async function createShareLink(
  itemId: string,
  expiry: string,
  password?: string,
  oneTime?: boolean
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  const expiryMinutes = {
    '15m': 15,
    '1h': 60,
    '24h': 1440,
  }[expiry] || 60;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

  const token = uuidv4();
  
  const { data, error } = await supabase
    .from('shares')
    .insert({
      id: uuidv4(),
      item_id: itemId,
      token,
      expires_at: expiresAt.toISOString(),
      password_hash: password ? btoa(password) : null,
      one_time: oneTime || false,
      views_count: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return `${window.location.origin}/share/${token}`;
}

export async function trackActivity(itemId: string, action: string, metadata?: any): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase
    .from('item_activities')
    .insert({
      item_id: itemId,
      user_id: user?.id || null,
      action,
      metadata: metadata || {},
    });
}

export async function searchItems(query: string): Promise<ClipboardItem[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .textSearch('title,content', query)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getSharedItem(token: string, password?: string): Promise<any> {
  const { data: share, error: shareError } = await supabase
    .from('shares')
    .select(`
      *,
      items:item_id (*)
    `)
    .eq('token', token)
    .single();

  if (shareError) {
    throw new Error('Share link not found');
  }

  // Check if expired
  if (new Date(share.expires_at) < new Date()) {
    throw new Error('Link expired');
  }

  // Check password if required
  if (share.password_hash && (!password || btoa(password) !== share.password_hash)) {
    throw new Error('Password required');
  }

  // Increment view count
  await supabase
    .from('shares')
    .update({ views_count: share.views_count + 1 })
    .eq('token', token);

  return share.items;
}