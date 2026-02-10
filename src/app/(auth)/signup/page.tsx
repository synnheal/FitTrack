'use client';

import { useState } from 'react';
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const goals = [
  { value: 'bulk', label: 'Prise de masse', emoji: '💪' },
  { value: 'cut', label: 'Sèche', emoji: '🔥' },
  { value: 'strength', label: 'Force', emoji: '🏋️' },
  { value: 'maintenance', label: 'Maintenance', emoji: '⚖️' },
] as const;

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<string>('bulk');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Create auth user — profile is auto-created via database trigger
    // using the metadata passed in options.data
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, goal },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-xl flex items-center justify-center">
          <Dumbbell className="text-white" size={28} />
        </div>
        <span className="text-3xl font-bold tracking-tight">
          Fit<span className="text-brand">Track</span>
        </span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-brand text-white' : 'bg-border text-gray-500'}`}>
            {step > 1 ? <Check size={16} /> : '1'}
          </div>
          <span className="text-sm text-gray-400">Compte</span>
        </div>
        <div className="w-8 h-px bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-brand text-white' : 'bg-border text-gray-500'}`}>
            2
          </div>
          <span className="text-sm text-gray-400">Profil</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-surface rounded-4xl p-8 border border-border">
        <h1 className="text-2xl font-bold mb-2">
          {step === 1 ? 'Crée ton compte' : 'Ton profil'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {step === 1
            ? 'Rejoins FitTrack et commence à tracker'
            : 'Comment tu t\'appelles et quel est ton objectif ?'}
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 caractères minimum"
                    required
                    minLength={6}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Prénom</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ton prénom"
                    required
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Objectif</label>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setGoal(g.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        goal === g.value
                          ? 'border-brand bg-brand/10 text-white'
                          : 'border-border bg-background text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-xl mb-1 block">{g.emoji}</span>
                      <span className="text-sm font-medium">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {step === 1 ? 'Continuer' : loading ? 'Création...' : 'Commencer'}
          </button>

          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Retour
            </button>
          )}
        </form>
      </div>

      {step === 1 && (
        <p className="text-center text-sm text-gray-400 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-brand hover:text-brand-400 font-medium">
            Se connecter
          </Link>
        </p>
      )}
    </div>
  );
}
