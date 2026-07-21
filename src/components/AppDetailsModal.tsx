import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Smartphone, 
  Calendar, 
  HardDrive, 
  Layers, 
  CheckCircle,
  ExternalLink,
  Loader2,
  FileCode,
  Sparkles
} from 'lucide-react';
import { ApkApp } from '../types';

interface AppDetailsModalProps {
  app: ApkApp | null;
  onClose: () => void;
  onDownload: (app: ApkApp, onProgress?: (pct: number) => void) => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  app,
  onClose,
  onDownload
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'changelog'>('about');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!app) return null;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setProgress(10);

    try {
      await onDownload(app, (pct) => setProgress(pct));
      setDownloadDone(true);
      setTimeout(() => {
        setDownloadDone(false);
        setDownloading(false);
        setProgress(0);
      }, 3500);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Glow accent header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-teal-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-950/60 hover:bg-slate-800 rounded-full border border-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-6">
          
          {/* Main App Header Box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={app.icon}
              alt={app.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-950 border border-slate-800 shadow-xl shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
              }}
            />

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full uppercase tracking-wider font-mono">
                  {app.category}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono text-slate-300 bg-slate-950 rounded border border-slate-800">
                  {app.version}
                </span>
                {app.isFeatured && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase font-mono">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-100 tracking-tight leading-snug">
                {app.name}
              </h2>

              <p className="text-xs font-medium text-cyan-400 font-mono">
                {app.developer} • <span className="text-slate-400">{app.packageName}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">File Size</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{app.size}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Security</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>

          {/* Action Download CTA */}
          <div className="space-y-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden ${
                downloadDone
                  ? 'bg-emerald-600 text-slate-100'
                  : downloading
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50'
                  : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 shadow-cyan-500/25'
              }`}
            >
              {downloading && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-cyan-400/20 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              )}

              {downloadDone ? (
                <>
                  <CheckCircle className="w-5 h-5 text-slate-100" />
                  <span>APK Downloaded Successfully!</span>
                </>
              ) : downloading ? (
                <>
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span>Generating APK Package ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-slate-950" />
                  <span>Download APK File ({app.size})</span>
                </>
              )}
            </button>
            
            <p className="text-[11px] text-center text-slate-500">
              Direct download link • No sign up required • Scanned for malware
            </p>
          </div>

          {/* Tabs navigation */}
          <div className="flex border-b border-slate-800 gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              About & Screenshots
            </button>
            <button
              onClick={() => setActiveTab('changelog')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'changelog'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              What's New
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {app.description}
              </p>

              {app.screenshots && app.screenshots.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>App Preview Screenshots ({app.screenshots.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Click image to expand</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {app.screenshots.map((src, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewImage(src)}
                        className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden cursor-pointer aspect-video sm:aspect-square hover:border-cyan-500/50 transition-all shadow-md"
                      >
                        <img
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                          <span className="text-[10px] font-bold text-cyan-300 opacity-0 group-hover:opacity-100 bg-slate-900/90 px-2 py-1 rounded-md border border-cyan-500/30 transition-opacity">
                            View Fullscreen
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Version {app.version} Release Notes</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {app.changelog || 'General performance enhancements, bug fixes, and security patches.'}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-900 text-slate-100 rounded-full border border-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Screenshot Lightbox Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
