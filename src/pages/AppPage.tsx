import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import AppLayout from '../components/AppLayout';
import ClipboardBoard from '../components/ClipboardBoard';
import ItemDetail from '../components/ItemDetail';
import { ClipboardItem } from '../lib/supabase';
import { getClipboardItems } from '../lib/clipboard';
import toast from 'react-hot-toast';

export default function AppPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClipboardItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'board' | 'detail'>('board');
  const [itemType, setItemType] = useState<'single' | 'multi'>('single');

  useEffect(() => {
    if (!loading && user) {
      loadItems();
      // Set up periodic refresh to ensure items stay in sync
      const interval = setInterval(loadItems, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, loading]);

  const loadItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await getClipboardItems();
      setItems(data);
      console.log('Loaded items:', data.length);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSelect = (item: ClipboardItem | null) => {
    setSelectedItem(item);
    if (item) {
      setView('detail');
    }
  };

  const handleBackToBoard = () => {
    setView('board');
    setSelectedItem(null);
  };

  const handleNewItem = () => {
    setSelectedItem(null);
    setView('detail');
  };

  const handleNewItemWithType = (type: 'single' | 'multi') => {
    setSelectedItem(null);
    setView('detail');
    setItemType(type);
  };

  // Force refresh items when needed
  const refreshItems = () => {
    loadItems();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to access your clipboard.</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      {view === 'board' ? (
        <ClipboardBoard 
          items={items}
          onItemSelect={handleItemSelect}
          onItemsChange={setItems}
          isLoading={isLoading}
          onNewItem={handleNewItemWithType}
          onRefresh={refreshItems}
        />
      ) : (
        <ItemDetail 
          item={selectedItem}
          itemType={itemType}
          onBack={handleBackToBoard}
          onItemsChange={setItems}
          onItemSelect={setSelectedItem}
          onRefresh={refreshItems}
        />
      )}
    </AppLayout>
  );
}