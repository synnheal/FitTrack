import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'idle' | 'syncing' | 'error';

export interface PendingMutation {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;
  created_at: string;
}

interface OfflineState {
  pendingQueue: PendingMutation[];
  syncStatus: SyncStatus;
  lastSyncAt: string | null;
}

interface OfflineActions {
  enqueue: (mutation: Omit<PendingMutation, 'id' | 'created_at'>) => void;
  dequeue: (id: string) => void;
  clearQueue: () => void;
  setSyncStatus: (status: SyncStatus) => void;
  setLastSyncAt: (timestamp: string) => void;
}

export const useOfflineStore = create<OfflineState & OfflineActions>()(
  persist(
    (set) => ({
      pendingQueue: [],
      syncStatus: 'idle',
      lastSyncAt: null,

      enqueue: (mutation) =>
        set((state) => ({
          pendingQueue: [
            ...state.pendingQueue,
            {
              ...mutation,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            },
          ],
        })),

      dequeue: (id) =>
        set((state) => ({
          pendingQueue: state.pendingQueue.filter((m) => m.id !== id),
        })),

      clearQueue: () => set({ pendingQueue: [] }),

      setSyncStatus: (status) => set({ syncStatus: status }),

      setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
    }),
    {
      name: 'fittrack-offline-queue',
      partialize: (state) => ({
        pendingQueue: state.pendingQueue,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);
