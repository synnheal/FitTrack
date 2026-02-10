'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedProfile } from '@/lib/api-utils';
import { createMeasurementSchema } from '@/lib/validations/stats';
import { createMeasurement } from '@/lib/services/stats-service';

export async function addMeasurementAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) throw new Error('Unauthorized');

  const input = createMeasurementSchema.parse({
    date: formData.get('date'),
    weight: formData.get('weight') ? Number(formData.get('weight')) : null,
    body_fat: formData.get('body_fat') ? Number(formData.get('body_fat')) : null,
    arms: formData.get('arms') ? Number(formData.get('arms')) : null,
    chest: formData.get('chest') ? Number(formData.get('chest')) : null,
    waist: formData.get('waist') ? Number(formData.get('waist')) : null,
    thighs: formData.get('thighs') ? Number(formData.get('thighs')) : null,
  });

  return createMeasurement(profile.id, input);
}
