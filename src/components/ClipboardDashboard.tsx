import React, { useState, useMemo } from 'react';
import { ClipboardItem } from '../lib/supabase';
import { Search, Filter, Grid, List, Plus, Pin, Copy, Share2, Trash2, Tag, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { copyToClipboard, deleteClipboardItem } from '../lib/clipboard';
import ShareModal from './ShareModal';

interface ClipboardDashboardProps {
  items: ClipboardItem[];
  onItemSelect: (item: ClipboardItem | null) => void;
  selectedItem: ClipboardItem | null;
  onItemsChange: (items: ClipboardItem[] | ((prev: ClipboardItem[]) => ClipboardItem[])) => void;
  isLoading: boolean;
}

export default function ClipboardDashboard({ 
  items, 
  onItemSelect, 
  selectedItem, 
  onItemsChange,
  isLoading 
}: ClipboardDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'pinned'>('recent');
  const [shareItem, setShareItem] = useState<ClipboardItem | null>(null);

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
      
      return matchesSearch && matchesTag;
    });

    // Sort items
    filtered.sort((a, b) => {
      if (sortBy === 'pinned') {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Default to recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return filtered;
  }, [items, searchQuery, selectedTag, sortBy]);

  const handleCopy = async (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(item.content);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteClipboardItem(item.id);
      onItemsChange(prev => prev.filter(i => i.id !== item.id));
      if (selectedItem?.id === item.id) {
        onItemSelect(null);
      }
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleShare = (item: ClipboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareItem(item);
  };

  const handleNewClip = () => {
    onItemSelect(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clipboard Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {filteredItems.length} of {items.length} items
              <span className="text-gray-400 ml-2">• {items.length}/20 used (Free Plan)</span>
            </p>
          </div>
          <button
            onClick={handleNewClip}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Clip
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
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
          
          <div className="flex gap-3">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Recent</option>
              <option value="title">Title</option>
              <option value="pinned">Pinned First</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
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
              {searchQuery || selectedTag ? 'No clips found' : 'No clips yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedTag 
                ? 'Try adjusting your search or filters'
                : 'Create your first clipboard item to get started'
              }
            </p>
            {!searchQuery && !selectedTag && (
              <button
                onClick={handleNewClip}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Clip
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemSelect(item)}
                className={`group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer ${
                  selectedItem?.id === item.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                } ${viewMode === 'list' ? 'p-4' : 'p-6'}`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {item.pinned && (
                          <Pin className="h-4 w-4 text-yellow-500 mr-2" />
                        )}
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.title || 'Untitled'}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleCopy(item, e)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleShare(item, e)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item, e)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 mb-4">
                      <p className="text-gray-600 text-sm line-clamp-4">
                        {truncateText(item.content, 120)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                        <span>{item.content.length} chars</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        {item.pinned && (
                          <Pin className="h-4 w-4 text-yellow-500 mr-2" />
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
                      <p className="text-gray-600 text-sm truncate">
                        {truncateText(item.content, 100)}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        <span className="ml-4">{item.content.length} chars</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => handleCopy(item, e)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {shareItem && (
        <ShareModal
          item={shareItem}
          isOpen={true}
          onClose={() => setShareItem(null)}
        />
      )}
    </div>
  );
}