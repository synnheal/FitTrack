'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { replayQueue } from './sync-manager';
import { getQueueSize } from './offline-queue';
import { useOfflineStore } from '@/stores/offline-store';

export type SyncHookStatus = 'idle' | 'syncing' | 'error';

export interface UseSyncReturn {
  isOnline: boolean;
  pendingCount: number;
  syncStatus: SyncHookStatus;
  forceSync: () => Promise<void>;
}

export function useSync(): UseSyncReturn {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncHookStatus>('idle');
  const syncingRef = useRef(false);
  const offlineStore = useOfflineStore();

  const refreshPendingCount = useCallback(() => {
    setPendingCount(getQueueSize());
  }, []);

  const doSync = useCallback(async () => {
    if (syncingRef.current || !navigator.onLine) return;
    const count = getQueueSize();
    if (count === 0) return;

    syncingRef.current = true;
    setSyncStatus('syncing');
    offlineStore.setSyncStatus('syncing');

    try {
      const result = await replayQueue();
      if (result.failed > 0) {
        setSyncStatus('error');
        offlineStore.setSyncStatus('error');
      } else {
        setSyncStatus('idle');
        offlineStore.setSyncStatus('idle');
        offlineStore.setLastSyncAt(new Date().toISOString());
      }
    } catch {
      setSyncStatus('error');
      offlineStore.setSyncStatus('error');
    } finally {
      syncingRef.current = false;
      refreshPendingCount();
    }
  }, [offlineStore, refreshPendingCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      doSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    refreshPendingCount();

    // Attempt sync on mount if online
    if (navigator.onLine) {
      doSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [doSync, refreshPendingCount]);

  // Poll pending count periodically
  useEffect(() => {
    const interval = setInterval(refreshPendingCount, 5000);
    return () => clearInterval(interval);
  }, [refreshPendingCount]);

  return {
    isOnline,
    pendingCount,
    syncStatus,
    forceSync: doSync,
  };
}
