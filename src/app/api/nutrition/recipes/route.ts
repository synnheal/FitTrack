import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createRecipeSchema } from '@/lib/validations/nutrition';
import { listRecipes, createRecipe } from '@/lib/services/nutrition-service';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const recipes = await listRecipes(profile.id);
    return successResponse(recipes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = createRecipeSchema.parse(body);
    const recipe = await createRecipe(profile.id, validated);
    return successResponse(recipe, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
