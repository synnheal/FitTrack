import { z } from 'zod';

export const createMeasurementSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  weight: z.number().positive().nullable().optional(),
  body_fat: z.number().min(1).max(60).nullable().optional(),
  arms: z.number().positive().nullable().optional(),
  chest: z.number().positive().nullable().optional(),
  waist: z.number().positive().nullable().optional(),
  thighs: z.number().positive().nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
});

export const updateMeasurementSchema = createMeasurementSchema.partial();
