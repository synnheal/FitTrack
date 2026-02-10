import { createServerSupabaseClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInsert = any;

export async function listWorkouts(profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_sets(*, exercises:exercise_id(name, category))')
    .eq('profile_id', profileId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getWorkout(workoutId: string, profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_sets(*, exercises:exercise_id(name, category))')
    .eq('id', workoutId)
    .eq('profile_id', profileId)
    .single();

  if (error) throw error;
  return data;
}

export async function createWorkout(profileId: string, input: {
  name: string;
  template_id?: string | null;
  started_at?: string;
  notes?: string | null;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      profile_id: profileId,
      name: input.name,
      template_id: input.template_id ?? null,
      started_at: input.started_at ?? new Date().toISOString(),
      notes: input.notes ?? null,
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWorkout(workoutId: string, profileId: string, input: {
  name?: string;
  finished_at?: string | null;
  notes?: string | null;
}) {
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('workouts').update as any)(input as AnyInsert)
    .eq('id', workoutId)
    .eq('profile_id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWorkout(workoutId: string, profileId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)
    .eq('profile_id', profileId);

  if (error) throw error;
}

export async function listWorkoutSets(workoutId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*, exercises:exercise_id(name, category)')
    .eq('workout_id', workoutId)
    .order('set_number');

  if (error) throw error;
  return data;
}

export async function createWorkoutSet(workoutId: string, input: {
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  rpe?: number | null;
  notes?: string | null;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workout_sets')
    .insert({
      workout_id: workoutId,
      exercise_id: input.exercise_id,
      set_number: input.set_number,
      reps: input.reps,
      weight: input.weight,
      rpe: input.rpe ?? null,
      notes: input.notes ?? null,
      is_pr: false,
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWorkoutSet(setId: string, workoutId: string, input: {
  reps?: number;
  weight?: number;
  rpe?: number | null;
  notes?: string | null;
  is_pr?: boolean;
}) {
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('workout_sets').update as any)(input as AnyInsert)
    .eq('id', setId)
    .eq('workout_id', workoutId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWorkoutSet(setId: string, workoutId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('workout_sets')
    .delete()
    .eq('id', setId)
    .eq('workout_id', workoutId);

  if (error) throw error;
}
