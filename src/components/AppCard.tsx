import React, { useState } from 'react';
import { Download, CheckCircle, Smartphone, ArrowDownToLine, Loader2, Info } from 'lucide-react';
import { ApkApp } from '../types';

interface AppCardProps {
  app: ApkApp;
  onDownload: (app: ApkApp, onProgress?: (pct: number) => void) => void;
  onOpenDetails: (app: ApkApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onDownload, onOpenDetails }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;

    setDownloading(true);
    setProgress(10);

    try {
      await onDownload(app, (pct) => setProgress(pct));
      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
        setDownloading(false);
        setProgress(0);
      }, 3000);
    } catch (err) {
      console.error('Download error:', err);
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div 
      onClick={() => onOpenDetails(app)}
      className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Top Accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* App Icon + Header Info */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={app.icon}
              alt={app.name}
              className="w-14 h-14 rounded-2xl object-cover bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform duration-300 shadow-md"
              onError={(e) => {
                // Fallback icon placeholder if image fails
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
              }}
            />
            {app.isFeatured && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
                HOT
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {app.category}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {app.version}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate mt-0.5">
              {app.name}
            </h4>

            <p className="text-[11px] text-slate-400 truncate">
              {app.developer}
            </p>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
          {app.description}
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="font-mono text-cyan-400 font-bold">
            {app.version}
          </div>

          <div className="font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
            {app.size}
          </div>
        </div>
      </div>

      {/* Direct APK Download Button */}
      <div className="mt-4 pt-2">
        <button
          onClick={handleDownloadClick}
          disabled={downloading}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
            downloadComplete
              ? 'bg-emerald-600 text-slate-100 shadow-md shadow-emerald-600/30'
              : downloading
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-950 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-transparent shadow-md hover:shadow-cyan-500/20'
          }`}
        >
          {/* Progress bar background during active download */}
          {downloading && (
            <div 
              className="absolute left-0 top-0 bottom-0 bg-cyan-500/20 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          )}

          {downloadComplete ? (
            <>
              <CheckCircle className="w-4 h-4 text-slate-100" />
              <span>APK Downloaded!</span>
            </>
          ) : downloading ? (
            <>
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Fetching APK ({progress}%)...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-cyan-400 group-hover:text-slate-950 transition-colors" />
              <span>Download APK</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
