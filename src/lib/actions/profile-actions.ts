'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createProfileSchema, updateProfileSchema } from '@/lib/validations/profile';
import { createProfile, updateProfile, switchActiveProfile } from '@/lib/services/profile-service';

export async function createProfileAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const input = createProfileSchema.parse({
    name: formData.get('name'),
    goal: formData.get('goal'),
    age: formData.get('age') ? Number(formData.get('age')) : null,
    weight: formData.get('weight') ? Number(formData.get('weight')) : null,
    height: formData.get('height') ? Number(formData.get('height')) : null,
    calorie_target: formData.get('calorie_target') ? Number(formData.get('calorie_target')) : null,
    protein_target: formData.get('protein_target') ? Number(formData.get('protein_target')) : null,
    carbs_target: formData.get('carbs_target') ? Number(formData.get('carbs_target')) : null,
    fat_target: formData.get('fat_target') ? Number(formData.get('fat_target')) : null,
  });

  return createProfile(user.id, input);
}

export async function updateProfileAction(profileId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const raw: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (value !== '') {
      raw[key] = ['age', 'weight', 'height', 'calorie_target', 'protein_target', 'carbs_target', 'fat_target'].includes(key)
        ? Number(value)
        : value;
    }
  });

  const input = updateProfileSchema.parse(raw);
  return updateProfile(profileId, user.id, input);
}

export async function switchProfileAction(profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  return switchActiveProfile(profileId, user.id);
}
