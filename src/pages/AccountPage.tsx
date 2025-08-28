import React from 'react';
import { useAuth } from '../components/AuthProvider';
import AppLayout from '../components/AppLayout';
import ProUpgradeModal from '../components/ProUpgradeModal';
import { supabase } from '../lib/supabase';
import { User, Crown, Mail, Calendar, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [userPlan, setUserPlan] = React.useState<'free' | 'pro'>('free');
  const [loading, setLoading] = React.useState(true);

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

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">
                    {loading ? 'Loading...' : `${userPlan === 'pro' ? 'Pro' : 'Free'} Plan`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {loading ? 'Loading...' : userPlan === 'pro' ? 'Unlimited clipboard items' : '20 clipboard items limit'}
                  </p>
                </div>
              </div>
              {!loading && userPlan === 'free' && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Upgrade to Pro
                </button>
              )}
              {!loading && userPlan === 'pro' && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium">
                  Pro Member
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="h-4 w-4 inline mr-3" />
                Change Email
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 inline mr-3" />
                Export Data
              </button>
              <button 
                onClick={signOut}
                className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 inline mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </AppLayout>
  );
}