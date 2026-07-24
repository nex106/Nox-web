import React, { useState } from 'react';
import { 
  Download, 
  ShieldCheck, 
  User, 
  LogOut, 
  Search, 
  Sparkles, 
  LayoutDashboard,
  Smartphone,
  Flame,
  Gamepad2,
  Wrench,
  X
} from 'lucide-react';
import { UserSession, ApkCategory } from '../types';

interface HeaderProps {
  userSession: UserSession | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onOpenDashboard: () => void;
  activeView: 'store' | 'dashboard';
  setActiveView: (view: 'store' | 'dashboard') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ApkCategory;
  setSelectedCategory: (cat: ApkCategory) => void;
  totalAppsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  userSession,
  onOpenAuthModal,
  onSignOut,
  onOpenDashboard,
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalAppsCount
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-900/30 text-slate-100 transition-all">
      {/* Top Banner / Pulse Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setActiveView('store'); setSearchQuery(''); setSelectedCategory('All'); }}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                  <Smartphone className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-indigo-300 font-mono">
                    NOX
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 rounded uppercase font-mono">
                    APK
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                  Direct Cyber App Engine
                </span>
              </div>
            </button>

            {/* View switcher nav */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveView('store')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'store'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Store Catalog
              </button>

              {userSession?.isAdmin && (
                <button
                  onClick={() => { setActiveView('dashboard'); onOpenDashboard(); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
              )}
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          {activeView === 'store' && (
            <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search APKs, games, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/60 focus:bg-slate-900 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-10 pr-9 py-2.5 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Actions & User Auth */}
          <div className="flex items-center gap-3">

            {/* Mobile Search Toggle */}
            {activeView === 'store' && (
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* User Status */}
            {userSession && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src={userSession.avatar}
                    alt={userSession.name}
                    className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
                  />
                  <div className="hidden sm:flex flex-col text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs font-bold text-slate-100">
                        {userSession.name}
                      </span>
                      {userSession.isAdmin ? (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          USER
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                      {userSession.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {userSession.isAdmin && (
                    <button
                      onClick={() => { setActiveView('dashboard'); onOpenDashboard(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold shadow-md transition-all"
                      title="Open Admin Control Center"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Console</span>
                    </button>
                  )}

                  <button
                    onClick={onSignOut}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl border border-slate-800 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Search Expanded */}
        {showMobileSearch && activeView === 'store' && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search APKs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-8 py-2 outline-none"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}



      </div>
    </header>
  );
};
