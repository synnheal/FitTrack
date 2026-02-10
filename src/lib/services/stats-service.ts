import { createServerSupabaseClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInsert = any;

export async function listPersonalRecords(profileId: string, exerciseId?: string) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('personal_records')
    .select('*, exercises:exercise_id(name, category)')
    .eq('profile_id', profileId)
    .order('achieved_at', { ascending: false });

  if (exerciseId) {
    query = query.eq('exercise_id', exerciseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listMeasurements(profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('body_measurements')
    .select('*')
    .eq('profile_id', profileId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMeasurement(profileId: string, input: {
  date: string;
  weight?: number | null;
  body_fat?: number | null;
  arms?: number | null;
  chest?: number | null;
  waist?: number | null;
  thighs?: number | null;
  photo_url?: string | null;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('body_measurements')
    .insert({
      profile_id: profileId,
      date: input.date,
      weight: input.weight ?? null,
      body_fat: input.body_fat ?? null,
      arms: input.arms ?? null,
      chest: input.chest ?? null,
      waist: input.waist ?? null,
      thighs: input.thighs ?? null,
      photo_url: input.photo_url ?? null,
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMeasurement(measurementId: string, profileId: string, input: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('body_measurements').update as any)(input as AnyInsert)
    .eq('id', measurementId)
    .eq('profile_id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMeasurement(measurementId: string, profileId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('body_measurements')
    .delete()
    .eq('id', measurementId)
    .eq('profile_id', profileId);

  if (error) throw error;
}
