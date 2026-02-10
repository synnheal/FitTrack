import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createMealLogSchema } from '@/lib/validations/nutrition';
import { listMealLogs, createMealLog } from '@/lib/services/nutrition-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const date = request.nextUrl.searchParams.get('date') ?? undefined;
    const meals = await listMealLogs(profile.id, date);
    return successResponse(meals);
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
    const validated = createMealLogSchema.parse(body);
    const meal = await createMealLog(profile.id, validated);
    return successResponse(meal, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
