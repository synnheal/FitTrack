/**
 * Sync manager - replays offline queue against Supabase when back online.
 * Uses last-write-wins conflict resolution.
 */

import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getQueue, removeFromQueue, type QueuedMutation } from './offline-queue';

export type SyncResult = {
  success: number;
  failed: number;
  errors: Array<{ mutation: QueuedMutation; error: string }>;
};

/**
 * Replay all pending mutations in FIFO order against Supabase.
 * Successfully replayed mutations are removed from the queue.
 */
export async function replayQueue(): Promise<SyncResult> {
  // Cast to untyped client since we use dynamic table names from the queue
  const supabase = createClient() as unknown as SupabaseClient;
  const queue = getQueue();
  const result: SyncResult = { success: 0, failed: 0, errors: [] };

  for (const mutation of queue) {
    try {
      let response;

      switch (mutation.action) {
        case 'insert':
          response = await supabase
            .from(mutation.table)
            .insert(mutation.payload);
          break;
        case 'update': {
          const { id, ...rest } = mutation.payload as { id: string } & Record<string, unknown>;
          response = await supabase
            .from(mutation.table)
            .update(rest)
            .eq('id', id);
          break;
        }
        case 'delete': {
          const deleteId = mutation.payload.id as string;
          response = await supabase
            .from(mutation.table)
            .delete()
            .eq('id', deleteId);
          break;
        }
      }

      if (response?.error) {
        result.failed++;
        result.errors.push({ mutation, error: response.error.message });
      } else {
        removeFromQueue(mutation.id);
        result.success++;
      }
    } catch (err) {
      result.failed++;
      result.errors.push({
        mutation,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return result;
}
