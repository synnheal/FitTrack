import { createServerSupabaseClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInsert = any;

// --- Meal Logs ---

export async function listMealLogs(profileId: string, date?: string) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('meal_logs')
    .select('*, foods:food_id(name, brand, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createMealLog(profileId: string, input: {
  food_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity_grams: number;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('meal_logs')
    .insert({ profile_id: profileId, ...input } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMealLog(logId: string, profileId: string, input: {
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity_grams?: number;
}) {
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('meal_logs').update as any)(input as AnyInsert)
    .eq('id', logId)
    .eq('profile_id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMealLog(logId: string, profileId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('meal_logs')
    .delete()
    .eq('id', logId)
    .eq('profile_id', profileId);

  if (error) throw error;
}

// --- Foods ---

export async function searchFoods(query: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(50);

  if (error) throw error;
  return data;
}

export async function createFood(createdBy: string | null, input: {
  name: string;
  brand?: string | null;
  barcode?: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('foods')
    .insert({
      ...input,
      brand: input.brand ?? null,
      barcode: input.barcode ?? null,
      is_custom: true,
      created_by: createdBy,
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findFoodByBarcode(barcode: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('barcode', barcode)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function findOrCreateFoodByBarcode(barcode: string, foodData: {
  name: string;
  brand?: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}) {
  const existing = await findFoodByBarcode(barcode);
  if (existing) return existing;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('foods')
    .insert({
      name: foodData.name,
      brand: foodData.brand ?? null,
      barcode,
      calories_per_100g: foodData.calories_per_100g,
      protein_per_100g: foodData.protein_per_100g,
      carbs_per_100g: foodData.carbs_per_100g,
      fat_per_100g: foodData.fat_per_100g,
      is_custom: false,
      created_by: null,
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- Recipes ---

export async function listRecipes(profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_ingredients(*, foods:food_id(name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g))')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRecipe(recipeId: string, profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_ingredients(*, foods:food_id(name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g))')
    .eq('id', recipeId)
    .eq('profile_id', profileId)
    .single();

  if (error) throw error;
  return data;
}

export async function createRecipe(profileId: string, input: {
  name: string;
  instructions?: string | null;
  servings: number;
  is_shared?: boolean;
  ingredients: { food_id: string; quantity_grams: number }[];
}) {
  const supabase = createServerSupabaseClient();

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      profile_id: profileId,
      name: input.name,
      instructions: input.instructions ?? null,
      servings: input.servings,
      is_shared: input.is_shared ?? false,
    } as AnyInsert)
    .select()
    .single();

  if (recipeError) throw recipeError;
  if (!recipe) throw new Error('Failed to create recipe');

  const ingredientRows = input.ingredients.map(ing => ({
    recipe_id: (recipe as any).id,
    food_id: ing.food_id,
    quantity_grams: ing.quantity_grams,
  }));

  const { error: ingError } = await supabase
    .from('recipe_ingredients')
    .insert(ingredientRows as AnyInsert);

  if (ingError) throw ingError;

  return getRecipe((recipe as any).id, profileId);
}

export async function updateRecipe(recipeId: string, profileId: string, input: {
  name?: string;
  instructions?: string | null;
  servings?: number;
  is_shared?: boolean;
  ingredients?: { food_id: string; quantity_grams: number }[];
}) {
  const supabase = createServerSupabaseClient();

  const { ingredients, ...recipeFields } = input;

  if (Object.keys(recipeFields).length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('recipes').update as any)(recipeFields as AnyInsert)
      .eq('id', recipeId)
      .eq('profile_id', profileId);

    if (error) throw error;
  }

  if (ingredients) {
    const { error: delError } = await supabase
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipeId);

    if (delError) throw delError;

    const ingredientRows = ingredients.map(ing => ({
      recipe_id: recipeId,
      food_id: ing.food_id,
      quantity_grams: ing.quantity_grams,
    }));

    const { error: insError } = await supabase
      .from('recipe_ingredients')
      .insert(ingredientRows as AnyInsert);

    if (insError) throw insError;
  }

  return getRecipe(recipeId, profileId);
}

export async function deleteRecipe(recipeId: string, profileId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
    .eq('profile_id', profileId);

  if (error) throw error;
}
