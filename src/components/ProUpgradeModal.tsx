import React, { useState } from 'react';
import { X, Crown, Send, MessageCircle, Mail, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendRequest = async () => {
    setIsLoading(true);
    
    // Simulate sending request (you can integrate with your backend here)
    setTimeout(() => {
      setRequestSent(true);
      setIsLoading(false);
      toast.success('Upgrade request sent to admin!');
    }, 1000);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      "Hi Haider! I would like to upgrade my FreeClipboard account to Pro plan. Please help me with the upgrade process."
    );
    window.open(`https://wa.me/923325500752?text=${message}`, '_blank');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent('FreeClipboard Pro Upgrade Request');
    const body = encodeURIComponent(
      'Hi Haider,\n\nI would like to upgrade my FreeClipboard account to Pro plan. Please help me with the upgrade process.\n\nThank you!'
    );
    window.open(`mailto:ali.kwl@live.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Upgrade to Pro</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!requestSent ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Unlock Pro Features?
                </h4>
                <p className="text-gray-600">
                  Get unlimited clipboard items, AI-powered features, advanced sharing, and priority support.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Pro Features Include:</h5>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Unlimited clipboard items</li>
                  <li>• AI text helpers (summarize, rephrase, translate)</li>
                  <li>• Multi-snippet support</li>
                  <li>• Advanced sharing with QR codes</li>
                  <li>• Priority customer support</li>
                  <li>• Team collaboration features</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-700 mb-4">
                  To upgrade your account to Pro, please send a request to our admin. 
                  You'll get a response within 24 hours.
                </p>
                <button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center font-semibold"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Upgrade Request
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Request Sent Successfully!
                </h4>
                <p className="text-gray-600">
                  Your Pro upgrade request has been sent to our admin. He may be busy, so you can also contact him directly for faster processing.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Contact Admin Directly</h5>
                    <p className="text-sm text-gray-600">For faster processing of your upgrade request</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Haider Ali</p>
                        <p className="text-sm text-gray-600">Admin & Support</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm opacity-90">+92 332 5500752</div>
                    </div>
                  </button>

                  <button
                    onClick={handleEmailContact}
                    className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Email</div>
                      <div className="text-sm opacity-90">ali.kwl@live.com</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}