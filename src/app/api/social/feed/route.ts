import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createFeedPostSchema } from '@/lib/validations/social';
import { listFeed, createFeedPost } from '@/lib/services/social-service';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const feed = await listFeed(profile.id);
    return successResponse(feed);
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
    const validated = createFeedPostSchema.parse(body);
    const post = await createFeedPost(profile.id, validated);
    return successResponse(post, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
