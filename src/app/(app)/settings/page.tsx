'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, LogOut, Target, Flame, Dumbbell, TrendingDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const goals = [
  { value: 'bulk', label: 'Prise de masse', icon: TrendingDown, color: 'text-green-400' },
  { value: 'cut', label: 'Sèche', icon: Flame, color: 'text-orange-400' },
  { value: 'strength', label: 'Force', icon: Dumbbell, color: 'text-blue-400' },
  { value: 'maintenance', label: 'Maintien', icon: Target, color: 'text-purple-400' },
] as const;

type GoalType = 'bulk' | 'cut' | 'strength' | 'maintenance';

interface ProfileData {
  id: string;
  name: string;
  avatar_url: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: GoalType;
  calorie_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profiles');
        if (!res.ok) return;
        const profiles = await res.json();
        const active = profiles.find((p: { is_active: boolean }) => p.is_active);
        if (active) setProfile(active as ProfileData);
      } catch {
        // ignore
      }
    }
    loadProfile();
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          goal: profile.goal,
          calorie_target: profile.calorie_target,
          protein_target: profile.protein_target,
          carbs_target: profile.carbs_target,
          fat_target: profile.fat_target,
        }),
      });

      if (res.ok) {
        setMessage('Profil sauvegardé !');
      } else {
        const err = await res.json();
        setMessage(err.error || 'Erreur lors de la sauvegarde');
      }
    } catch {
      setMessage('Erreur réseau');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full border-2 border-brand p-0.5">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`}
            className="w-full h-full rounded-full bg-surface"
            alt="Avatar"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-400">Mon profil</p>
        </div>
      </div>

      {/* Informations personnelles */}
      <section className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-bold text-lg">Informations personnelles</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">Nom</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">Âge</label>
              <input
                type="number"
                value={profile.age ?? ''}
                onChange={(e) => setProfile({ ...profile, age: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
                placeholder="—"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">Poids (kg)</label>
              <input
                type="number"
                value={profile.weight ?? ''}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
                placeholder="—"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">Taille (cm)</label>
              <input
                type="number"
                value={profile.height ?? ''}
                onChange={(e) => setProfile({ ...profile, height: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
                placeholder="—"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Objectif */}
      <section className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-bold text-lg">Objectif</h2>
        <div className="grid grid-cols-2 gap-3">
          {goals.map(({ value, label, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => setProfile({ ...profile, goal: value })}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                profile.goal === value
                  ? 'border-brand bg-brand/10 text-white'
                  : 'border-border bg-background text-gray-400 hover:border-gray-600'
              }`}
            >
              <Icon size={20} className={profile.goal === value ? 'text-brand' : color} />
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Macros cibles */}
      <section className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-bold text-lg">Macros cibles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">Calories (kcal)</label>
            <input
              type="number"
              value={profile.calorie_target ?? ''}
              onChange={(e) => setProfile({ ...profile, calorie_target: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
              placeholder="—"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">Protéines (g)</label>
            <input
              type="number"
              value={profile.protein_target ?? ''}
              onChange={(e) => setProfile({ ...profile, protein_target: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
              placeholder="—"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">Glucides (g)</label>
            <input
              type="number"
              value={profile.carbs_target ?? ''}
              onChange={(e) => setProfile({ ...profile, carbs_target: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
              placeholder="—"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">Lipides (g)</label>
            <input
              type="number"
              value={profile.fat_target ?? ''}
              onChange={(e) => setProfile({ ...profile, fat_target: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none transition-colors"
              placeholder="—"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3 pb-8">
        {message && (
          <p className={`text-sm text-center ${message.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 py-3.5 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
