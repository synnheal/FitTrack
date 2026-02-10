import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateWorkoutSetSchema } from '@/lib/validations/workout';
import { updateWorkoutSet, deleteWorkoutSet } from '@/lib/services/workout-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string; setId: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = updateWorkoutSetSchema.parse(body);
    const set = await updateWorkoutSet(params.setId, params.id, validated);
    return successResponse(set);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string; setId: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    await deleteWorkoutSet(params.setId, params.id);
    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
