import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { friendRequestSchema } from '@/lib/validations/social';
import { listFriends, sendFriendRequest } from '@/lib/services/social-service';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const friends = await listFriends(profile.id);
    return successResponse(friends);
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
    const validated = friendRequestSchema.parse(body);
    const friendship = await sendFriendRequest(profile.id, validated.addressee_id);
    return successResponse(friendship, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
