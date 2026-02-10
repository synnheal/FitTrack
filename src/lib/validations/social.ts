import { z } from 'zod';

export const createFeedPostSchema = z.object({
  type: z.enum(['workout_completed', 'pr_achieved', 'recipe_shared']),
  reference_id: z.string().uuid('Invalid reference ID'),
});

export const createCommentSchema = z.object({
  feed_item_id: z.string().uuid('Invalid feed item ID'),
  content: z.string().min(1, 'Comment cannot be empty').max(500),
});

export const friendRequestSchema = z.object({
  addressee_id: z.string().uuid('Invalid profile ID'),
});

export const friendResponseSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

export const searchUsersSchema = z.object({
  q: z.string().min(1).max(100),
});
