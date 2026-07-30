import { create } from 'zustand';
import * as SQLite from 'expo-sqlite';

interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body: any;
  createdAt: string;
  retries: number;
}

interface OfflineState {
  isOnline: boolean;
  syncQueue: SyncQueueItem[];
  observationDrafts: any[];
  downloadedContent: string[];
  favorites: string[];
  setOnline: (online: boolean) => void;
  addToSyncQueue: (item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retries'>) => Promise<void>;
  processSyncQueue: () => Promise<void>;
  clearSyncQueue: () => Promise<void>;
  saveDraft: (draft: any) => Promise<void>;
  getDrafts: () => Promise<any[]>;
  deleteDraft: (id: string) => Promise<void>;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  initDatabase: () => Promise<void>;
}

let db: SQLite.SQLiteDatabase | null = null;

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,
  syncQueue: [],
  observationDrafts: [],
  downloadedContent: [],
  favorites: [],

  setOnline: (online) => {
    set({ isOnline: online });
    if (online) get().processSyncQueue();
  },

  addToSyncQueue: async (item) => {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      retries: 0,
    };
    if (db) {
      await db.runAsync(
        'INSERT INTO sync_queue (id, endpoint, method, body, created_at, retries) VALUES (?, ?, ?, ?, ?, ?)',
        queueItem.id, queueItem.endpoint, queueItem.method, JSON.stringify(queueItem.body), queueItem.createdAt, queueItem.retries
      );
    }
    set((s) => ({ syncQueue: [...s.syncQueue, queueItem] }));
  },

  processSyncQueue: async () => {
    if (!db) return;
    const { isOnline } = get();
    if (!isOnline) return;

    const items = await db.getAllAsync<SyncQueueItem>('SELECT * FROM sync_queue ORDER BY created_at ASC LIMIT 10');
    for (const item of items) {
      try {
        const response = await fetch(`${item.endpoint}`, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.body),
        });
        if (response.ok) {
          await db.runAsync('DELETE FROM sync_queue WHERE id = ?', item.id);
        } else {
          await db.runAsync('UPDATE sync_queue SET retries = retries + 1 WHERE id = ?', item.id);
        }
      } catch {
        await db.runAsync('UPDATE sync_queue SET retries = retries + 1 WHERE id = ?', item.id);
      }
    }
    const remaining = await db.getAllAsync<SyncQueueItem>('SELECT * FROM sync_queue ORDER BY created_at ASC');
    set({ syncQueue: remaining });
  },

  clearSyncQueue: async () => {
    if (db) await db.runAsync('DELETE FROM sync_queue');
    set({ syncQueue: [] });
  },

  saveDraft: async (draft) => {
    if (db) {
      await db.runAsync(
        'INSERT OR REPLACE INTO observation_drafts (id, data, updated_at) VALUES (?, ?, ?)',
        draft.id || `${Date.now()}`, JSON.stringify(draft), new Date().toISOString()
      );
    }
  },

  getDrafts: async () => {
    if (!db) return [];
    const rows = await db.getAllAsync<{ data: string }>('SELECT data FROM observation_drafts ORDER BY updated_at DESC');
    return rows.map(r => JSON.parse(r.data));
  },

  deleteDraft: async (id) => {
    if (db) await db.runAsync('DELETE FROM observation_drafts WHERE id = ?', id);
  },

  addFavorite: async (id) => {
    if (db) await db.runAsync('INSERT OR IGNORE INTO favorites (item_id) VALUES (?)', id);
    set((s) => ({ favorites: [...s.favorites, id] }));
  },

  removeFavorite: async (id) => {
    if (db) await db.runAsync('DELETE FROM favorites WHERE item_id = ?', id);
    set((s) => ({ favorites: s.favorites.filter((f) => f !== id) }));
  },

  isFavorite: (id) => get().favorites.includes(id),

  initDatabase: async () => {
    try {
      db = await SQLite.openDatabaseAsync('sembrando-huellas.db');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          endpoint TEXT NOT NULL,
          method TEXT NOT NULL,
          body TEXT,
          created_at TEXT NOT NULL,
          retries INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS observation_drafts (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS downloaded_content (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          downloaded_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS favorites (
          item_id TEXT PRIMARY KEY,
          type TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS gamification (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
      const favorites = await db.getAllAsync<{ item_id: string }>('SELECT item_id FROM favorites');
      set({ favorites: favorites.map(f => f.item_id) });
      const queue = await db.getAllAsync<SyncQueueItem>('SELECT * FROM sync_queue ORDER BY created_at ASC');
      set({ syncQueue: queue });
    } catch (error) {
      console.error('Database init failed:', error);
    }
  },
}));
