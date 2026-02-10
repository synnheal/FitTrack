import { z } from 'zod';

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  template_id: z.string().uuid().nullable().optional(),
  started_at: z.string().datetime().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const updateWorkoutSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  finished_at: z.string().datetime().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const createWorkoutSetSchema = z.object({
  exercise_id: z.string().uuid('Invalid exercise ID'),
  set_number: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().nonnegative(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  notes: z.string().max(200).nullable().optional(),
});

export const updateWorkoutSetSchema = z.object({
  reps: z.number().int().positive().optional(),
  weight: z.number().nonnegative().optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  notes: z.string().max(200).nullable().optional(),
  is_pr: z.boolean().optional(),
});
