import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { switchActiveProfile } from '@/lib/services/profile-service';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return errorResponse('Unauthorized', 401);

    const profile = await switchActiveProfile(params.id, user.id);
    return successResponse(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
