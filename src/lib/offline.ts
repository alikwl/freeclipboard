import { ClipboardItem, Category, Snippet } from './supabase';

export interface OfflineItem extends ClipboardItem {
  offline_id?: string;
  needs_sync?: 0 | 1;
  last_modified?: string;
  sync_status?: 'pending' | 'synced' | 'conflict';
}

export interface OfflineCategory extends Category {
  offline_id?: string;
  needs_sync?: 0 | 1;
  last_modified?: string;
  sync_status?: 'pending' | 'synced' | 'conflict';
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingItems: number;
  syncInProgress: boolean;
}

class OfflineManager {
  private dbName = 'freeclipboard_offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Items store
        if (!db.objectStoreNames.contains('items')) {
          const itemsStore = db.createObjectStore('items', { keyPath: 'offline_id' });
          itemsStore.createIndex('id', 'id', { unique: false });
          itemsStore.createIndex('user_id', 'user_id', { unique: false });
          itemsStore.createIndex('needs_sync', 'needs_sync', { unique: false });
          itemsStore.createIndex('last_modified', 'last_modified', { unique: false });
        }

        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          const categoriesStore = db.createObjectStore('categories', { keyPath: 'offline_id' });
          categoriesStore.createIndex('id', 'id', { unique: false });
          categoriesStore.createIndex('user_id', 'user_id', { unique: false });
          categoriesStore.createIndex('needs_sync', 'needs_sync', { unique: false });
        }

        // Snippets store
        if (!db.objectStoreNames.contains('snippets')) {
          const snippetsStore = db.createObjectStore('snippets', { keyPath: 'offline_id' });
          snippetsStore.createIndex('id', 'id', { unique: false });
          snippetsStore.createIndex('item_id', 'item_id', { unique: false });
          snippetsStore.createIndex('needs_sync', 'needs_sync', { unique: false });
        }

        // Sync metadata store
        if (!db.objectStoreNames.contains('sync_metadata')) {
          db.createObjectStore('sync_metadata', { keyPath: 'key' });
        }
      };
    });
  }

  // Items management
  async saveItem(item: OfflineItem): Promise<OfflineItem> {
    if (!this.db) await this.init();

    const offlineItem: OfflineItem = {
      ...item,
      offline_id: item.offline_id || `offline_${Date.now()}_${Math.random()}`,
      needs_sync: 1,
      last_modified: new Date().toISOString(),
      sync_status: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['items'], 'readwrite');
      const store = transaction.objectStore('items');
      
      // Use faster put operation
      const request = store.put(offlineItem);

      request.onsuccess = () => resolve(offlineItem);
      request.onerror = () => reject(request.error);
      
      // Set transaction timeout for faster operations
      transaction.oncomplete = () => resolve(offlineItem);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getItems(userId: string): Promise<OfflineItem[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['items'], 'readonly');
      const store = transaction.objectStore('items');
      const index = store.index('user_id');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const items = request.result.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteItem(offlineId: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['items'], 'readwrite');
      const store = transaction.objectStore('items');
      const request = store.delete(offlineId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Categories management
  async saveCategory(category: OfflineCategory): Promise<OfflineCategory> {
    if (!this.db) await this.init();

    const offlineCategory: OfflineCategory = {
      ...category,
      offline_id: category.offline_id || `offline_cat_${Date.now()}_${Math.random()}`,
      needs_sync: 1,
      last_modified: new Date().toISOString(),
      sync_status: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['categories'], 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.put(offlineCategory);

      request.onsuccess = () => resolve(offlineCategory);
      request.onerror = () => reject(request.error);
    });
  }

  async getCategories(userId: string): Promise<OfflineCategory[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['categories'], 'readonly');
      const store = transaction.objectStore('categories');
      const index = store.index('user_id');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync management
  async getPendingItems(): Promise<OfflineItem[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['items'], 'readonly');
      const store = transaction.objectStore('items');
      const index = store.index('needs_sync');
      const request = index.getAll(IDBKeyRange.only(1));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markItemSynced(offlineId: string, serverId?: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['items'], 'readwrite');
      const store = transaction.objectStore('items');
      const getRequest = store.get(offlineId);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.needs_sync = 0;
          item.sync_status = 'synced';
          if (serverId) item.id = serverId;
          item.last_modified = new Date().toISOString();

          // Use faster put operation without waiting for individual success
          store.put(item);
        } else {
          // Item not found, still resolve to prevent blocking
        }
        resolve();
      };
      getRequest.onerror = () => reject(getRequest.error);
      
      // Set transaction timeout
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async setSyncMetadata(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_metadata'], 'readwrite');
      const store = transaction.objectStore('sync_metadata');
      const request = store.put({ key, value, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncMetadata(key: string): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_metadata'], 'readonly');
      const store = transaction.objectStore('sync_metadata');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['items', 'categories', 'snippets', 'sync_metadata'], 'readwrite');
      
      const promises = [
        new Promise<void>((res, rej) => {
          const req = transaction.objectStore('items').clear();
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        }),
        new Promise<void>((res, rej) => {
          const req = transaction.objectStore('categories').clear();
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        }),
        new Promise<void>((res, rej) => {
          const req = transaction.objectStore('snippets').clear();
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        }),
        new Promise<void>((res, rej) => {
          const req = transaction.objectStore('sync_metadata').clear();
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        })
      ];

      Promise.all(promises)
        .then(() => resolve())
        .catch(reject);
    });
  }
}

export const offlineManager = new OfflineManager();