import {
  Dumbbell,
  ChevronRight,
  Clock,
  Plus,
  Users,
  Trophy,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

const programs: { name: string; icon: React.ElementType; color: string; duration: string; last: string }[] = [];

const friendActivity: { name: string; seed: string; text: string; badge?: { text: string; color: string }; hasTrophy?: boolean; detail?: string; time?: string; kcal?: string }[] = [];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Action Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-surface to-[#121212] rounded-4xl p-8 border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-brand/20 text-brand-400 rounded-full text-xs font-bold mb-2 uppercase tracking-wider">
                  Prochaine Séance
                </span>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Aucune séance prévue
                </h2>
                <p className="text-gray-400 flex items-center gap-2">
                  <Clock size={16} /> Crée ton premier programme
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center">
                  <Dumbbell className="text-white" size={32} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/workout/new"
                className="flex-1 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-orange-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:shadow-brand/20"
              >
                Démarrer maintenant <ChevronRight size={20} />
              </Link>
              <button className="px-6 py-4 rounded-2xl bg-border hover:bg-surface-hover text-white font-semibold transition-colors">
                Voir détails
              </button>
            </div>
          </div>
        </div>

        {/* Calorie Tracker Card */}
        <div className="bg-surface rounded-4xl p-6 border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-200">Calories du jour</h3>
            <Link
              href="/nutrition"
              className="p-2 hover:bg-border rounded-xl transition-colors"
            >
              <ChevronRight size={18} className="text-gray-500" />
            </Link>
          </div>

          <div className="flex items-center justify-center py-4 relative">
            <div className="w-32 h-32 rounded-full border-8 border-border flex items-center justify-center relative">
              <svg className="w-full h-full absolute top-0 left-0 -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-brand"
                  strokeDasharray="339.292"
                  strokeDashoffset="339.292"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">0</span>
                <span className="text-xs text-gray-400">kcal</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 rounded-xl bg-border/50">
              <div className="text-xs text-gray-400 mb-1">Prot</div>
              <div className="font-bold text-macro-protein">0g</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-border/50">
              <div className="text-xs text-gray-400 mb-1">Glu</div>
              <div className="font-bold text-macro-carbs">0g</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-border/50">
              <div className="text-xs text-gray-400 mb-1">Lip</div>
              <div className="font-bold text-macro-fat">0g</div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Programs Section */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-bold text-white">Mes Programmes</h3>
            <button className="text-sm text-brand hover:text-brand-400 font-medium">
              Voir tout
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((prog, i) => (
              <div
                key={i}
                className="bg-surface p-5 rounded-3xl border border-border hover:border-gray-600 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${prog.color}`}
                  >
                    <prog.icon size={20} />
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-border text-xs font-medium text-gray-400">
                    {prog.duration}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-1">{prog.name}</h4>
                <p className="text-sm text-gray-500 group-hover:text-brand transition-colors">
                  Dernier: {prog.last}
                </p>
              </div>
            ))}

            {/* Add New Card */}
            <Link
              href="/workout/new"
              className="bg-surface border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-gray-500 hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all cursor-pointer h-full min-h-[160px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium text-sm">Créer Programme</span>
            </Link>
          </div>
        </div>

        {/* Friend Activity Feed */}
        <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6">Activité Amis</h3>
          <div className="bg-surface rounded-4xl p-5 border border-border h-fit">
            {friendActivity.length === 0 ? (
              <div className="text-center py-6">
                <Users size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-sm text-gray-500">Aucune activité pour le moment</p>
                <p className="text-xs text-gray-600 mt-1">Ajoute des amis pour voir leur activité</p>
              </div>
            ) : (
              <div className="space-y-6">
                {friendActivity.map((item, i) => (
                  <div key={i}>
                    {i > 0 && <div className="w-full h-px bg-border mb-6" />}
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 relative">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                          className="rounded-full"
                          alt={item.name}
                        />
                        {item.hasTrophy && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-surface">
                            <Trophy size={10} className="text-black fill-black" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-bold text-white">{item.name}</span>{' '}
                          {item.text}
                          {item.detail && (
                            <span className="text-gray-400"> {item.detail}</span>
                          )}
                        </p>
                        {item.badge && (
                          <div className="mt-2 inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <span className="text-xs font-bold text-green-500">
                              {item.badge.text}
                            </span>
                          </div>
                        )}
                        {item.time && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.time} &bull; {item.kcal}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/social"
              className="block w-full mt-6 py-3 rounded-xl bg-border text-sm font-medium text-gray-300 hover:text-white hover:bg-surface-hover transition-colors text-center"
            >
              Voir le classement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
