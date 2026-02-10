import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateMeasurementSchema } from '@/lib/validations/stats';
import { updateMeasurement, deleteMeasurement } from '@/lib/services/stats-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const validated = updateMeasurementSchema.parse(body);
    const measurement = await updateMeasurement(params.id, profile.id, validated);
    return successResponse(measurement);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    await deleteMeasurement(params.id, profile.id);
    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
