import React from 'react';
import { Download, ShieldCheck, Zap, Sparkles, Smartphone, CheckCircle, Cpu, Lock } from 'lucide-react';
import { ApkApp } from '../types';

interface HeroBannerProps {
  featuredApp: ApkApp | null;
  onDownloadApp: (app: ApkApp) => void;
  onViewDetails: (app: ApkApp) => void;
  totalDownloadsCount?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredApp,
  onDownloadApp,
  onViewDetails
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 border-b border-slate-900 py-10 sm:py-14">
      {/* Background Cyber Grid Graphic Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Cyber Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>Direct APK Repository • No Account Required</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight font-sans">
              Download Premium <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                Android APKs Directly
              </span>
            </h1>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Virus Scanned</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>No Throttle CDN</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Zero Login Needed</span>
              </div>
            </div>

            {/* Live Stats Row */}
            <div className="pt-4 border-t border-slate-900 grid grid-cols-2 gap-4 max-w-xs mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
                  100%
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Clean & Safe
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono">
                  v3.4
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Nox Engine
                </div>
              </div>
            </div>

          </div>

          {/* Featured App Showcase Card */}
          {featuredApp && (
            <div className="lg:col-span-5">
              <div className="relative group bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 hover:border-cyan-400/60 transition-all duration-300">
                
                {/* Glowing Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold tracking-widest uppercase font-mono">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Featured Release
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {featuredApp.version}
                  </span>
                </div>

                {/* App Content */}
                <div className="flex items-start gap-4">
                  <img
                    src={featuredApp.icon}
                    alt={featuredApp.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border border-slate-700 bg-slate-950 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                      {featuredApp.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">
                      {featuredApp.developer}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {featuredApp.description}
                    </p>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      📦 {featuredApp.size}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Clean
                  </span>
                </div>

                {/* Download CTA Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onViewDetails(featuredApp)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onDownloadApp(featuredApp)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-black tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download APK
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
