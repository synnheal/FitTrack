import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createFoodSchema } from '@/lib/validations/nutrition';
import { searchFoods, createFood } from '@/lib/services/nutrition-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const query = request.nextUrl.searchParams.get('q') ?? '';
    if (!query) return errorResponse('Search query "q" is required');

    const foods = await searchFoods(query);
    return successResponse(foods);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);

    const body = await request.json();
    const validated = createFoodSchema.parse(body);
    const food = await createFood(profile?.id ?? null, validated);
    return successResponse(food, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
