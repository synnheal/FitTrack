/**
 * Offline queue - persists pending mutations in localStorage.
 * Used by the sync manager to replay mutations when back online.
 */

export interface QueuedMutation {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;
  created_at: string;
}

const STORAGE_KEY = 'fittrack-offline-mutations';

export function getQueue(): QueuedMutation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToQueue(mutation: Omit<QueuedMutation, 'id' | 'created_at'>): QueuedMutation {
  const entry: QueuedMutation = {
    ...mutation,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  const queue = getQueue();
  queue.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  return entry;
}

export function removeFromQueue(id: string): void {
  const queue = getQueue().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function clearQueue(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getQueueSize(): number {
  return getQueue().length;
}
