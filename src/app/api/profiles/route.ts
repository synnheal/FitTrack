import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createProfileSchema } from '@/lib/validations/profile';
import { listProfiles, createProfile } from '@/lib/services/profile-service';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return errorResponse('Unauthorized', 401);

    const profiles = await listProfiles(user.id);
    return successResponse(profiles);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = createProfileSchema.parse(body);
    const profile = await createProfile(user.id, validated);
    return successResponse(profile, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
