'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Check, X, Clock, Search, Trophy, Flame, ChevronRight, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FriendProfile {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requester: FriendProfile;
  addressee: FriendProfile;
}

interface FeedItem {
  id: string;
  type: string;
  reference_id: string;
  created_at: string;
  profiles: { name: string; avatar_url: string | null };
}

interface SearchResult {
  id: string;
  name: string;
  avatar_url: string | null;
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
  return (
    <img
      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
      className={`${px} rounded-full bg-surface flex-shrink-0`}
      alt={name}
    />
  );
}

export default function SocialPage() {
  const [myProfileId, setMyProfileId] = useState('');
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Load profile ID
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profiles');
        if (!res.ok) return;
        const profiles = await res.json();
        const active = profiles.find((p: { is_active: boolean }) => p.is_active);
        if (active) setMyProfileId(active.id);
      } catch {
        // ignore
      }
    }
    loadProfile();
  }, []);

  // Load friends and feed
  const loadFriends = useCallback(async () => {
    const res = await fetch('/api/social/friends');
    if (res.ok) {
      const data = await res.json();
      setFriendships(data);
    }
  }, []);

  const loadFeed = useCallback(async () => {
    const res = await fetch('/api/social/feed');
    if (res.ok) {
      const data = await res.json();
      setFeed(data);
    }
  }, []);

  useEffect(() => {
    if (!myProfileId) return;
    loadFriends();
    loadFeed();
  }, [myProfileId, loadFriends, loadFeed]);

  // Search users
  async function handleSearch(q: string) {
    setSearchQuery(q);
    if (q.length < 1) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/social/search-users?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } finally {
      setSearching(false);
    }
  }

  // Send friend request
  async function addFriend(addresseeId: string) {
    setLoadingAction(addresseeId);
    try {
      await fetch('/api/social/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressee_id: addresseeId }),
      });
      await loadFriends();
      setSearchResults((prev) => prev.filter((r) => r.id !== addresseeId));
    } finally {
      setLoadingAction(null);
    }
  }

  // Respond to friend request
  async function respondRequest(friendshipId: string, status: 'accepted' | 'rejected') {
    setLoadingAction(friendshipId);
    try {
      await fetch(`/api/social/friends/${friendshipId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await loadFriends();
      await loadFeed();
    } finally {
      setLoadingAction(null);
    }
  }

  // Categorize friendships
  const acceptedFriends = friendships.filter((f) => f.status === 'accepted');
  const pendingReceived = friendships.filter((f) => f.status === 'pending' && f.addressee_id === myProfileId);
  const pendingSent = friendships.filter((f) => f.status === 'pending' && f.requester_id === myProfileId);

  // IDs already in friendships (to exclude from search)
  const friendProfileIds = new Set(
    friendships.map((f) => (f.requester_id === myProfileId ? f.addressee_id : f.requester_id))
  );
  const filteredSearch = searchResults.filter((r) => !friendProfileIds.has(r.id));

  function getFriendName(f: Friendship): string {
    return f.requester_id === myProfileId ? f.addressee.name : f.requester.name;
  }

  function formatTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
  }

  const feedTypeLabels: Record<string, string> = {
    workout_completed: 'a terminé un entraînement',
    pr_achieved: 'a battu un record personnel',
    recipe_shared: 'a partagé une recette',
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Communauté</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Friends + Search */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add friend - Search */}
          <Card>
            <CardContent>
              <h3 className="font-bold text-lg mb-4">Ajouter un ami</h3>
              <div className="flex items-center bg-background rounded-xl px-4 py-2.5 border border-border focus-within:border-brand/50 transition-colors">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder-gray-500"
                />
              </div>

              {searching && (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {filteredSearch.length > 0 && (
                <div className="mt-3 space-y-2">
                  {filteredSearch.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-border/50 transition-colors">
                      <Avatar name={user.name} size="sm" />
                      <span className="flex-1 font-medium text-sm truncate">{user.name}</span>
                      <button
                        onClick={() => addFriend(user.id)}
                        disabled={loadingAction === user.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand rounded-lg text-xs font-medium hover:bg-brand/20 transition-colors disabled:opacity-50"
                      >
                        <UserPlus size={14} />
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery.length > 0 && !searching && filteredSearch.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Aucun résultat</p>
              )}
            </CardContent>
          </Card>

          {/* Pending received */}
          {pendingReceived.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="font-bold text-lg mb-4">Demandes reçues</h3>
                <div className="space-y-2">
                  {pendingReceived.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-border/50 transition-colors">
                      <Avatar name={f.requester.name} size="sm" />
                      <span className="flex-1 font-medium text-sm truncate">{f.requester.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondRequest(f.id, 'accepted')}
                          disabled={loadingAction === f.id}
                          className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => respondRequest(f.id, 'rejected')}
                          disabled={loadingAction === f.id}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My friends */}
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Mes amis</h3>
                <span className="text-sm text-gray-500">{acceptedFriends.length}</span>
              </div>

              {acceptedFriends.length === 0 && pendingSent.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={32} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">Aucun ami pour le moment</p>
                  <p className="text-xs text-gray-600 mt-1">Recherche des utilisateurs pour les ajouter</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {acceptedFriends.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-border/50 transition-colors">
                      <Avatar name={getFriendName(f)} size="sm" />
                      <span className="flex-1 font-medium text-sm truncate">{getFriendName(f)}</span>
                    </div>
                  ))}
                  {pendingSent.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl opacity-60">
                      <Avatar name={f.addressee.name} size="sm" />
                      <span className="flex-1 font-medium text-sm truncate">{f.addressee.name}</span>
                      <span className="flex items-center gap-1 text-xs text-yellow-500">
                        <Clock size={12} />
                        En attente
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Activity Feed */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent>
              <h3 className="font-bold text-lg mb-6">Fil d&apos;activité</h3>

              {feed.length === 0 ? (
                <div className="text-center py-8">
                  <Flame size={32} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">Aucune activité récente</p>
                  <p className="text-xs text-gray-600 mt-1">L&apos;activité de tes amis apparaîtra ici</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {feed.map((item, i) => (
                    <div key={item.id}>
                      {i > 0 && <div className="w-full h-px bg-border mb-6" />}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 relative">
                          <Avatar name={item.profiles?.name ?? 'User'} />
                          {item.type === 'pr_achieved' && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-surface">
                              <Trophy size={10} className="text-black fill-black" />
                            </div>
                          )}
                          {item.type === 'workout_completed' && (
                            <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5 border-2 border-surface">
                              <Flame size={10} className="text-black fill-black" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-bold text-white">{item.profiles?.name ?? 'Utilisateur'}</span>{' '}
                            <span className="text-gray-400">{feedTypeLabels[item.type] ?? item.type}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(item.created_at)}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-600 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
