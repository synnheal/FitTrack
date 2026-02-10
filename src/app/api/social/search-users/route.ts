import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { searchUsersSchema } from '@/lib/validations/social';
import { searchProfiles } from '@/lib/services/social-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const validated = searchUsersSchema.parse({ q: searchParams.get('q') ?? '' });
    const results = await searchProfiles(validated.q, profile.id);
    return successResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}
