import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError, getAuthenticatedProfile } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createMeasurementSchema } from '@/lib/validations/stats';
import { listMeasurements, createMeasurement } from '@/lib/services/stats-service';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const profile = await getAuthenticatedProfile(supabase);
    if (!profile) return errorResponse('Unauthorized', 401);

    const measurements = await listMeasurements(profile.id);
    return successResponse(measurements);
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
    const validated = createMeasurementSchema.parse(body);
    const measurement = await createMeasurement(profile.id, validated);
    return successResponse(measurement, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
