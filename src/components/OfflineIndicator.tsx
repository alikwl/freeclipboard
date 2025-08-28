import React from 'react';
import { Wifi, WifiOff, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { formatDistanceToNow } from 'date-fns';

export default function OfflineIndicator() {
  const { isOnline, syncStatus, forcSync } = useOfflineSync();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border ${
        isOnline 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>

        {syncStatus.pendingItems > 0 && (
          <div className="flex items-center space-x-1 text-orange-600">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{syncStatus.pendingItems} pending</span>
          </div>
        )}

        {syncStatus.syncInProgress && (
          <RefreshCw className="h-4 w-4 animate-spin" />
        )}

        {isOnline && !syncStatus.syncInProgress && (
          <button
            onClick={forcSync}
            className="p-1 hover:bg-green-100 rounded transition-colors"
            title="Force sync"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        )}
      </div>

      {syncStatus.lastSync && (
        <div className="mt-2 text-xs text-gray-500 text-right">
          Last sync: {formatDistanceToNow(new Date(syncStatus.lastSync), { addSuffix: true })}
        </div>
      )}

      {!isOnline && (
        <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-xs">
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Working offline. Changes will sync when online.</span>
          </div>
        </div>
      )}
    </div>
  );
}