import React, { useState, useMemo } from 'react';
import { ClipboardItem, Category } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import { Search, Filter, Plus, Pin, Copy, Share2, Trash2, Tag, Clock, MoreHorizontal, Zap, Code, Eye, Layers, Grid, List } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { copyToClipboard, deleteClipboardItem, saveClipboardItem, trackActivity, getCategories } from '../lib/clipboard';
import EnhancedShareModal from './EnhancedShareModal';
import QuickPasteBox from './QuickPasteBox';
import CodeHighlighter from './CodeHighlighter';
import CategoryManager from './CategoryManager';

interface ClipboardBoardProps {
  items: ClipboardItem[];
  onItemSelect: (item: ClipboardItem | null) => void;
  onItemsChange: (items: ClipboardItem[] | ((prev: ClipboardItem[]) => ClipboardItem[])) => void;
  isLoading: boolean;
  onNewItem: (type: 'single' | 'multi') => void;
  onRefresh: () => void;
}

export default function ClipboardBoard({ 
  items, 
  onItemSelect, 
  onItemsChange,
  isLoading,
  onNewItem,
  onRefresh
}: ClipboardBoardProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'shared' | 'multi'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shareItem, setShareItem] = useState<ClipboardItem | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [planLoading, setPlanLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteItem, setDeleteItem] = useState<ClipboardItem | null>(null);

  React.useEffect(() => {
    if (user) {
      loadUserPlan();
    }
  }, [user]);

  const loadUserPlan = async () => {
    if (!user) {
      setPlanLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.warn('User plan not found, defaulting to free plan:', error.message);
        setUserPlan('free');
        return;
      }

      setUserPlan(data?.plan || 'free');
    } catch (error) {
      console.warn('Failed to load user plan, defaulting to free:', error);
      setUserPlan('free');
    } finally {
      setPlanLoading(false);
    }
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || item.tags?.includes(selectedTag);
      
      const matchesCategory = !selectedCategory || 
        (selectedCategory === '' ? true : item.category_id === selectedCategory);
      
      const matchesFilter = filter === 'all' || 
        (filter === 'pinned' && item.pinned) ||
        (filter === 'shared' && item.is_shared) ||
        (filter === 'multi' && item.is_multi_snippet);
      
      return matchesSearch && matchesTag && matchesCategory && matchesFilter;
    });

    // Sort by pinned first, then by creation date
    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return filtered;
  }, [items, searchQuery, selectedTag, filter]);

  const handleCopy = async (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(item.content);
      await trackActivity(item.id, 'copy');
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteItem(item);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await deleteClipboardItem(deleteItem.id);
      onItemsChange(prev => prev.filter(i => i.id !== deleteItem.id));
      toast.success('Item deleted');
      onRefresh(); // Refresh the list to ensure consistency
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setDeleteItem(null);
    }
  };

  const handleShare = (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    trackActivity(item.id, 'share');
    setShareItem(item);
  };

  const handlePin = async (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedItem = await saveClipboardItem({
        id: item.id,
        content: item.content,
        title: item.title,
        tags: item.tags,
        pinned: !item.pinned,
      });
      
      onItemsChange(prev => prev.map(i => i.id === item.id ? updatedItem : i));
      toast.success(updatedItem.pinned ? 'Item pinned' : 'Item unpinned');
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleItemSaved = (item: ClipboardItem) => {
    onItemsChange(prev => [item, ...prev]);
    onRefresh(); // Refresh to ensure consistency
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Categories Sidebar */}
      {showCategories && (
        <div className="w-64 flex-shrink-0">
          <CategoryManager 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onCategoriesChange={() => {
              // Refresh items when categories change
              window.location.reload();
            }}
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="mr-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle Categories"
              >
                <Layers className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Clipboard Board</h1>
            </div>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {filteredItems.length} of {items.length} items
              <span className="text-gray-400 ml-2">
                • {items.length}/{userPlan === 'pro' ? '∞' : '20'} used ({userPlan === 'pro' ? 'Pro' : 'Free'} Plan)
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {userPlan === 'pro' && (
              <button
                onClick={() => onNewItem('multi')}
                className="bg-purple-600 text-white px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg hover:bg-purple-700 transition-colors flex items-center font-medium"
              >
                <Layers className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Multi-Snippet</span>
                <span className="sm:hidden">Multi</span>
              </button>
            )}
            <button
              onClick={() => onNewItem('single')}
              className="bg-blue-600 text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">New Item</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Quick Paste Box */}
        <QuickPasteBox onItemSaved={handleItemSaved} />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clips by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Filter Buttons */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden text-xs sm:text-sm">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-2 sm:px-3 font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pinned')}
                className={`px-2 py-2 sm:px-3 font-medium border-l border-gray-300 ${
                  filter === 'pinned' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center`}
              >
                <Pin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Pinned</span>
              </button>
              <button
                onClick={() => setFilter('shared')}
                className={`px-2 py-2 sm:px-3 font-medium border-l border-gray-300 ${
                  filter === 'shared' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center`}
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Shared</span>
              </button>
              {userPlan === 'pro' && (
                <button
                  onClick={() => setFilter('multi')}
                  className={`px-2 py-2 sm:px-3 font-medium border-l border-gray-300 ${
                    filter === 'multi' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } transition-colors flex items-center`}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Multi</span>
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } transition-colors`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border-l border-gray-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } transition-colors`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tag Chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </button>
            ))}
            {allTags.length > 8 && (
              <span className="text-sm text-gray-500 px-3 py-1">+{allTags.length - 8} more</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || selectedTag || filter !== 'all' ? 'No clips found' : 'No clips yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedTag || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first clipboard item to get started'
              }
            </p>
            {!searchQuery && !selectedTag && filter === 'all' && (
              <button
                onClick={onNewItem}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Item
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
              : 'space-y-4'
          }>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemSelect(item)}
                className={`group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'p-4 md:p-6' 
                    : 'p-4 flex items-center space-x-4'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1 min-w-0">
                      {item.pinned && (
                        <Pin className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                      )}
                      {item.is_multi_snippet && (
                        <Layers className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      )}
                      {item.language && item.language !== 'text' && (
                        <Code className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                      )}
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.title || 'Untitled'}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={(e) => handleCopy(item, e)}
                        className="p-1 md:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <button
                        onClick={(e) => handlePin(item, e)}
                        className={`p-1 md:p-1.5 rounded transition-colors ${
                          item.pinned 
                            ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                        title={item.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="p-1 md:p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item, e)}
                        className="p-1 md:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 mb-4">
                    {item.is_multi_snippet ? (
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center mb-2">
                          <Layers className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium">Multi-Snippet Item</span>
                        </div>
                        <p className="text-gray-500">
                          Contains multiple code snippets and text blocks
                        </p>
                      </div>
                    ) : item.language && item.language !== 'text' ? (
                      <div className="text-sm">
                        <CodeHighlighter 
                          content={truncateText(item.content, 120)} 
                          language={item.language}
                          showCopy={false}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm line-clamp-4">
                        {item.excerpt || truncateText(item.content, 120)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                        <span className="sm:hidden">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true }).replace(' ago', '')}
                        </span>
                      </span>
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <span className="hidden sm:inline">{item.content.length} chars</span>
                        <span className="sm:hidden">{item.content.length}c</span>
                        {item.view_count > 0 && (
                          <span className="flex items-center text-gray-400">
                            <Eye className="h-3 w-3 mr-1" />
                            {item.view_count}
                          </span>
                        )}
                        {item.is_shared && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <span className="hidden sm:inline">Shared</span>
                            <span className="sm:hidden">S</span>
                          </span>
                        )}
                        {item.is_multi_snippet && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Layers className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Multi</span>
                            <span className="sm:hidden">M</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                ) : (
                  // List View
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        {item.pinned && (
                          <Pin className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                        )}
                        {item.is_multi_snippet && (
                          <Layers className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                        )}
                        {item.language && item.language !== 'text' && (
                          <Code className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.title || 'Untitled'}
                        </h3>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-1 ml-3">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm truncate mb-2">
                        {item.excerpt || truncateText(item.content, 100)}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        <span className="ml-4">{item.content.length} chars</span>
                        {item.view_count > 0 && (
                          <span className="flex items-center text-gray-400 ml-4">
                            <Eye className="h-3 w-3 mr-1" />
                            {item.view_count}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={(e) => handleCopy(item, e)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handlePin(item, e)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.pinned 
                            ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                        title={item.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
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
                  Are you sure you want to delete <strong>"{deleteItem.title || 'Untitled'}"</strong>?
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 truncate">
                    {deleteItem.excerpt || truncateText(deleteItem.content, 100)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteItem(null)}
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
      {shareItem && (
        <EnhancedShareModal
          item={shareItem}
          isOpen={true}
          onClose={() => setShareItem(null)}
        />
      )}
    </div>
  );
}