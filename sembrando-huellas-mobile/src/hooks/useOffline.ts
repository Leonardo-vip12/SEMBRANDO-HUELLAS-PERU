import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '@/src/stores/offlineStore';

export function useOffline() {
  const store = useOfflineStore();

  useEffect(() => {
    store.initDatabase();
    const unsubscribe = NetInfo.addEventListener((state) => {
      store.setOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  return {
    isOnline: store.isOnline,
    syncQueue: store.syncQueue,
    addToSyncQueue: store.addToSyncQueue,
    processSyncQueue: store.processSyncQueue,
    saveDraft: store.saveDraft,
    getDrafts: store.getDrafts,
    deleteDraft: store.deleteDraft,
    addFavorite: store.addFavorite,
    removeFavorite: store.removeFavorite,
    isFavorite: store.isFavorite,
    pendingSync: store.syncQueue.length,
  };
}
