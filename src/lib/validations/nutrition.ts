import { z } from 'zod';

export const createMealLogSchema = z.object({
  food_id: z.string().uuid('Invalid food ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  quantity_grams: z.number().positive('Quantity must be positive'),
});

export const updateMealLogSchema = z.object({
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  quantity_grams: z.number().positive().optional(),
});

export const createFoodSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  brand: z.string().max(200).nullable().optional(),
  barcode: z.string().max(50).nullable().optional(),
  calories_per_100g: z.number().nonnegative(),
  protein_per_100g: z.number().nonnegative(),
  carbs_per_100g: z.number().nonnegative(),
  fat_per_100g: z.number().nonnegative(),
});

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  instructions: z.string().max(5000).nullable().optional(),
  servings: z.number().int().positive(),
  is_shared: z.boolean().optional(),
  ingredients: z.array(z.object({
    food_id: z.string().uuid(),
    quantity_grams: z.number().positive(),
  })).min(1, 'At least one ingredient is required'),
});

export const foodSearchSchema = z.object({
  q: z.string().min(1).max(200).optional(),
  barcode: z.string().min(1).max(50).optional(),
}).refine(data => data.q || data.barcode, {
  message: 'Either "q" or "barcode" is required',
});

export const updateRecipeSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  instructions: z.string().max(5000).nullable().optional(),
  servings: z.number().int().positive().optional(),
  is_shared: z.boolean().optional(),
  ingredients: z.array(z.object({
    food_id: z.string().uuid(),
    quantity_grams: z.number().positive(),
  })).min(1).optional(),
});
