import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  avatar_url: z.string().url().nullable().optional(),
  age: z.number().int().min(13).max(120).nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  height: z.number().positive().nullable().optional(),
  goal: z.enum(['bulk', 'cut', 'strength', 'maintenance']),
  calorie_target: z.number().int().positive().nullable().optional(),
  protein_target: z.number().int().nonnegative().nullable().optional(),
  carbs_target: z.number().int().nonnegative().nullable().optional(),
  fat_target: z.number().int().nonnegative().nullable().optional(),
});

export const updateProfileSchema = createProfileSchema.partial();
