import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Cookie, Settings, Shield, BarChart3, Globe } from 'lucide-react';

export default function CookiePolicyPage() {
  React.useEffect(() => {
    // Add schema markup for Cookie Policy page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cookie Policy - FreeClipboard",
      "description": "Cookie Policy for FreeClipboard online clipboard tool. Learn about how we use cookies to enhance your experience with our secure clipboard management service.",
      "url": "https://freeclipboard.com/cookies",
      "mainEntity": {
        "@type": "Article",
        "headline": "FreeClipboard Cookie Policy",
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
            "name": "Cookie Policy",
            "item": "https://freeclipboard.com/cookies"
          }
        ]
      }
    });
    document.head.appendChild(script);

    // Update page title and meta
    document.title = 'Cookie Policy - FreeClipboard | Online Clipboard Tool Cookie Usage';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cookie Policy for FreeClipboard online clipboard tool. Learn about how we use cookies to enhance your experience with our secure clipboard management service.');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 27, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-xl font-semibold text-orange-900 m-0">Cookie Usage Overview</h2>
              </div>
              <p className="text-orange-800 m-0">
                FreeClipboard uses cookies and similar technologies to enhance your experience, provide security, and analyze usage patterns. This policy explains what cookies we use and how you can control them.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as your preferences and login status.</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
              <h3 className="font-semibold text-blue-900 mb-2">Types of Cookies:</h3>
              <ul className="text-blue-800 space-y-1">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period</li>
                <li><strong>First-party Cookies:</strong> Set by FreeClipboard directly</li>
                <li><strong>Third-party Cookies:</strong> Set by external services we use</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-green-900 m-0">Essential Cookies</h3>
                </div>
                <p className="text-green-800 text-sm mb-3">Required for basic functionality and security</p>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• User authentication</li>
                  <li>• Session management</li>
                  <li>• Security features</li>
                  <li>• Load balancing</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Settings className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-blue-900 m-0">Functional Cookies</h3>
                </div>
                <p className="text-blue-800 text-sm mb-3">Enhance your experience and remember preferences</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Language preferences</li>
                  <li>• Theme settings</li>
                  <li>• Layout preferences</li>
                  <li>• Feature toggles</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-purple-900 m-0">Analytics Cookies</h3>
                </div>
                <p className="text-purple-800 text-sm mb-3">Help us understand how you use our service</p>
                <ul className="text-purple-800 text-sm space-y-1">
                  <li>• Usage statistics</li>
                  <li>• Performance metrics</li>
                  <li>• Feature adoption</li>
                  <li>• Error tracking</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-yellow-600 mr-3" />
                  <h3 className="text-lg font-semibold text-yellow-900 m-0">Marketing Cookies</h3>
                </div>
                <p className="text-yellow-800 text-sm mb-3">Deliver relevant content and measure effectiveness</p>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Personalized content</li>
                  <li>• Campaign tracking</li>
                  <li>• Conversion measurement</li>
                  <li>• Retargeting</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Specific Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">auth_token</td>
                    <td className="px-4 py-3 text-sm text-gray-700">User authentication</td>
                    <td className="px-4 py-3 text-sm text-gray-700">7 days</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Essential</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">session_id</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Session management</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Session</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Essential</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">preferences</td>
                    <td className="px-4 py-3 text-sm text-gray-700">User preferences</td>
                    <td className="px-4 py-3 text-sm text-gray-700">1 year</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Functional</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">_ga</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Google Analytics</td>
                    <td className="px-4 py-3 text-sm text-gray-700">2 years</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Analytics</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">_gid</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Google Analytics</td>
                    <td className="px-4 py-3 text-sm text-gray-700">24 hours</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Cookies</h2>
            <p>We use trusted third-party services that may set their own cookies:</p>
            
            <div className="space-y-4 my-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                <p className="text-gray-700 text-sm mb-2">Helps us understand website usage and improve our service.</p>
                <p className="text-gray-600 text-xs">
                  <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Google Privacy Policy
                  </a>
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Supabase</h4>
                <p className="text-gray-700 text-sm mb-2">Our backend infrastructure provider for authentication and data storage.</p>
                <p className="text-gray-600 text-xs">
                  <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Supabase Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Managing Your Cookie Preferences</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-4">You have control over cookies:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Browser Settings</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Block all cookies</li>
                    <li>• Block third-party cookies</li>
                    <li>• Delete existing cookies</li>
                    <li>• Set cookie preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Account Settings</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Analytics opt-out</li>
                    <li>• Marketing preferences</li>
                    <li>• Functional cookie settings</li>
                    <li>• Data collection controls</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Browser-Specific Instructions</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">Chrome</h4>
                <p className="text-gray-700 text-sm">Settings → Privacy and security → Cookies and other site data</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">Firefox</h4>
                <p className="text-gray-700 text-sm">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">Safari</h4>
                <p className="text-gray-700 text-sm">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">Edge</h4>
                <p className="text-gray-700 text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Impact of Disabling Cookies</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-900 mb-2">Please Note:</h4>
              <p className="text-yellow-800 text-sm mb-3">
                Disabling certain cookies may affect your experience with FreeClipboard:
              </p>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Essential cookies: Service may not function properly</li>
                <li>• Functional cookies: Preferences won't be saved</li>
                <li>• Analytics cookies: We can't improve the service based on usage</li>
                <li>• Marketing cookies: You may see less relevant content</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a notice in our application</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-900 mb-4">If you have questions about our use of cookies, please contact us:</p>
              <div className="space-y-2 text-blue-800">
                <p><strong>Email:</strong> privacy@freeclipboard.com</p>
                <p><strong>Subject Line:</strong> Cookie Policy Inquiry</p>
                <p><strong>Address:</strong> FreeClipboard Privacy Team, 123 Tech Street, San Francisco, CA 94105</p>
                <p><strong>Response Time:</strong> We respond to all cookie-related inquiries within 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}