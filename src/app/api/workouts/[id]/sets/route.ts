import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createWorkoutSetSchema } from '@/lib/validations/workout';
import { listWorkoutSets, createWorkoutSet } from '@/lib/services/workout-service';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const sets = await listWorkoutSets(params.id);
    return successResponse(sets);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = createWorkoutSetSchema.parse(body);
    const set = await createWorkoutSet(params.id, validated);
    return successResponse(set, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
