import React from 'react';
import { ClipboardItem } from '../lib/supabase';
import { Copy, Share2, Pin, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { copyToClipboard, deleteClipboardItem } from '../lib/clipboard';

interface ClipboardListProps {
  items: ClipboardItem[];
  onItemSelect: (item: ClipboardItem | null) => void;
  selectedItem: ClipboardItem | null;
  onItemsChange: (items: ClipboardItem[] | ((prev: ClipboardItem[]) => ClipboardItem[])) => void;
  isLoading: boolean;
}

export default function ClipboardList({ 
  items, 
  onItemSelect, 
  selectedItem, 
  onItemsChange,
  isLoading 
}: ClipboardListProps) {
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

  const handleNewClip = () => {
    onItemSelect(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Clipboard</h2>
          <button
            onClick={handleNewClip}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {items.length}/20 clips used (Free Plan)
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No clipboard items yet. Create your first one!
          </div>
        ) : (
          <div className="p-2">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemSelect(item)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {item.content}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      {item.pinned && <Pin className="h-3 w-3 mr-1" />}
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => handleCopy(item, e)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Share item"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item, e)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}