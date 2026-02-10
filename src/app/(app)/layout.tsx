'use client';

import { useState, useEffect } from 'react';
import {
  Dumbbell,
  Utensils,
  BarChart2,
  Users,
  Plus,
  Settings,
  Search,
  Bell,
  Menu,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { id: 'dashboard', href: '/dashboard', icon: Dumbbell, label: 'Entraînement' },
  { id: 'nutrition', href: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { id: 'stats', href: '/stats', icon: BarChart2, label: 'Statistiques' },
  { id: 'social', href: '/social', icon: Users, label: 'Communauté' },
];

function MobileNavIcon({
  icon: Icon,
  label,
  active,
  href,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1">
      <Icon
        size={22}
        className={active ? 'text-white' : 'text-gray-500'}
        strokeWidth={active ? 2.5 : 2}
      />
      <span className={`text-[10px] ${active ? 'text-white font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('User');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profiles');
        if (!res.ok) return;
        const profiles = await res.json();
        const active = profiles.find((p: { is_active: boolean }) => p.is_active);
        if (active) {
          setUserName(active.name);
          setAvatarSeed(active.name);
        }
      } catch {
        // ignore
      }
    }
    loadProfile();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const activeTab = navItems.find((item) => pathname.startsWith(item.href))?.id ?? 'dashboard';

  return (
    <div className="min-h-screen bg-background text-white font-sans flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-background border-r border-border p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-xl flex items-center justify-center">
            <Dumbbell className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Fit<span className="text-brand">Track</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group',
                activeTab === item.id
                  ? 'bg-brand/10 text-brand'
                  : 'text-gray-400 hover:bg-surface hover:text-white'
              )}
            >
              <item.icon
                size={22}
                className={activeTab === item.id ? 'text-brand' : 'text-gray-500 group-hover:text-white'}
              />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-border">
          <Link
            href="/settings"
            className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full rounded-xl hover:bg-surface"
          >
            <Settings size={20} />
            <span>Paramètres</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full rounded-xl hover:bg-surface mt-1"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="px-6 py-6 md:px-10 md:py-8 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-20 border-b border-border md:border-none">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Bonjour, <span className="text-brand">{userName || '...'}</span> 👋
              </h1>
              <p className="text-sm text-gray-400 hidden md:block">
                Prêt à exploser tes records aujourd&apos;hui ?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center bg-surface rounded-full px-4 py-2.5 border border-border focus-within:border-brand/50 transition-colors w-64">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder-gray-500"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-background" />
            </button>
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand p-0.5 cursor-pointer"
              onClick={() => router.push('/settings')}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`}
                className="w-full h-full rounded-full bg-surface"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-28 md:pb-10 no-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden absolute bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t border-border pb-6 pt-2 px-6 z-30">
          <div className="flex justify-between items-center">
            <MobileNavIcon
              icon={Dumbbell}
              label="Gym"
              active={activeTab === 'dashboard'}
              href="/dashboard"
            />
            <MobileNavIcon
              icon={Utensils}
              label="Nutri"
              active={activeTab === 'nutrition'}
              href="/nutrition"
            />
            <div className="relative -top-6">
              <Link
                href="/workout/new"
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center text-white border-4 border-background"
              >
                <Plus size={28} />
              </Link>
            </div>
            <MobileNavIcon
              icon={BarChart2}
              label="Stats"
              active={activeTab === 'stats'}
              href="/stats"
            />
            <MobileNavIcon
              icon={Users}
              label="Social"
              active={activeTab === 'social'}
              href="/social"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
