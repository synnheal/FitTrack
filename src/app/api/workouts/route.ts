import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createWorkoutSchema } from '@/lib/validations/workout';
import { listWorkouts, createWorkout } from '@/lib/services/workout-service';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const workouts = await listWorkouts(profile.id);
    return successResponse(workouts);
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
    const validated = createWorkoutSchema.parse(body);
    const workout = await createWorkout(profile.id, validated);
    return successResponse(workout, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
