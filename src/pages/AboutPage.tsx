import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Users, Target, Award, Shield, Zap, Heart, Globe, Code, Lightbulb, Coffee, Rocket } from 'lucide-react';

export default function AboutPage() {
  React.useEffect(() => {
    // Add schema markup for About page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About FreeClipboard - Advanced Online Clipboard Tool",
      "description": "Learn about FreeClipboard's mission to revolutionize clipboard management with secure, AI-powered cross-device synchronization. Meet our team and discover our story.",
      "url": "https://freeclipboard.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "FreeClipboard",
        "url": "https://freeclipboard.com",
        "logo": "https://freeclipboard.com/logo.png",
        "description": "Advanced online clipboard tool with AI-powered features and secure cross-device synchronization",
        "foundingDate": "2024",
        "founder": [
          {
            "@type": "Person",
            "name": "Alex Chen",
            "jobTitle": "CEO & Co-Founder"
          },
          {
            "@type": "Person", 
            "name": "Sarah Rodriguez",
            "jobTitle": "CTO & Co-Founder"
          }
        ],
        "employee": [
          {
            "@type": "Person",
            "name": "Marcus Johnson",
            "jobTitle": "Lead AI Engineer"
          },
          {
            "@type": "Person",
            "name": "Emily Zhang",
            "jobTitle": "Head of Security"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Tech Street",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "postalCode": "94105",
          "addressCountry": "US"
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
            "name": "About",
            "item": "https://freeclipboard.com/about"
          }
        ]
      }
    });
    document.head.appendChild(script);

    // Update page title and meta
    document.title = 'About FreeClipboard - Advanced Online Clipboard Tool | Our Story & Mission';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about FreeClipboard\'s mission to revolutionize clipboard management with secure, AI-powered cross-device synchronization. Meet our team and discover our story.');
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Google PM with 8+ years in productivity tools. Passionate about making technology more accessible and efficient.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      linkedin: '#'
    },
    {
      name: 'Sarah Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Microsoft engineer specializing in distributed systems and security. PhD in Computer Science from Stanford.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      linkedin: '#'
    },
    {
      name: 'Marcus Johnson',
      role: 'Lead AI Engineer',
      bio: 'AI/ML expert with experience at OpenAI and DeepMind. Focused on making AI practical and user-friendly.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      linkedin: '#'
    },
    {
      name: 'Emily Zhang',
      role: 'Head of Security',
      bio: 'Cybersecurity specialist with 10+ years protecting user data. Former security architect at Apple.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      linkedin: '#'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data belongs to you. We use zero-knowledge encryption to ensure complete privacy and security.'
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description: 'Powerful features shouldn\'t be complicated. We design for intuitive, effortless user experiences.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Great tools should be available to everyone, everywhere. We build for global accessibility and inclusion.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly push boundaries with AI and cutting-edge technology to solve real productivity challenges.'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'FreeClipboard Founded',
      description: 'Started with a simple idea: make clipboard management effortless and secure across all devices.'
    },
    {
      year: '2024',
      title: 'Beta Launch',
      description: 'Released our first beta version to 1,000 early adopters who provided invaluable feedback.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered features including smart categorization and context-aware suggestions.'
    },
    {
      year: '2025',
      title: '50K+ Users',
      description: 'Reached 50,000+ active users worldwide with 99.9% uptime and enterprise-grade security.'
    }
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
            <div className="flex items-center space-x-4">
              <Link
                to="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Clipboard Management
            <span className="text-blue-600 block">One Copy at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to transform how people manage, sync, and share their clipboard data across devices. 
            Built with privacy, security, and user experience at the core.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/app"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Try FreeClipboard
            </Link>
            <Link
              to="/blog"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that productivity tools should enhance your workflow, not complicate it. 
                FreeClipboard was born from the frustration of losing important copied content and 
                the need for seamless cross-device clipboard synchronization.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our mission is to create the most secure, intelligent, and user-friendly clipboard 
                management tool that empowers individuals and teams to work more efficiently across 
                all their devices.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
                  <div className="text-gray-600">Items Synced</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <Target className="h-12 w-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-blue-100 mb-6">
                  To become the global standard for clipboard management, enabling seamless 
                  productivity across all devices and platforms while maintaining the highest 
                  standards of privacy and security.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    <span className="text-sm">SOC 2 Certified</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate experts from leading tech companies, united by a vision to revolutionize productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              From idea to global platform - here's how we've grown
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-24 text-right mr-8">
                  <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-blue-600 rounded-full mt-2 mr-8"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Culture</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe great products come from great teams. Here's what makes FreeClipboard special.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User-Centric</h3>
              <p className="text-gray-600">
                Every feature starts with user feedback. We build what people actually need, not what we think they want.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Open Source</h3>
              <p className="text-gray-600">
                We contribute to open source projects and believe in transparent, collaborative development.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Work-Life Balance</h3>
              <p className="text-gray-600">
                We practice what we preach about productivity - work smart, not just hard, and maintain healthy boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Rocket className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Clipboard Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who trust FreeClipboard for secure, intelligent clipboard management
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/app"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              View Pricing
            </Link>
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