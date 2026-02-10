import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Profile } from '@/types/database';

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse(error.errors.map(e => e.message).join(', '), 400);
  }
  console.error('API error:', error);
  return errorResponse('Internal server error', 500);
}

export async function getAuthenticatedProfile(supabase: ReturnType<typeof import('@/lib/supabase/server').createServerSupabaseClient>): Promise<Profile | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  return profile;
}
