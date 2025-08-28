import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ClipboardItem } from '../lib/supabase';
import { getClipboardItem } from '../lib/clipboard';
import { ArrowLeft, Copy, Share2, Trash2, Edit3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ClipboardItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadItem(id);
    }
  }, [id]);

  const loadItem = async (itemId: string) => {
    try {
      const data = await getClipboardItem(itemId);
      setItem(data);
    } catch (error) {
      toast.error('Item not found');
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (item) {
      try {
        await navigator.clipboard.writeText(item.content);
        toast.success('Copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/app" className="text-blue-600 hover:underline">
            Back to clipboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clipboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Created {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-gray-800">
              {item.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}