import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import ResponsiveLayout from './ResponsiveLayout';
import ProUpgradeModal from './ProUpgradeModal';
import { Clipboard, Settings, User, LogOut, Crown, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [userPlan, setUserPlan] = React.useState<'free' | 'pro'>('free');
  const [loading, setLoading] = React.useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  
  // Check if user is admin
  const isAdmin = user?.email === 'admin@freeclipboard.com' || 
                 user?.email?.endsWith('@admin.freeclipboard.com') ||
                 user?.user_metadata?.role === 'admin';

  React.useEffect(() => {
    if (user) {
      loadUserPlan();
    }
  }, [user]);

  const loadUserPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading user plan:', error);
        return;
      }

      setUserPlan(data?.plan || 'free');
    } catch (error) {
      console.error('Error loading user plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebar = (
    <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Clipboard className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FreeClipboard</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/app"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive('/app')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clipboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            {!loading && userPlan === 'free' && (
              <li>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Crown className="h-5 w-5 mr-3" />
                  Upgrade to Pro
                </button>
              </li>
            )}
            {!loading && userPlan === 'pro' && (
              <li>
                <div className="flex items-center px-4 py-2 rounded-lg bg-yellow-50 text-yellow-800">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  Pro Member
                </div>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive('/admin')
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Admin Panel
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/account"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive('/account')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">
                {loading ? 'Loading...' : `${userPlan === 'pro' ? 'Pro' : 'Free'} Plan`}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
    </div>
  );

  const header = (
    <div className="flex items-center">
      <Clipboard className="h-6 w-6 text-blue-600 mr-2" />
      <span className="font-bold text-gray-900">FreeClipboard</span>
    </div>
  );

  return (
    <>
      <ResponsiveLayout
        sidebar={sidebar}
        header={header}
        main={children}
      />
      <ProUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}