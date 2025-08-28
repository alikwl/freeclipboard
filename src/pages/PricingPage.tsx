import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Check, Crown, Zap } from 'lucide-react';
import ProUpgradeModal from '../components/ProUpgradeModal';

export default function PricingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const features = {
    free: [
      'Up to 20 clipboard items',
      'Basic sharing with expiry',
      'Cross-device sync',
      'Web access',
      'Basic security',
    ],
    pro: [
      'Unlimited clipboard items',
      'Advanced sharing & permissions',
      'Tags and search',
      'Pin important snippets',
      'Team boards & collaboration',
      'AI text helpers',
      'Priority support',
      'Advanced analytics',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <Clipboard className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FreeClipboard</span>
            </Link>
            <Link
              to="/app"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more power. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Perfect for personal use</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/app"
                onClick={() => setShowUpgradeModal(true)}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$7</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">For power users and teams</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Questions? <a href="mailto:support@freeclipboard.com" className="text-blue-600 hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
      <ProUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}