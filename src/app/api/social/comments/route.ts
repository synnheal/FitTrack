import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createCommentSchema } from '@/lib/validations/social';
import { addComment } from '@/lib/services/social-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = createCommentSchema.parse(body);
    const comment = await addComment(profile.id, validated);
    return successResponse(comment, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
