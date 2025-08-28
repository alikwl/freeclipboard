import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { offlineManager, OfflineItem, SyncStatus } from '../lib/offline';
import { supabase } from '../lib/supabase';
import { saveClipboardItem as saveToSupabase, getClipboardItems as getFromSupabase } from '../lib/clipboard';
import toast from 'react-hot-toast';

export function useOfflineSync() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingItems: 0,
    syncInProgress: false
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      if (user) {
        // Immediate sync when coming online
        setTimeout(() => syncWithServer(), 100);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Auto-sync every 30 seconds when online
  useEffect(() => {
    if (!user || !isOnline) return;

    const interval = setInterval(() => {
      if (!syncStatus.syncInProgress) {
        syncWithServer();
      }
    }, 10000); // 10 seconds - more frequent sync

    return () => clearInterval(interval);
  }, [user, isOnline, syncStatus.syncInProgress]);
  // Initialize offline manager
  useEffect(() => {
    offlineManager.init().catch(console.error);
  }, []);

  // Load sync status on mount
  useEffect(() => {
    if (user) {
      loadSyncStatus();
      // Initial sync when user loads
      if (isOnline) {
        setTimeout(() => syncWithServer(), 500);
      }
    }
  }, [user]);

  const loadSyncStatus = async () => {
    try {
      const lastSync = await offlineManager.getSyncMetadata('lastSync');
      const pendingItems = await offlineManager.getPendingItems();
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync,
        pendingItems: pendingItems.length
      }));
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const syncWithServer = useCallback(async () => {
    if (!user || !isOnline || syncStatus.syncInProgress) {
      console.log('Sync skipped:', { user: !!user, isOnline, syncInProgress: syncStatus.syncInProgress });
      return;
    }

    // Verify user is still authenticated before syncing
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error || !currentUser) {
        console.error('User not authenticated for sync:', error);
        return;
      }
    } catch (error) {
      console.error('Auth check failed before sync:', error);
      return;
    }

    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));

    try {
      // Get pending items from offline storage
      const pendingItems = await offlineManager.getPendingItems();
      console.log(`Starting sync: ${pendingItems.length} pending items`);
      
      if (pendingItems.length > 0) {
        // Batch sync items for better performance
        const BATCH_SIZE = 5; // Process 5 items at a time
        let successful = 0;
        let failed = 0;

        for (let i = 0; i < pendingItems.length; i += BATCH_SIZE) {
          const batch = pendingItems.slice(i, i + BATCH_SIZE);
          
          const batchPromises = batch.map(async (item) => {
            try {
              // Skip if item already has a server ID and is just marked as needing sync
              if (item.id && item.id !== item.offline_id && !item.id.startsWith('temp_') && !item.id.startsWith('offline_')) {
                // Item already exists on server, just mark as synced
                await offlineManager.markItemSynced(item.offline_id!, item.id);
                return { success: true, item };
              }

              const serverItem = await saveToSupabase({
                id: (item.id && !item.id.startsWith('temp_') && !item.id.startsWith('offline_')) ? item.id : undefined,
                content: item.content,
                title: item.title,
                tags: item.tags,
                pinned: item.pinned,
                categoryId: item.category_id,
                isMultiSnippet: item.is_multi_snippet
              });

              // Mark as synced in offline storage
              await offlineManager.markItemSynced(item.offline_id!, serverItem.id);
              return { success: true, item: serverItem };
            } catch (error) {
              console.error('Error syncing item:', item.offline_id, error.message || error);
              return { success: false, item, error };
            }
          });

          const batchResults = await Promise.allSettled(batchPromises);
          successful += batchResults.filter(r => r.status === 'fulfilled' && r.value.success).length;
          failed += batchResults.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;
          
          // Small delay between batches to prevent overwhelming the server
          if (i + BATCH_SIZE < pendingItems.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        console.log(`Sync completed: ${successful} successful, ${failed} failed`);
        
        if (successful > 0) {
          toast.success(`Synced ${successful} items`);
        }
        if (failed > 0) {
          toast.error(`Failed to sync ${failed} items`);
        }
      }


      // Pull latest items from server and update offline storage
      try {
        // Verify auth before pulling from server
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          console.warn('Cannot pull from server: user not authenticated');
        } else {
          // Only pull from server if we have pending items or it's been a while
          const lastSync = await offlineManager.getSyncMetadata('lastSync');
          const shouldPull = !lastSync || 
            (Date.now() - new Date(lastSync).getTime()) > 60000 || // 1 minute
            pendingItems.length > 0;

          if (shouldPull) {
            const serverItems = await getFromSupabase();
            console.log(`Pulled ${serverItems.length} items from server`);
            
            // Batch update offline storage
            const updatePromises = serverItems.map(async (serverItem) => {
              const offlineItem: OfflineItem = {
                ...serverItem,
                offline_id: serverItem.id,
                needs_sync: 0,
                sync_status: 'synced',
                last_modified: serverItem.updated_at
              };
              return offlineManager.saveItem(offlineItem);
            });
            
            await Promise.all(updatePromises);
          }
        }
      } catch (error) {
        console.error('Error pulling from server:', error.message || error);
      }

      // Update sync metadata
      await offlineManager.setSyncMetadata('lastSync', new Date().toISOString());
      await loadSyncStatus();

    } catch (error) {
      console.error('Sync error:', error.message || error);
      if (error.message?.includes('Failed to fetch')) {
        toast.error('Sync failed: Cannot connect to server');
      } else if (error.message?.includes('not authenticated')) {
        toast.error('Sync failed: Please sign in again');
      } else {
        toast.error('Sync failed');
      }
    } finally {
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
    }
  }, [user, isOnline, syncStatus.syncInProgress]);

  const saveItemOffline = async (item: Partial<OfflineItem>): Promise<OfflineItem> => {
    if (!user) throw new Error('User not authenticated');

    const offlineItem: OfflineItem = {
      id: item.id || `temp_${Date.now()}`,
      user_id: user.id,
      content: item.content || '',
      title: item.title || 'Untitled',
      tags: item.tags || [],
      pinned: item.pinned || false,
      is_shared: false,
      is_multi_snippet: item.is_multi_snippet || false,
      category_id: item.category_id,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_template: false,
      view_count: 0,
      needs_sync: 1,
      sync_status: 'pending'
    };

    const savedItem = await offlineManager.saveItem(offlineItem);
    
    // Try to sync immediately if online
    if (isOnline) {
      setTimeout(() => syncWithServer(), 10); // Faster trigger
    }

    await loadSyncStatus();
    return savedItem;
  };

  const getItemsOffline = async (): Promise<OfflineItem[]> => {
    if (!user) return [];
    return await offlineManager.getItems(user.id);
  };

  const deleteItemOffline = async (offlineId: string): Promise<void> => {
    await offlineManager.deleteItem(offlineId);
    await loadSyncStatus();
  };

  const forcSync = () => {
    if (isOnline) {
      syncWithServer();
    } else {
      toast.error('Cannot sync while offline');
    }
  };

  return {
    isOnline,
    syncStatus,
    syncWithServer,
    saveItemOffline,
    getItemsOffline,
    deleteItemOffline,
    forcSync
  };
}