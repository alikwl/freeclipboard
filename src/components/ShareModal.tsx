import React, { useState } from 'react';
import { ClipboardItem } from '../lib/supabase';
import { X, Copy, Link as LinkIcon, Clock, Lock } from 'lucide-react';
import { createShareLink } from '../lib/clipboard';
import toast from 'react-hot-toast';

interface ShareModalProps {
  item: ClipboardItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ item, isOpen, onClose }: ShareModalProps) {
  const [expiry, setExpiry] = useState('1h');
  const [password, setPassword] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const expiryOptions = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '24h', label: '24 hours' },
  ];

  const handleCreateLink = async () => {
    setIsCreating(true);
    try {
      const url = await createShareLink(item.id, expiry, password);
      setShareUrl(url);
      toast.success('Share link created');
    } catch (error) {
      console.error('Share link error:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Share Clipboard Item</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!shareUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Expiry Time
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {expiryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for no password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleCreateLink}
                disabled={isCreating}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isCreating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Create Share Link
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Link expires in {expiryOptions.find(o => o.value === expiry)?.label.toLowerCase()}</p>
                {password && <p>• Password protected</p>}
                <p>• Link will be automatically deleted after expiry</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}