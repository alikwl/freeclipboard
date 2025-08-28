import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedItem } from '../lib/clipboard';
import { Copy, Lock, Eye, Clock, Clipboard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function SharePage() {
  const { token } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadSharedItem(token);
    }
  }, [token]);

  const loadSharedItem = async (shareToken: string, providedPassword?: string) => {
    try {
      const data = await getSharedItem(shareToken, providedPassword);
      setItem(data);
      setNeedsPassword(false);
    } catch (error: any) {
      if (error.message === 'Password required') {
        setNeedsPassword(true);
      } else if (error.message === 'Link expired') {
        setError('This share link has expired');
      } else {
        setError('Share link not found or invalid');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token && password) {
      setLoading(true);
      loadSharedItem(token, password);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <p className="text-gray-600 mb-8">
            This link may have expired or been deleted by its creator.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your Own Clipboard
          </a>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Required</h2>
            <p className="text-gray-600">This shared clipboard item is password protected.</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Access Clipboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Shared publicly
                  </span>
                  <span>
                    Created {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap text-gray-800 min-h-[200px]">
              {item.content}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 text-center">
            <div className="flex items-center justify-center mb-4">
              <Clipboard className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-900">Created with FreeClipboard</span>
            </div>
            <a
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Create Your Own Clipboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}