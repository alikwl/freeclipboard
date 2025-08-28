import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

export default function BlogPage() {
  React.useEffect(() => {
    // Add schema markup for Blog page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "FreeClipboard Blog - Clipboard Management Tips & Insights",
      "description": "Expert insights on clipboard productivity, security best practices, and advanced tips for maximizing your workflow with FreeClipboard's online clipboard tool.",
      "url": "https://freeclipboard.com/blog",
      "publisher": {
        "@type": "Organization",
        "name": "FreeClipboard",
        "url": "https://freeclipboard.com",
        "logo": "https://freeclipboard.com/logo.png"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "BlogPosting",
            "position": 1,
            "headline": "10 Advanced Clipboard Management Tips to Boost Your Productivity",
            "url": "https://freeclipboard.com/blog/advanced-clipboard-tips",
            "datePublished": "2025-01-20"
          },
          {
            "@type": "BlogPosting", 
            "position": 2,
            "headline": "The Ultimate Guide to Secure Cross-Device Clipboard Synchronization",
            "url": "https://freeclipboard.com/blog/secure-clipboard-sync-guide",
            "datePublished": "2025-01-15"
          },
          {
            "@type": "BlogPosting",
            "position": 3,
            "headline": "How AI is Revolutionizing Clipboard Management in 2025",
            "url": "https://freeclipboard.com/blog/ai-clipboard-revolution",
            "datePublished": "2025-01-10"
          }
        ]
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
            "name": "Blog",
            "item": "https://freeclipboard.com/blog"
          }
        ]
      }
    });
    document.head.appendChild(script);

    // Update page title and meta
    document.title = 'FreeClipboard Blog - Clipboard Management Tips & Productivity Insights';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Expert insights on clipboard productivity, security best practices, and advanced tips for maximizing your workflow with FreeClipboard\'s online clipboard tool.');
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const featuredPost = {
    title: "10 Advanced Clipboard Management Tips to Boost Your Productivity",
    excerpt: "Discover expert techniques for maximizing your clipboard efficiency with advanced features, keyboard shortcuts, and workflow optimizations that can save you hours every week.",
    author: "Sarah Chen",
    date: "January 20, 2025",
    readTime: "8 min read",
    category: "Productivity",
    image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    slug: "advanced-clipboard-tips"
  };

  const blogPosts = [
    {
      title: "The Ultimate Guide to Secure Cross-Device Clipboard Synchronization",
      excerpt: "Learn how to safely sync your clipboard data across all devices while maintaining enterprise-level security and privacy protection.",
      author: "Marcus Johnson",
      date: "January 15, 2025",
      readTime: "12 min read",
      category: "Security",
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      slug: "secure-clipboard-sync-guide"
    },
    {
      title: "How AI is Revolutionizing Clipboard Management in 2025",
      excerpt: "Explore the cutting-edge AI features transforming how we copy, paste, and manage content across devices with smart categorization and context-aware suggestions.",
      author: "Emily Rodriguez",
      date: "January 10, 2025",
      readTime: "6 min read",
      category: "AI & Technology",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      slug: "ai-clipboard-revolution"
    },
    {
      title: "Building a Paperless Workflow with Smart Clipboard Tools",
      excerpt: "Transform your digital workspace by leveraging advanced clipboard features for document management, note-taking, and seamless information flow.",
      author: "David Kim",
      date: "January 5, 2025",
      readTime: "10 min read",
      category: "Workflow",
      image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      slug: "paperless-workflow-guide"
    },
    {
      title: "Clipboard Security Best Practices for Remote Teams",
      excerpt: "Essential security guidelines for teams using shared clipboard tools, including encryption, access controls, and compliance considerations.",
      author: "Lisa Zhang",
      date: "December 28, 2024",
      readTime: "7 min read",
      category: "Security",
      image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      slug: "remote-team-security"
    },
    {
      title: "Integrating Clipboard Tools with Your Development Workflow",
      excerpt: "Discover how developers can leverage advanced clipboard features for code snippets, API keys, and streamlined development processes.",
      author: "Alex Chen",
      date: "December 20, 2024",
      readTime: "9 min read",
      category: "Development",
      image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      slug: "developer-clipboard-workflow"
    },
    {
      title: "The Psychology of Digital Productivity: Why Clipboard Management Matters",
      excerpt: "Understanding the cognitive load of context switching and how efficient clipboard management can improve focus and reduce mental fatigue.",
      author: "Dr. Rachel Martinez",
      date: "December 15, 2024",
      readTime: "11 min read",
      category: "Psychology",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      slug: "psychology-productivity"
    }
  ];

  const categories = [
    { name: "All", count: 7 },
    { name: "Productivity", count: 3 },
    { name: "Security", count: 2 },
    { name: "AI & Technology", count: 1 },
    { name: "Development", count: 1 }
  ];

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
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link
                to="/app"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </nav>
            <div className="md:hidden">
              <Link
                to="/app"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            FreeClipboard Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Expert insights on clipboard productivity, security best practices, and advanced tips 
            for maximizing your workflow with our online clipboard tool.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category.name === 'All' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Article</h2>
            <p className="text-gray-600">Our latest insights on clipboard management and productivity</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-4">{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <Link 
                    to={`/blog/${featuredPost.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 mr-4">{featuredPost.author}</span>
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{featuredPost.date}</span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Articles</h2>
            <p className="text-gray-600">Stay updated with the latest clipboard management insights and tips</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs ml-3 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Clipboard Productivity Tips
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest insights, tips, and feature updates delivered to your inbox
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-blue-800 text-white px-6 py-3 rounded-r-lg hover:bg-blue-900 transition-colors font-semibold">
                Subscribe
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-3">
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Clipboard className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">FreeClipboard</span>
              </div>
              <p className="text-gray-400 text-sm">
                The most advanced online clipboard tool for secure, intelligent copy-paste management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/app" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="mailto:careers@freeclipboard.com" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 FreeClipboard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}