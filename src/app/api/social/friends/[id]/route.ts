import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { friendResponseSchema } from '@/lib/validations/social';
import { respondToFriendRequest } from '@/lib/services/social-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = friendResponseSchema.parse(body);
    const friendship = await respondToFriendRequest(params.id, profile.id, validated.status);
    return successResponse(friendship);
  } catch (error) {
    return handleApiError(error);
  }
}
