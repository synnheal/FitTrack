import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateMealLogSchema } from '@/lib/validations/nutrition';
import { updateMealLog, deleteMealLog } from '@/lib/services/nutrition-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = updateMealLogSchema.parse(body);
    const meal = await updateMealLog(params.id, profile.id, validated);
    return successResponse(meal);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    await deleteMealLog(params.id, profile.id);
    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
