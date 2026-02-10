import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateProfileSchema } from '@/lib/validations/profile';
import { updateProfile } from '@/lib/services/profile-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);
    const profile = await updateProfile(params.id, user.id, validated);
    return successResponse(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
