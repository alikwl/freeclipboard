import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Shield, Lock, Eye, Database, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  React.useEffect(() => {
    // Add schema markup for Privacy Policy page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy - FreeClipboard",
      "description": "Privacy Policy for FreeClipboard - Advanced Online Clipboard Tool. Learn how we protect your data with end-to-end encryption and zero-knowledge architecture.",
      "url": "https://freeclipboard.com/privacy",
      "mainEntity": {
        "@type": "PrivacyPolicy",
        "name": "FreeClipboard Privacy Policy",
        "dateModified": "2025-01-27",
        "publisher": {
          "@type": "Organization",
          "name": "FreeClipboard",
          "url": "https://freeclipboard.com"
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://freeclipboard.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Privacy Policy",
            "item": "https://freeclipboard.com/privacy"
          }
        ]
      }
    });
    document.head.appendChild(script);

    // Update page title and meta
    document.title = 'Privacy Policy - FreeClipboard | Secure Online Clipboard Tool';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for FreeClipboard advanced online clipboard tool. Learn how we protect your clipboard data with end-to-end encryption and zero-knowledge architecture.');
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 27, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-blue-900 m-0">Your Privacy is Our Priority</h2>
              </div>
              <p className="text-blue-800 m-0">
                FreeClipboard is built with privacy-first principles. We use end-to-end encryption and zero-knowledge architecture to ensure your clipboard data remains completely private and secure.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul>
              <li>Email address (for account creation and communication)</li>
              <li>Password (encrypted and never stored in plain text)</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Clipboard Data</h3>
            <p>Your clipboard content is:</p>
            <ul>
              <li><strong>End-to-end encrypted</strong> before leaving your device</li>
              <li><strong>Zero-knowledge</strong> - we cannot access your unencrypted data</li>
              <li><strong>Automatically deleted</strong> based on your retention settings</li>
              <li><strong>Never shared</strong> with third parties</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Usage Analytics</h3>
            <p>We collect anonymized usage data to improve our service:</p>
            <ul>
              <li>Feature usage statistics (anonymized)</li>
              <li>Performance metrics</li>
              <li>Error logs (without personal data)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">Service Provision</h4>
                </div>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Sync clipboard data across devices</li>
                  <li>• Provide AI-powered features</li>
                  <li>• Enable sharing functionality</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Eye className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Account Management</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Authentication and security</li>
                  <li>• Customer support</li>
                  <li>• Service notifications</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security & Encryption</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Security Measures:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• AES-256 encryption</li>
                    <li>• End-to-end encryption</li>
                    <li>• Zero-knowledge architecture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Infrastructure</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• SOC 2 certified data centers</li>
                    <li>• Regular security audits</li>
                    <li>• 24/7 monitoring</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Sharing & Third Parties</h2>
            <p><strong>We do not sell, rent, or share your personal data with third parties</strong> except in the following limited circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> Trusted partners who help us operate our service (all bound by strict confidentiality agreements)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (users will be notified)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention & Deletion</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Automatic Data Management:</h3>
              <ul className="text-yellow-800 space-y-1">
                <li>• Clipboard items are automatically deleted based on your settings</li>
                <li>• Account data is retained while your account is active</li>
                <li>• You can delete your account and all data at any time</li>
                <li>• Deleted data is permanently removed within 30 days</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights & Controls</h2>
            <p>You have complete control over your data:</p>
            <ul>
              <li><strong>Access:</strong> View all your stored data</li>
              <li><strong>Export:</strong> Download your data in standard formats</li>
              <li><strong>Delete:</strong> Remove specific items or your entire account</li>
              <li><strong>Modify:</strong> Update your information at any time</li>
              <li><strong>Opt-out:</strong> Disable analytics or marketing communications</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. International Data Transfers</h2>
            <p>Your data may be processed in countries other than your own. We ensure adequate protection through:</p>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Other appropriate safeguards as required by law</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p>FreeClipboard is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will delete it immediately.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
            <ul>
              <li>Email notification to your registered email address</li>
              <li>Prominent notice on our website</li>
              <li>In-app notification</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-900 mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="space-y-2 text-blue-800">
                <p><strong>Email:</strong> privacy@freeclipboard.com</p>
                <p><strong>Address:</strong> FreeClipboard Privacy Team, 123 Tech Street, San Francisco, CA 94105</p>
                <p><strong>Response Time:</strong> We respond to all privacy inquiries within 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}