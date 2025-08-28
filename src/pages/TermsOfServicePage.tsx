import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Scale, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  React.useEffect(() => {
    // Add schema markup for Terms of Service page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Service - FreeClipboard",
      "description": "Terms of Service for FreeClipboard advanced online clipboard tool. Understand your rights and responsibilities when using our secure clipboard management service.",
      "url": "https://freeclipboard.com/terms",
      "mainEntity": {
        "@type": "TermsOfService",
        "name": "FreeClipboard Terms of Service",
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
            "name": "Terms of Service",
            "item": "https://freeclipboard.com/terms"
          }
        ]
      }
    });
    document.head.appendChild(script);

    // Update page title and meta
    document.title = 'Terms of Service - FreeClipboard | Online Clipboard Tool Legal Terms';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms of Service for FreeClipboard advanced online clipboard tool. Understand your rights and responsibilities when using our secure clipboard management service.');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 27, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-blue-900 m-0">Agreement Overview</h2>
              </div>
              <p className="text-blue-800 m-0">
                By using FreeClipboard, you agree to these terms. Please read them carefully as they govern your use of our advanced online clipboard tool and services.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using FreeClipboard ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-yellow-900">Important Note</h4>
              </div>
              <p className="text-yellow-800 m-0">These terms apply to all users, including free and Pro subscribers. Additional terms may apply to Pro features.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p>FreeClipboard is an advanced online clipboard management tool that provides:</p>
            <ul>
              <li><strong>Clipboard History:</strong> Store and manage multiple clipboard items</li>
              <li><strong>Cross-Device Sync:</strong> Access clipboard data across all your devices</li>
              <li><strong>AI-Powered Features:</strong> Smart categorization and context-aware suggestions</li>
              <li><strong>Secure Sharing:</strong> Share clipboard items with password protection and expiry</li>
              <li><strong>End-to-End Encryption:</strong> Military-grade security for your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Account Creation</h3>
            <p>To use certain features, you must create an account by providing:</p>
            <ul>
              <li>A valid email address</li>
              <li>A secure password</li>
              <li>Acceptance of these Terms and our Privacy Policy</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Account Security</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-900 mb-2">Your Responsibilities:</h4>
              <ul className="text-red-800 space-y-1">
                <li>• Keep your password secure and confidential</li>
                <li>• Notify us immediately of any unauthorized access</li>
                <li>• You are responsible for all activities under your account</li>
                <li>• Use strong, unique passwords</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Acceptable Use Policy</h2>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">Permitted Uses</h4>
                </div>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Personal and business productivity</li>
                  <li>• Legitimate clipboard management</li>
                  <li>• Sharing non-sensitive information</li>
                  <li>• Educational and research purposes</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-900">Prohibited Uses</h4>
                </div>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Illegal or harmful content</li>
                  <li>• Malware or malicious code</li>
                  <li>• Spam or unsolicited content</li>
                  <li>• Copyright infringement</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Content Restrictions</h3>
            <p>You may not use our Service to store, share, or transmit:</p>
            <ul>
              <li>Illegal, harmful, or offensive content</li>
              <li>Copyrighted material without permission</li>
              <li>Personal information of others without consent</li>
              <li>Malware, viruses, or malicious code</li>
              <li>Content that violates any applicable laws</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subscription Plans & Billing</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Free Plan</h3>
            <p>Our free plan includes basic clipboard management features with limitations on storage and advanced features.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Pro Plan</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Pro Subscription Details:</h4>
              <ul className="text-blue-800 space-y-1">
                <li>• Monthly billing at $7/month</li>
                <li>• Automatic renewal unless cancelled</li>
                <li>• 30-day money-back guarantee</li>
                <li>• Cancel anytime without penalty</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Refunds</h3>
            <p>We offer a 30-day money-back guarantee for Pro subscriptions. Refunds are processed within 5-7 business days.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data & Privacy</h2>
            <p>Your privacy is paramount. Please review our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for detailed information about how we collect, use, and protect your data.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
              <h4 className="font-semibold text-green-900 mb-2">Key Privacy Commitments:</h4>
              <ul className="text-green-800 space-y-1">
                <li>• End-to-end encryption for all clipboard data</li>
                <li>• Zero-knowledge architecture - we cannot access your data</li>
                <li>• No selling or sharing of personal information</li>
                <li>• GDPR and CCPA compliant</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Our Rights</h3>
            <p>FreeClipboard and all related trademarks, logos, and intellectual property are owned by us. You may not use our intellectual property without written permission.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Your Content</h3>
            <p>You retain ownership of all content you store in FreeClipboard. By using our Service, you grant us a limited license to:</p>
            <ul>
              <li>Store and process your content to provide the Service</li>
              <li>Make backups for data protection</li>
              <li>Analyze usage patterns (anonymized data only)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Service Availability</h2>
            <p>We strive to maintain 99.9% uptime, but we cannot guarantee uninterrupted service. We may temporarily suspend the Service for:</p>
            <ul>
              <li>Scheduled maintenance</li>
              <li>Emergency repairs</li>
              <li>Security updates</li>
              <li>Legal compliance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <p className="text-yellow-900 font-semibold mb-2">IMPORTANT LEGAL NOTICE:</p>
              <p className="text-yellow-800">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FREECLIPBOARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 By You</h3>
            <p>You may terminate your account at any time by:</p>
            <ul>
              <li>Using the account deletion feature in your settings</li>
              <li>Contacting our support team</li>
              <li>Your data will be permanently deleted within 30 days</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 By Us</h3>
            <p>We may terminate or suspend your account if you:</p>
            <ul>
              <li>Violate these Terms of Service</li>
              <li>Engage in prohibited activities</li>
              <li>Fail to pay subscription fees</li>
              <li>Pose a security risk to our Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
            <p>We may modify these Terms from time to time. We will notify you of material changes by:</p>
            <ul>
              <li>Email notification</li>
              <li>In-app notification</li>
              <li>Website announcement</li>
            </ul>
            <p>Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-900 mb-4">For questions about these Terms of Service, please contact us:</p>
              <div className="space-y-2 text-blue-800">
                <p><strong>Email:</strong> legal@freeclipboard.com</p>
                <p><strong>Address:</strong> FreeClipboard Legal Team, 123 Tech Street, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM PST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}