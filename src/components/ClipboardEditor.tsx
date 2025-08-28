import React, { useState, useEffect } from 'react';
import { ClipboardItem } from '../lib/supabase';
import { Save, Copy, Share2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveClipboardItem, copyToClipboard } from '../lib/clipboard';
import ShareModal from './ShareModal';

interface ClipboardEditorProps {
  selectedItem: ClipboardItem | null;
  onItemsChange: (items: ClipboardItem[] | ((prev: ClipboardItem[]) => ClipboardItem[])) => void;
  onItemSelect: (item: ClipboardItem | null) => void;
  onSave?: () => void;
}

export default function ClipboardEditor({ 
  selectedItem, 
  onItemsChange, 
  onItemSelect,
  onSave
}: ClipboardEditorProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isShowingShare, setIsShowingShare] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setContent(selectedItem.content);
      setTitle(selectedItem.title);
    } else {
      setContent('');
      setTitle('');
    }
  }, [selectedItem]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const savedItem = await saveClipboardItem({
        id: selectedItem?.id,
        content: content.trim(),
        title: title.trim() || 'Untitled',
      });
      
      // Update the items list
      if (selectedItem) {
        onItemsChange(prev => prev.map(item => item.id === selectedItem.id ? savedItem : item));
      } else {
        onItemsChange(prev => [savedItem, ...prev]);
      }
      
      onItemSelect(savedItem);
      toast.success('Saved successfully');
      onSave?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400 flex-1"
          />
          <div className="flex items-center space-x-2">
            {content && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {selectedItem && (
                  <button
                    onClick={() => setIsShowingShare(true)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg border border-gray-200">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
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
              placeholder="Paste or type your content here..."
              className="flex-1 p-4 border-none outline-none resize-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {selectedItem && (
        <ShareModal
          item={selectedItem}
          isOpen={isShowingShare}
          onClose={() => setIsShowingShare(false)}
        />
      )}
    </div>
  );
}