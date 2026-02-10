import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { listPersonalRecords } from '@/lib/services/stats-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const exerciseId = request.nextUrl.searchParams.get('exercise_id') ?? undefined;
    const records = await listPersonalRecords(profile.id, exerciseId);
    return successResponse(records);
  } catch (error) {
    return handleApiError(error);
  }
}
