import { createServerSupabaseClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInsert = any;

export async function listProfiles(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function getActiveProfile(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(userId: string, input: {
  name: string;
  avatar_url?: string | null;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  goal: 'bulk' | 'cut' | 'strength' | 'maintenance';
  calorie_target?: number | null;
  protein_target?: number | null;
  carbs_target?: number | null;
  fat_target?: number | null;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      name: input.name,
      avatar_url: input.avatar_url ?? null,
      age: input.age ?? null,
      weight: input.weight ?? null,
      height: input.height ?? null,
      goal: input.goal,
      calorie_target: input.calorie_target ?? null,
      protein_target: input.protein_target ?? null,
      carbs_target: input.carbs_target ?? null,
      fat_target: input.fat_target ?? null,
      is_active: true,
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(profileId: string, userId: string, input: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('profiles').update as any)(input as AnyInsert)
    .eq('id', profileId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function switchActiveProfile(profileId: string, userId: string) {
  const supabase = createServerSupabaseClient();

  // Deactivate all profiles for this user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: deactivateError } = await (supabase.from('profiles').update as any)({ is_active: false } as AnyInsert)
    .eq('user_id', userId);

  if (deactivateError) throw deactivateError;

  // Activate the selected one
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('profiles').update as any)({ is_active: true } as AnyInsert)
    .eq('id', profileId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
