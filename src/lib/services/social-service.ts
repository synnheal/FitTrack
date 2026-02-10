import { createServerSupabaseClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInsert = any;

export async function listFeed(profileId: string) {
  const supabase = createServerSupabaseClient();

  // Get friend IDs
  const { data: friendships } = await supabase
    .from('friendships')
    .select('requester_id, addressee_id')
    .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`)
    .eq('status', 'accepted');

  const friendIds = (friendships ?? []).map((f: any) =>
    f.requester_id === profileId ? f.addressee_id : f.requester_id
  );
  friendIds.push(profileId);

  const { data, error } = await supabase
    .from('social_feed')
    .select('*, profiles:profile_id(name, avatar_url), social_comments(*, profiles:profile_id(name, avatar_url))')
    .in('profile_id', friendIds)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function createFeedPost(profileId: string, input: {
  type: 'workout_completed' | 'pr_achieved' | 'recipe_shared';
  reference_id: string;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('social_feed')
    .insert({ profile_id: profileId, ...input } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addComment(profileId: string, input: {
  feed_item_id: string;
  content: string;
}) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('social_comments')
    .insert({ profile_id: profileId, ...input } as AnyInsert)
    .select('*, profiles:profile_id(name, avatar_url)')
    .single();

  if (error) throw error;
  return data;
}

export async function searchProfiles(query: string, currentProfileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .ilike('name', `%${query}%`)
    .neq('id', currentProfileId)
    .eq('is_active', true)
    .limit(20);

  if (error) throw error;
  return data;
}

export async function listFriends(profileId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('friendships')
    .select('*, requester:requester_id(id, name, avatar_url), addressee:addressee_id(id, name, avatar_url)')
    .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`);

  if (error) throw error;
  return data;
}

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('friendships')
    .insert({
      requester_id: requesterId,
      addressee_id: addresseeId,
      status: 'pending',
    } as AnyInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function respondToFriendRequest(friendshipId: string, profileId: string, status: 'accepted' | 'rejected') {
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('friendships').update as any)({ status } as AnyInsert)
    .eq('id', friendshipId)
    .eq('addressee_id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
