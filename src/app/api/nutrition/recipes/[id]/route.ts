import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateRecipeSchema } from '@/lib/validations/nutrition';
import { getRecipe, updateRecipe, deleteRecipe } from '@/lib/services/nutrition-service';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const recipe = await getRecipe(params.id, profile.id);
    return successResponse(recipe);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = updateRecipeSchema.parse(body);
    const recipe = await updateRecipe(params.id, profile.id, validated);
    return successResponse(recipe);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    await deleteRecipe(params.id, profile.id);
    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
