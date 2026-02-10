'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedProfile } from '@/lib/api-utils';
import { createWorkoutSchema, createWorkoutSetSchema } from '@/lib/validations/workout';
import { createWorkout, updateWorkout, createWorkoutSet } from '@/lib/services/workout-service';

export async function startWorkoutAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) throw new Error('Unauthorized');

  const input = createWorkoutSchema.parse({
    name: formData.get('name'),
    template_id: formData.get('template_id') || null,
  });

  return createWorkout(profile.id, input);
}

export async function finishWorkoutAction(workoutId: string) {
  const supabase = createServerSupabaseClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) throw new Error('Unauthorized');

  return updateWorkout(workoutId, profile.id, {
    finished_at: new Date().toISOString(),
  });
}

export async function addSetAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) throw new Error('Unauthorized');

  const workoutId = formData.get('workout_id') as string;
  const input = createWorkoutSetSchema.parse({
    exercise_id: formData.get('exercise_id'),
    set_number: Number(formData.get('set_number')),
    reps: Number(formData.get('reps')),
    weight: Number(formData.get('weight')),
    rpe: formData.get('rpe') ? Number(formData.get('rpe')) : null,
    notes: formData.get('notes') || null,
  });

  return createWorkoutSet(workoutId, input);
}
