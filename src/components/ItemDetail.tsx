import React, { useState, useEffect } from 'react';
import { ClipboardItem, Category, Snippet } from '../lib/supabase';
import { ArrowLeft, Copy, Share2, Pin, Trash2, Edit3, Save, X, Tag, Plus, QrCode, Eye, Clock, Link, Sparkles, Code, Layers, Folder } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { saveClipboardItem, copyToClipboard, deleteClipboardItem, trackActivity, getCategories, getSnippets } from '../lib/clipboard';
import { processWithAI } from '../lib/ai';
import CodeHighlighter from './CodeHighlighter';
import MultiSnippetEditor from './MultiSnippetEditor';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import EnhancedShareModal from './EnhancedShareModal';

interface ItemDetailProps {
  item: ClipboardItem | null;
  itemType?: 'single' | 'multi';
  onBack: () => void;
  onItemsChange: (items: ClipboardItem[] | ((prev: ClipboardItem[]) => ClipboardItem[])) => void;
  onItemSelect: (item: ClipboardItem | null) => void;
  onRefresh: () => void;
}

export default function ItemDetail({ item, itemType = 'single', onBack, onItemsChange, onItemSelect, onRefresh }: ItemDetailProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(!item);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [isMultiSnippet, setIsMultiSnippet] = useState(itemType === 'multi');
  const [snippets, setSnippets] = useState<Omit<Snippet, 'id' | 'item_id' | 'created_at'>[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadCategories();
    loadUserPlan();
    
    if (item) {
      setContent(item.content);
      setTitle(item.title);
      setTags(item.tags || []);
      setCategoryId(item.category_id || '');
      setIsMultiSnippet(item.is_multi_snippet || false);
      
      if (item.is_multi_snippet) {
        loadSnippets(item.id);
      }
    } else {
      setContent('');
      setTitle('');
      setTags([]);
      setCategoryId('');
      setIsMultiSnippet(itemType === 'multi');
      
      if (itemType === 'multi') {
        setSnippets([{
          title: 'Snippet 1',
          content: '',
          language: 'text',
          order_index: 0,
        }]);
      }
    }
  }, [item, itemType]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadUserPlan = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading user plan:', error);
        return;
      }

      setUserPlan(data?.plan || 'free');
    } catch (error) {
      console.error('Error loading user plan:', error);
    }
  };

  const loadSnippets = async (itemId: string) => {
    try {
      const data = await getSnippets(itemId);
      setSnippets(data.map(s => ({
        title: s.title,
        content: s.content,
        language: s.language,
        order_index: s.order_index,
      })));
    } catch (error) {
      console.error('Error loading snippets:', error);
    }
  };

  const handleSave = async () => {
    if (!isMultiSnippet && !content.trim()) {
      toast.error('Content cannot be empty');
      return;
    }
    
    if (isMultiSnippet && snippets.every(s => !s.content.trim())) {
      toast.error('At least one snippet must have content');
      return;
    }

    setIsSaving(true);
    try {
      const savedItem = await saveClipboardItem({
        id: item?.id,
        content: isMultiSnippet ? 'Multi-snippet item' : content.trim(),
        title: title.trim() || content.trim().split('\n')[0].substring(0, 50) || 'Untitled',
        tags,
        pinned: item?.pinned || false,
        categoryId: categoryId || undefined,
        isMultiSnippet,
        snippets: isMultiSnippet ? snippets : undefined,
      });
      
      if (item) {
        onItemsChange(prev => prev.map(i => i.id === item.id ? savedItem : i));
      } else {
        onItemsChange(prev => [savedItem, ...prev]);
      }
      
      onItemSelect(savedItem);
      setIsEditing(false);
      toast.success('Item saved successfully');
      onRefresh(); // Refresh the list to ensure consistency
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = isMultiSnippet 
        ? snippets.map(s => `${s.title}:\n${s.content}`).join('\n\n---\n\n')
        : content;
      await copyToClipboard(textToCopy);
      if (item) await trackActivity(item.id, 'copy');
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handlePin = async () => {
    if (!item) return;
    
    try {
      const updatedItem = await saveClipboardItem({
        id: item.id,
        content: item.content,
        title: item.title,
        tags: item.tags,
        pinned: !item.pinned,
      });
      
      onItemsChange(prev => prev.map(i => i.id === item.id ? updatedItem : i));
      onItemSelect(updatedItem);
      toast.success(updatedItem.pinned ? 'Item pinned' : 'Item unpinned');
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!item) return;

    try {
      await deleteClipboardItem(item.id);
      onItemsChange(prev => prev.filter(i => i.id !== item.id));
      onBack();
      toast.success('Item deleted');
      onRefresh(); // Refresh to ensure consistency
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAIProcess = async (action: 'summarize' | 'rephrase' | 'translate' | 'clean') => {
    const textToProcess = isMultiSnippet 
      ? snippets.map(s => s.content).join('\n\n')
      : content;
      
    if (!textToProcess.trim()) {
      toast.error('No content to process');
      return;
    }

    setIsProcessingAI(true);
    try {
      const result = await processWithAI(textToProcess, { action });
      
      if (isMultiSnippet) {
        // For multi-snippet, update the first snippet or create one
        if (snippets.length > 0) {
          setSnippets(prev => prev.map((s, i) => 
            i === 0 ? { ...s, content: result } : s
          ));
        }
      } else {
        setContent(result);
      }
      
      toast.success(`Text ${action}d successfully`);
      if (item) await trackActivity(item.id, 'ai_process', { action });
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} text`);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
    } catch (error) {
      toast.error('Failed to read clipboard');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? (item ? 'Edit Item' : (isMultiSnippet ? 'New Multi-Snippet' : 'New Item')) : (item?.title || 'Untitled')}
              </h1>
                {isMultiSnippet && (
                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Layers className="h-3 w-3 mr-1" />
                    Multi-Snippet
                  </span>
                )}
                {userPlan === 'pro' && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pro
                  </span>
                )}
              </div>
              {item && !isEditing && (
                <p className="text-sm text-gray-500 mt-1">
                  Created {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  {item.updated_at !== item.created_at && (
                    <span> • Updated {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}</span>
                  )}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    if (item) {
                      setContent(item.content);
                      setTitle(item.title);
                      setTags(item.tags || []);
                      setCategoryId(item.category_id || '');
                      setIsMultiSnippet(item.is_multi_snippet || false);
                      setIsEditing(false);
                    } else {
                      onBack();
                    }
                  }}
                  className="px-3 py-2 md:px-4 md:py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm md:text-base"
                >
                  <X className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || (!isMultiSnippet && !content.trim()) || (isMultiSnippet && snippets.every(s => !s.content.trim()))}
                  className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm md:text-base"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy"
                >
                  <Copy className="h-5 w-5" />
                </button>
                {item && (
                  <>
                    <button
                      onClick={handlePin}
                      className={`p-2 rounded-lg transition-colors ${
                        item.pinned 
                          ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                          : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
                      }`}
                      title={item.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    {!isMultiSnippet && (
                      <button
                        onClick={() => setShowAIOptions(!showAIOptions)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="AI Tools"
                      >
                        <Sparkles className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Options */}
      {showAIOptions && !isEditing && !isMultiSnippet && (
        <div className="border-b border-gray-200 p-3 md:p-4 bg-purple-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-1 md:gap-2">
              <button
                onClick={() => handleAIProcess('summarize')}
                disabled={isProcessingAI}
                className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Summarize
              </button>
              <button
                onClick={() => handleAIProcess('rephrase')}
                disabled={isProcessingAI}
                className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Rephrase
              </button>
              <button
                onClick={() => handleAIProcess('translate')}
                disabled={isProcessingAI}
                className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Translate
              </button>
              <button
                onClick={() => handleAIProcess('clean')}
                disabled={isProcessingAI}
                className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Clean Text
              </button>
            </div>
            {isProcessingAI && (
              <div className="mt-2 text-xs md:text-sm text-purple-600">
                Processing with AI...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {isEditing ? (
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this item..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Category Selection */}
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Folder className="h-4 w-4 inline mr-2" />
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  >
                    <option value="">No Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-Snippet Toggle for Pro Users */}
              {!item && userPlan === 'pro' && (
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isMultiSnippet}
                      onChange={(e) => {
                        setIsMultiSnippet(e.target.checked);
                        if (e.target.checked && snippets.length === 0) {
                          setSnippets([{
                            title: 'Snippet 1',
                            content: '',
                            language: 'text',
                            order_index: 0,
                          }]);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      <Layers className="h-4 w-4 inline mr-2" />
                      Multi-Snippet Item (Pro Feature)
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1 ml-7">
                    Create multiple code snippets or text blocks in one item
                  </p>
                </div>
              )}

              {/* Content Input */}
              {isMultiSnippet ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Layers className="h-4 w-4 inline mr-2" />
                    Snippets
                  </label>
                  <MultiSnippetEditor 
                    snippets={snippets}
                    onChange={setSnippets}
                    isEditing={true}
                  />
                </div>
              ) : (
              <div>
                {/* Content Input */}
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <button
                    onClick={handlePaste}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Paste from clipboard
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your content here..."
                  className="w-full h-48 md:h-64 border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm md:text-base"
                />
                <div className="text-sm text-gray-500 mt-2">
                  {content.length} characters
                </div>
              </div>
              )}

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                  <button
                    onClick={handleAddTag}
                    className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Content Display */}
              {isMultiSnippet ? (
                <MultiSnippetEditor 
                  snippets={snippets}
                  onChange={setSnippets}
                  isEditing={false}
                />
              ) : (
                <>
                {item && item.language && item.language !== 'text' ? (
                  <CodeHighlighter 
                    content={content} 
                    language={item.language}
                    showCopy={true}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                      {content}
                    </pre>
                  </div>
                )}
                </>
              )}

              {/* Metadata */}
              {item && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Category */}
                  {item.category_id && categories.find(c => c.id === item.category_id) && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Folder className="h-4 w-4 mr-2" />
                        Category
                      </h3>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: categories.find(c => c.id === item.category_id)?.color }}
                        />
                        <span className="text-gray-900">
                          {categories.find(c => c.id === item.category_id)?.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Statistics
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Views:</span>
                        <span>{item.view_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                      </div>
                      {item.updated_at !== item.created_at && (
                        <div className="flex justify-between">
                          <span>Updated:</span>
                          <span>{formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Content
                      </button>
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="w-full flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Item
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Item</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>"{item.title || 'Untitled'}"</strong>?
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-600">
                    {item.excerpt || item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '')}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && item && (
        <EnhancedShareModal
          item={item}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}