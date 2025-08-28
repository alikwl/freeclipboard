import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clipboard, Share2, Shield, Zap, Star, Check, Copy, Save, ArrowRight, Users, Clock, Globe, Smartphone, Monitor, Tablet, Brain, Search, History, Lock, FolderSync as Sync, FileText, Code, ChevronDown, ChevronUp, Play, Download, Eye, Award, TrendingUp, Layers, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../lib/clipboard';
import toast from 'react-hot-toast';
import AuthModal from '../components/AuthModal';
import ProUpgradeModal from '../components/ProUpgradeModal';
import { useAuth } from '../components/AuthProvider';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [demoText, setDemoText] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Redirect logged-in users to dashboard
  React.useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render landing page if user is logged in
  if (user) {
    return null;
  }

  const handleDemoCopy = async () => {
    if (!demoText.trim()) {
      toast.error('Please enter some text first');
      return;
    }
    
    try {
      await copyToClipboard(demoText);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDemoSave = () => {
    if (!demoText.trim()) {
      toast.error('Please enter some text first');
      return;
    }
    
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: History,
      title: 'Multi-Item Clipboard History & Search',
      description: 'Access unlimited clipboard history with powerful search capabilities. Never lose important copied content again.'
    },
    {
      icon: Sync,
      title: 'Real-Time Cloud Sync Across Devices',
      description: 'Seamlessly sync your clipboard data across Windows, macOS, iOS, Android, and web browsers in real-time.'
    },
    {
      icon: Shield,
      title: 'End-to-End Encryption & Privacy Controls',
      description: 'Military-grade encryption ensures your sensitive data remains private and secure with advanced privacy controls.'
    },
    {
      icon: Zap,
      title: 'Text Expansion & Smart Snippets',
      description: 'Create custom text snippets and shortcuts to boost productivity with intelligent text expansion features.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Clipboard Insights',
      description: 'Smart categorization, context-aware suggestions, and AI-driven clipboard management for enhanced productivity.'
    },
    {
      icon: FileText,
      title: 'Format Conversion & Multi-Paste',
      description: 'Convert between formats, paste multiple items at once, and maintain formatting across different applications.'
    }
  ];

  const benefits = [
    'Save 2+ hours daily with instant access to clipboard history',
    'Eliminate repetitive typing with smart text expansion',
    'Work seamlessly across all your devices and platforms',
    'Protect sensitive data with enterprise-grade security',
    'Boost team productivity with shared clipboard spaces',
    'Never lose important copied content again'
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Developer at TechCorp',
      content: 'This advanced clipboard manager has revolutionized my workflow. The AI features and cross-device sync are game-changers for productivity.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Content Creator & Writer',
      content: 'The clipboard history and search features are incredible. I can access any text I copied weeks ago instantly. Best productivity tool I\'ve used.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Project Manager at StartupXYZ',
      content: 'The secure clipboard sharing and team collaboration features have streamlined our entire workflow. Highly recommend for any team.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5
    }
  ];

  const platforms = [
    { name: 'Windows', icon: Monitor },
    { name: 'macOS', icon: Monitor },
    { name: 'iOS', icon: Smartphone },
    { name: 'Android', icon: Smartphone },
    { name: 'Web Browser', icon: Globe },
    { name: 'Chrome Extension', icon: Globe }
  ];

  const faqs = [
    {
      question: 'How does the advanced clipboard manager work across devices?',
      answer: 'Our clipboard tool uses secure cloud sync to instantly synchronize your clipboard history across all connected devices. Simply copy on one device and access it immediately on any other device.'
    },
    {
      question: 'Is my clipboard data secure and private?',
      answer: 'Yes, we use end-to-end encryption to protect all clipboard data. Your information is encrypted before leaving your device and can only be decrypted by you. We never have access to your unencrypted data.'
    },
    {
      question: 'What AI features are included in the clipboard manager?',
      answer: 'Our AI-powered clipboard includes smart categorization, context-aware suggestions, automatic text formatting, OCR for images, and intelligent duplicate detection to enhance your productivity.'
    },
    {
      question: 'Can I use the clipboard tool offline?',
      answer: 'Yes, the clipboard manager works offline and automatically syncs when you reconnect to the internet. Your clipboard history is always accessible, even without an internet connection.'
    },
    {
      question: 'How many clipboard items can I store?',
      answer: 'Free users can store up to 20 clipboard items, while Pro users get unlimited storage with advanced features like AI insights, team collaboration, and priority support.'
    },
    {
      question: 'Does the clipboard manager support different file formats?',
      answer: 'Yes, our advanced clipboard tool supports text, images, files, code snippets, and more. It can convert between formats and maintain formatting across different applications.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Clipboard className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FreeClipboard</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <button
                onClick={handleSignIn}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <Link
                to="/app"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Get Started Free
              </Link>
            </nav>
            <div className="md:hidden">
              <Link
                to="/app"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              Top-Rated Clipboard Manager 2025
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionize Your Copy-Paste Workflow with the 
              <span className="text-blue-600 block">Ultimate Online Clipboard Tool</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Secure, sync, and manage your clipboard history across all your devices effortlessly. 
              Boost productivity with AI-powered features and advanced clipboard management.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              Get Started Free
            </button>
            <button
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </button>
          </div>
          
          {/* Trust Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-600">Clipboard Items Synced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Try Our Advanced Clipboard Tool Now
            </h2>
            <p className="text-lg text-gray-600">
              Experience the power of our online clipboard manager with this interactive demo
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Clipboard className="h-5 w-5 mr-2 text-blue-600" />
                  Interactive Clipboard Demo
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  placeholder="Paste or type some text here to experience our advanced clipboard features..."
                  className="w-full h-32 border border-gray-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDemoCopy}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={handleDemoSave}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save & Sync Across Devices
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {demoText.length} characters
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                Want to save this and access it from any device? Experience the full power of our clipboard manager.
              </p>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Free forever • No credit card required • Instant setup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Clipboard Manager Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover powerful clipboard productivity tools designed to revolutionize how you copy, paste, and manage content across all your devices
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Secure Clipboard Manager?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your productivity with the most advanced online clipboard tool. Save time, stay organized, and work seamlessly across all your devices.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-gray-700 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="mb-6">
                  <TrendingUp className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Boost Productivity by 300%</h3>
                  <p className="text-blue-100">
                    Users report saving over 2 hours daily with our advanced clipboard features
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">2.5hrs</div>
                    <div className="text-sm text-blue-100">Daily Time Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm text-blue-100">Faster Workflows</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Our Cross-Device Clipboard Sync Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in seconds with our intuitive clipboard productivity tools. No complex setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Copy className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Copy Anywhere</h3>
              <p className="text-gray-600">
                Copy any content on any device - text, images, files, or code snippets. Our clipboard manager captures everything automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sync className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Secure Cloud Sync</h3>
              <p className="text-gray-600">
                Your clipboard data is instantly encrypted and synced to our secure cloud infrastructure with military-grade security.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Access Everywhere</h3>
              <p className="text-gray-600">
                Access and paste your clipboard items on any device, anywhere, anytime. Perfect cross-device clipboard synchronization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security & Privacy
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your clipboard data is protected with the highest security standards. We prioritize your privacy and data protection above everything else.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-gray-600">AES-256 encryption protects your data in transit and at rest</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Zero-Knowledge Architecture</h3>
              <p className="text-sm text-gray-600">We never have access to your unencrypted clipboard data</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Controls</h3>
              <p className="text-sm text-gray-600">Granular privacy settings and auto-delete policies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compliance Ready</h3>
              <p className="text-sm text-gray-600">GDPR, CCPA, and SOC 2 compliant infrastructure</p>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Security Professionals</h3>
              <p className="text-gray-600 mb-6">
                "FreeClipboard's security architecture exceeds industry standards. The zero-knowledge encryption ensures complete data privacy."
              </p>
              <div className="flex justify-center items-center space-x-8">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-green-600 mr-2" />
                  <span className="font-semibold">SOC 2 Certified</span>
                </div>
                <div className="flex items-center">
                  <Lock className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="font-semibold">ISO 27001</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-purple-600 mr-2" />
                  <span className="font-semibold">GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Spotlight */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Clipboard Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of clipboard management with artificial intelligence that understands your workflow and enhances productivity.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Categorization</h3>
                    <p className="text-gray-600">AI automatically organizes your clipboard items by type, context, and usage patterns for instant retrieval.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Context-Aware Suggestions</h3>
                    <p className="text-gray-600">Get intelligent suggestions based on your current application and workflow context.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Intelligent Search</h3>
                    <p className="text-gray-600">Find any clipboard item instantly with AI-powered semantic search that understands meaning, not just keywords.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-gray-900">AI Clipboard Assistant</h4>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-800">Smart Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-700">Based on your current document, you might want to paste your "API endpoint" from yesterday.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Layers className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Auto-Categorized</span>
                    </div>
                    <p className="text-sm text-gray-700">15 code snippets, 8 email addresses, 3 URLs automatically organized.</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Zap className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Quick Action</span>
                    </div>
                    <p className="text-sm text-gray-700">Format this JSON data and create a reusable snippet?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied users who have transformed their productivity with our clipboard manager
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration & Compatibility Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Universal Compatibility & Integration
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Works seamlessly across all platforms and integrates with your favorite applications. No matter what device or OS you use, your clipboard is always accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {platforms.map((platform, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <platform.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">{platform.name}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Developer-Friendly Features</h3>
              <p className="text-gray-600">Built for developers, by developers. Integrate our clipboard manager into your workflow.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Code className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">REST API</h4>
                <p className="text-sm text-gray-600">Full API access for custom integrations</p>
              </div>
              <div className="text-center">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Browser Extensions</h4>
                <p className="text-sm text-gray-600">Chrome, Firefox, Safari, and Edge support</p>
              </div>
              <div className="text-center">
                <Layers className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Webhooks</h4>
                <p className="text-sm text-gray-600">Real-time notifications and automation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our advanced clipboard manager
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more power. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Perfect for personal use</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Up to 20 clipboard items</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Cross-device sync</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Basic sharing features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">End-to-end encryption</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Web & mobile access</span>
                </li>
              </ul>

              <Link
                to="/app"
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$7</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">For power users and teams</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Unlimited clipboard items</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">AI-powered features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Advanced sharing & permissions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">API access & webhooks</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors">
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
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Clipboard Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who trust FreeClipboard for secure, intelligent clipboard management
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Free Today
            </button>
            <button
              onClick={handleSignIn}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Sign In
            </button>
          </div>
          <p className="text-blue-100 mt-4 text-sm">
            No credit card required • Free forever plan available • Instant setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Clipboard className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">FreeClipboard</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                The most advanced online clipboard tool for secure, intelligent copy-paste management across all your devices.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/app" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="mailto:support@freeclipboard.com" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 FreeClipboard. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      <ProUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}