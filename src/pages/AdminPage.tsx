import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { 
  Users, 
  Crown, 
  Shield, 
  AlertTriangle, 
  Search, 
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  TrendingUp,
  Database
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  plan: 'free' | 'pro';
  created_at: string;
  items_count?: number;
  last_active?: string;
  is_admin?: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    totalItems: 0,
    activeToday: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    // Check if user is admin (you can modify this logic)
    const isAdmin = user.email === 'admin@freeclipboard.com' || 
                   user.email?.endsWith('@admin.freeclipboard.com') ||
                   user.user_metadata?.role === 'admin';

    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/app');
      return;
    }

    loadUsers();
    loadStats();
  };

  const loadUsers = async () => {
    try {
      // Admin users management - separate from regular item access
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          plan,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get item counts separately for each user (admin function)
      const usersWithCounts = [];
      for (const user of data || []) {
        // Count items for each user separately
        const { count } = await supabase
          .from('items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        usersWithCounts.push({
          ...user,
          items_count: count || 0,
          is_admin: user.email === 'admin@freeclipboard.com' || 
                   user.email?.endsWith('@admin.freeclipboard.com')
        });
      }

      setUsers(usersWithCounts);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('plan, created_at');

      const { data: itemsData } = await supabase
        .from('items')
        .select('id');

      if (usersData) {
        const totalUsers = usersData.length;
        const freeUsers = usersData.filter(u => u.plan === 'free').length;
        const proUsers = usersData.filter(u => u.plan === 'pro').length;
        const totalItems = itemsData?.length || 0;

        // Calculate active today (simplified - users created today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeToday = usersData.filter(u => 
          new Date(u.created_at) >= today
        ).length;

        setStats({
          totalUsers,
          freeUsers,
          proUsers,
          totalItems,
          activeToday
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const promoteUser = async (userId: string, currentPlan: string) => {
    const newPlan = currentPlan === 'free' ? 'pro' : 'free';
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ plan: newPlan })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, plan: newPlan as 'free' | 'pro' } : user
      ));

      toast.success(`User ${newPlan === 'pro' ? 'promoted to' : 'demoted from'} Pro plan`);
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast.error('Failed to update user plan');
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete user's items first (due to foreign key constraint)
      await supabase
        .from('items')
        .delete()
        .eq('user_id', userId);

      // Delete user profile
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    
    return matchesSearch && matchesPlan;
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <p className="text-gray-600">
              Manage users, monitor activity, and oversee platform operations
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Free Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.freeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pro Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.proUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeToday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPlanFilter('all')}
                    className={`px-4 py-3 text-sm font-medium ${
                      planFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    All Plans
                  </button>
                  <button
                    onClick={() => setPlanFilter('free')}
                    className={`px-4 py-3 text-sm font-medium border-l border-gray-300 ${
                      planFilter === 'free' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setPlanFilter('pro')}
                    className={`px-4 py-3 text-sm font-medium border-l border-gray-300 ${
                      planFilter === 'pro' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors flex items-center`}
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Pro
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({filteredUsers.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || user.email}
                              </div>
                              {user.is_admin && (
                                <Shield className="h-4 w-4 text-red-500 ml-2" title="Admin" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.plan === 'pro' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
                          {user.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.items_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => promoteUser(user.id, user.plan)}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              user.plan === 'free'
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {user.plan === 'free' ? (
                              <>
                                <Crown className="h-3 w-3 mr-1" />
                                Promote to Pro
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Demote to Free
                              </>
                            )}
                          </button>
                          
                          {!user.is_admin && (
                            <button
                              onClick={() => deleteUser(user.id, user.email)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search query' : 'No users match the selected filters'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}