import React, { useState } from 'react';
import { ClipboardItem } from '../lib/supabase';
import { X, Copy, Link as LinkIcon, Clock, Lock, Eye, QrCode, Download } from 'lucide-react';
import { createShareLink } from '../lib/clipboard';
import { generateQRCode } from '../lib/ai';
import toast from 'react-hot-toast';

interface EnhancedShareModalProps {
  item: ClipboardItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedShareModal({ item, isOpen, onClose }: EnhancedShareModalProps) {
  const [expiry, setExpiry] = useState('1h');
  const [password, setPassword] = useState('');
  const [oneTime, setOneTime] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  if (!isOpen) return null;

  const expiryOptions = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '24h', label: '24 hours' },
    { value: '7d', label: '7 days' },
  ];

  const handleCreateLink = async () => {
    setIsCreating(true);
    try {
      const url = await createShareLink(item.id, expiry, password, oneTime);
      setShareUrl(url);
      toast.success('Share link created');
    } catch (error) {
      console.error('Share link error:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!shareUrl) return;
    
    setIsGeneratingQR(true);
    try {
      const qrDataUrl = await generateQRCode(shareUrl);
      setQrCodeUrl(qrDataUrl);
      toast.success('QR code generated');
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
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

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `clipboard-qr-${item.id.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="oneTime"
                  checked={oneTime}
                  onChange={(e) => setOneTime(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="oneTime" className="ml-2 text-sm text-gray-700">
                  <Eye className="h-4 w-4 inline mr-1" />
                  One-time view (link expires after first access)
                </label>
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
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleGenerateQR}
                  disabled={isGeneratingQR}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isGeneratingQR ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR
                    </>
                  )}
                </button>
                
                {qrCodeUrl && (
                  <button
                    onClick={handleDownloadQR}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>

              {qrCodeUrl && (
                <div className="text-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto border border-gray-200 rounded-lg"
                    style={{ width: '200px', height: '200px' }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Scan with your phone to open the link
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Link expires in {expiryOptions.find(o => o.value === expiry)?.label.toLowerCase()}</p>
                {password && <p>• Password protected</p>}
                {oneTime && <p>• One-time access only</p>}
                <p>• Link will be automatically deleted after expiry</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}