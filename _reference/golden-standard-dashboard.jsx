import React, { useState } from 'react';
import { 
  Dumbbell, 
  Utensils, 
  BarChart2, 
  Users, 
  Plus, 
  ChevronRight, 
  Flame, 
  Trophy,
  Clock,
  Settings,
  Search,
  Bell,
  Menu,
  LogOut
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('gym');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Items
  const navItems = [
    { id: 'gym', icon: Dumbbell, label: 'Entraînement' },
    { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
    { id: 'stats', icon: BarChart2, label: 'Statistiques' },
    { id: 'social', icon: Users, label: 'Communauté' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-72 flex-col bg-[#09090b] border-r border-[#27272a] p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center">
            <Dumbbell className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Fit<span className="text-orange-500">Track</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-orange-500/10 text-orange-500' 
                  : 'text-gray-400 hover:bg-[#1c1c1e] hover:text-white'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-orange-500' : 'text-gray-500 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-[#27272a]">
          <button className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full rounded-xl hover:bg-[#1c1c1e]">
            <Settings size={20} />
            <span>Paramètres</span>
          </button>
          <button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full rounded-xl hover:bg-[#1c1c1e] mt-1">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header Desktop & Mobile */}
        <header className="px-6 py-6 md:px-10 md:py-8 flex justify-between items-center bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#27272a] md:border-none">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Button */}
             <button className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Bonjour, <span className="text-orange-500">Luc</span> 👋</h1>
              <p className="text-sm text-gray-400 hidden md:block">Prêt à exploser tes records aujourd'hui ?</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center bg-[#1c1c1e] rounded-full px-4 py-2.5 border border-[#27272a] focus-within:border-orange-500/50 transition-colors w-64">
              <Search size={18} className="text-gray-500" />
              <input type="text" placeholder="Rechercher..." className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder-gray-500" />
            </div>
            
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#09090b]"></span>
            </button>

            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-500 p-0.5 cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luc" className="w-full h-full rounded-full bg-[#1c1c1e]" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-28 md:pb-10 no-scrollbar">
          
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Action Card (Span 2 cols on Desktop) */}
              <div className="lg:col-span-2 bg-gradient-to-br from-[#1c1c1e] to-[#121212] rounded-[32px] p-8 border border-[#27272a] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold mb-2 uppercase tracking-wider">Prochaine Séance</span>
                      <h2 className="text-3xl font-bold text-white mb-1">Leg Day - Hypertrophie</h2>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Clock size={16} /> 1h 15min • Intensité Élevée
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="w-16 h-16 bg-[#27272a] rounded-2xl flex items-center justify-center">
                        <Dumbbell className="text-white" size={32} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-orange-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:shadow-orange-500/20">
                      Démarrer maintenant <ChevronRight size={20} />
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-[#27272a] hover:bg-[#323238] text-white font-semibold transition-colors">
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Summary Card (Span 1 col) */}
              <div className="bg-[#1c1c1e] rounded-[32px] p-6 border border-[#27272a] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-200">Calories du jour</h3>
                  <button className="p-2 hover:bg-[#27272a] rounded-xl transition-colors"><ChevronRight size={18} className="text-gray-500" /></button>
                </div>
                
                <div className="flex items-center justify-center py-4 relative">
                   {/* Fake Circular Progress */}
                   <div className="w-32 h-32 rounded-full border-8 border-[#27272a] flex items-center justify-center relative">
                      <svg className="w-full h-full absolute top-0 left-0 transform -rotate-90 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                        <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-orange-500" strokeDasharray="339.292" strokeDashoffset="60" strokeLinecap="round" />
                      </svg>
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-white">1,950</span>
                        <span className="text-xs text-gray-400">kcal</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 rounded-xl bg-[#27272a]/50">
                    <div className="text-xs text-gray-400 mb-1">Prot</div>
                    <div className="font-bold text-orange-400">120g</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[#27272a]/50">
                    <div className="text-xs text-gray-400 mb-1">Glu</div>
                    <div className="font-bold text-yellow-400">210g</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[#27272a]/50">
                    <div className="text-xs text-gray-400 mb-1">Lip</div>
                    <div className="font-bold text-red-400">60g</div>
                  </div>
                </div>
              </div>

            </div>

            {/* DASHBOARD GRID CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              
              {/* Templates Section (Takes 2 or 3 cols) */}
              <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-xl font-bold text-white">Mes Programmes</h3>
                  <button className="text-sm text-orange-500 hover:text-orange-400 font-medium">Voir tout</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['PPL - Push', 'Full Body', 'Upper Power'].map((prog, i) => (
                    <div key={i} className="bg-[#1c1c1e] p-5 rounded-[24px] border border-[#27272a] hover:border-gray-600 cursor-pointer transition-all group">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i===0 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {i===0 ? <Dumbbell size={20} /> : <Users size={20} />}
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-[#27272a] text-xs font-medium text-gray-400">1h 15</span>
                      </div>
                      <h4 className="font-bold text-lg mb-1">{prog}</h4>
                      <p className="text-sm text-gray-500 group-hover:text-orange-400 transition-colors">Dernier: Hier</p>
                    </div>
                  ))}
                  
                  {/* Add New Card */}
                  <div className="bg-[#1c1c1e] border-2 border-dashed border-[#27272a] rounded-[24px] flex flex-col items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer h-full min-h-[160px]">
                    <Plus size={32} className="mb-2" />
                    <span className="font-medium text-sm">Créer Programme</span>
                  </div>
                </div>
              </div>

              {/* Social / Activity Feed (Takes 1 col) */}
              <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
                <h3 className="text-xl font-bold text-white mb-6">Activité Amis</h3>
                <div className="bg-[#1c1c1e] rounded-[32px] p-5 border border-[#27272a] h-fit">
                   <div className="space-y-6">
                      
                      {/* Item 1 */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 relative">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="rounded-full" />
                           <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-[#1c1c1e]"><Trophy size={10} className="text-black fill-black" /></div>
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-bold text-white">Alex</span> a battu son record au DC!</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <span className="text-xs font-bold text-green-500">110kg x 5 🔥</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-px bg-[#27272a]"></div>

                      {/* Item 2 */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 relative">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Max" className="rounded-full" />
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-bold text-white">Max</span> a terminé <span className="text-gray-400">PPL - Pull</span></p>
                          <p className="text-xs text-gray-500 mt-1">Il y a 2h • 450 kcal</p>
                        </div>
                      </div>

                   </div>
                   <button className="w-full mt-6 py-3 rounded-xl bg-[#27272a] text-sm font-medium text-gray-300 hover:text-white hover:bg-[#323238] transition-colors">
                     Voir le classement
                   </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* --- MOBILE BOTTOM NAV (Visible only on Mobile) --- */}
        <div className="md:hidden absolute bottom-0 left-0 w-full bg-[#09090b]/90 backdrop-blur-xl border-t border-[#27272a] pb-6 pt-2 px-6 z-30">
          <div className="flex justify-between items-center">
            <MobileNavIcon icon={Dumbbell} label="Gym" active={activeTab === 'gym'} onClick={() => setActiveTab('gym')} />
            <MobileNavIcon icon={Utensils} label="Nutri" active={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} />
            
            <div className="relative -top-6">
              <button className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center text-white border-4 border-[#09090b]">
                <Plus size={28} />
              </button>
            </div>

            <MobileNavIcon icon={BarChart2} label="Stats" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
            <MobileNavIcon icon={Users} label="Social" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
          </div>
        </div>

      </main>
    </div>
  );
}

function MobileNavIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <Icon size={22} className={active ? 'text-white' : 'text-gray-500'} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] ${active ? 'text-white font-medium' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}