'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedProfile } from '@/lib/api-utils';
import { createMealLogSchema, createFoodSchema } from '@/lib/validations/nutrition';
import { createMealLog, createFood } from '@/lib/services/nutrition-service';

export async function logMealAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) throw new Error('Unauthorized');

  const input = createMealLogSchema.parse({
    food_id: formData.get('food_id'),
    date: formData.get('date'),
    meal_type: formData.get('meal_type'),
    quantity_grams: Number(formData.get('quantity_grams')),
  });

  return createMealLog(profile.id, input);
}

export async function createCustomFoodAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) throw new Error('Unauthorized');

  const input = createFoodSchema.parse({
    name: formData.get('name'),
    brand: formData.get('brand') || null,
    barcode: formData.get('barcode') || null,
    calories_per_100g: Number(formData.get('calories_per_100g')),
    protein_per_100g: Number(formData.get('protein_per_100g')),
    carbs_per_100g: Number(formData.get('carbs_per_100g')),
    fat_per_100g: Number(formData.get('fat_per_100g')),
  });

  return createFood(profile.id, input);
}
