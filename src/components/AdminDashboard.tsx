import React, { useState } from 'react';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Search, 
  HardDrive, 
  Layers, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Smartphone, 
  FileCode, 
  Sparkles,
  AlertTriangle,
  X,
  FileUp,
  Image,
  ChevronRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { ApkApp, ApkCategory, UploadFormData, UserSession } from '../types';
import { ADMIN_EMAIL } from '../lib/storage';

interface AdminDashboardProps {
  userSession: UserSession;
  appsList: ApkApp[];
  onUploadNewApp: (formData: UploadFormData) => Promise<void>;
  onDeleteApp: (appId: string) => Promise<void>;
  onResetDefaults: () => void;
  onViewAppInStore: (app: ApkApp) => void;
  onDownloadApp: (app: ApkApp) => void;
  onUpdateApp?: (appId: string, updates: Partial<ApkApp>) => Promise<void> | void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userSession,
  appsList,
  onUploadNewApp,
  onDeleteApp,
  onResetDefaults,
  onViewAppInStore,
  onDownloadApp,
  onUpdateApp
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Edit App details state
  const [editingApp, setEditingApp] = useState<ApkApp | null>(null);
  const [changelogText, setChangelogText] = useState<string>('');
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [editScreenshots, setEditScreenshots] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<UploadFormData>({
    name: '',
    packageName: '',
    version: 'v1.0.0',
    developer: 'Nox Certified Dev',
    description: '',
    minAndroidVersion: 'Android 9.0+',
    changelog: 'Initial public release.',
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    screenshots: [],
    isFeatured: true,
    apkFile: null
  });

  const presetIcons = [
    { name: 'Cyber Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
    { name: 'Sci-Fi Mech', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80' },
    { name: 'Ninja Blade', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80' },
    { name: 'Audio Synth', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80' },
    { name: 'Retro Game', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80' },
    { name: 'Ghost Network', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80' }
  ];

  const handleApkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm(prev => ({
        ...prev,
        apkFile: file,
        name: prev.name || file.name.replace(/\.apk$/i, '').replace(/[-_]/g, ' ')
      }));
    }
  };

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          icon: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const current = form.screenshots || [];
      const remainingSlots = 10 - current.length;
      if (remainingSlots <= 0) return;

      const filesToProcess = files.slice(0, remainingSlots);
      filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setForm(prev => {
              const cur = prev.screenshots || [];
              if (cur.length >= 10) return prev;
              return {
                ...prev,
                screenshots: [...cur, reader.result as string]
              };
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setForm(prev => ({
      ...prev,
      screenshots: (prev.screenshots || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) return;

    setIsSubmitting(true);
    try {
      await onUploadNewApp(form);
      setIsSubmitting(false);
      setShowUploadModal(false);
      
      // Reset form
      setForm({
        name: '',
        packageName: '',
        version: 'v1.0.0',
        developer: 'Nox Certified Dev',
        description: '',
        minAndroidVersion: 'Android 9.0+',
        changelog: 'Initial public release.',
        icon: presetIcons[0].url,
        screenshots: [],
        isFeatured: false,
        apkFile: null
      });

      setSuccessBanner(`Successfully published new APK "${form.name}"!`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error('Upload error:', err);
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    await onDeleteApp(id);
    setDeletingId(null);
    setSuccessBanner('App package deleted successfully.');
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  const handleStartEditApp = (app: ApkApp) => {
    setEditingApp(app);
    setChangelogText(app.changelog || '');
    setDescriptionText(app.description || '');
    setEditScreenshots(app.screenshots || []);
  };

  const handleEditScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const remainingSlots = 10 - editScreenshots.length;
      if (remainingSlots <= 0) return;

      const filesToProcess = files.slice(0, remainingSlots);
      filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setEditScreenshots(prev => {
              if (prev.length >= 10) return prev;
              return [...prev, reader.result as string];
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveEditScreenshot = (index: number) => {
    setEditScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAppEdits = async () => {
    if (!editingApp) return;
    if (onUpdateApp) {
      await onUpdateApp(editingApp.id, {
        changelog: changelogText,
        description: descriptionText,
        screenshots: editScreenshots
      });
    }
    setSuccessBanner(`Updated details for "${editingApp.name}"`);
    setTimeout(() => setSuccessBanner(null), 3000);
    setEditingApp(null);
  };

  // Metrics
  const totalDownloads = appsList.reduce((acc, a) => acc + a.downloads, 0);
  const featuredCount = appsList.filter(a => a.isFeatured).length;

  const filteredApps = appsList.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 font-sans tracking-tight">
              Admin Console
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full font-mono uppercase">
              {userSession.email}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish new Android APK binaries, edit catalog metadata, and manage platform storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Upload New APK
          </button>

          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-colors"
            title="Reset catalog to seed default APKs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Published APKs</span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {appsList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {featuredCount} Featured Releases
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Download Traffic</span>
            <Download className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Direct unthrottled CDN hits
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Admin Session</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono truncate">
            {ADMIN_EMAIL}
          </div>
          <div className="text-[11px] text-slate-500">
            Authorized Root Privileges
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Storage Storage Engine</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            IndexedDB + Local
          </div>
          <div className="text-[11px] text-slate-500">
            Persistent browser file blob storage
          </div>
        </div>

      </div>

      {/* APK Table / List Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Uploaded Package Catalog ({filteredApps.length})
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search uploaded APKs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2 outline-none"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">App Info</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* App Info */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-100 truncate text-xs">
                          {app.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          {app.packageName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Version */}
                  <td className="py-3.5 px-4 text-slate-300 font-bold">
                    {app.version}
                  </td>

                  {/* Size */}
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    {app.size}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      
                      <button
                        onClick={() => handleStartEditApp(app)}
                        className="px-2.5 py-1.5 bg-slate-950 hover:bg-cyan-950/60 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Edit App Details & Screenshots"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit App Info</span>
                      </button>

                      <button
                        onClick={() => onViewAppInStore(app)}
                        className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
                        title="View Store Page"
                      >
                        Preview
                      </button>

                      <button
                        onClick={() => onDownloadApp(app)}
                        className="p-1.5 bg-slate-950 hover:bg-cyan-950/60 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-colors"
                        title="Download APK File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingId(app.id)}
                        className="p-1.5 bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 rounded-lg transition-colors"
                        title="Delete App Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans text-xs">
                    No matching APK applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold">Confirm APK Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this APK package? This action cannot be undone and will remove it from the public Nox store catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-100 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20"
              >
                Yes, Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload APK Form Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
            
            {/* Header Glow */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-teal-400" />

            {/* Close */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-950/60 rounded-full border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div>
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  Publish New APK Package
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload an .apk file or configure app metadata for direct user downloads.
                </p>
              </div>

              {/* File Upload Box for .apk */}
              <div className="border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 rounded-2xl p-5 text-center space-y-2 relative hover:border-cyan-400 transition-colors">
                <input
                  type="file"
                  accept=".apk"
                  onChange={handleApkFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <FileUp className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="text-xs font-bold text-slate-200">
                  {form.apkFile ? (
                    <span className="text-cyan-300 font-mono">
                      Selected File: {form.apkFile.name} ({(form.apkFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  ) : (
                    'Click or Drag & Drop .APK file here'
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Supports Android APK package files (.apk)
                </p>
              </div>

              {/* Name & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    App Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Runner Pro"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Version Tag *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v2.1.0"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Developer */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Developer Studio
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nox Cyber Labs"
                  value={form.developer}
                  onChange={(e) => setForm({ ...form, developer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  App Description / Overview *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write text about your app (will be displayed in the app preview for users)..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl p-3 outline-none leading-relaxed"
                />
              </div>

              {/* Screenshots Upload (Less than 10 images) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    App Screenshots (Upload up to 10 images)
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                    {(form.screenshots || []).length} / 10
                  </span>
                </div>

                {(form.screenshots || []).length < 10 && (
                  <div className="border border-slate-800 bg-slate-950/60 hover:bg-slate-950 rounded-xl p-3 text-center border-dashed hover:border-cyan-500/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleScreenshotsUpload}
                      className="hidden"
                      id="uploadScreenshotsInput"
                    />
                    <label htmlFor="uploadScreenshotsInput" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-cyan-400 font-bold">
                      <Image className="w-4 h-4 text-cyan-400" />
                      <span>Click to Select Screenshots ({10 - (form.screenshots || []).length} remaining)</span>
                    </label>
                  </div>
                )}

                {(form.screenshots || []).length > 0 && (
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {(form.screenshots || []).map((src, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-square">
                        <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                          title="Remove Screenshot"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* App Icon Selector or Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  App Icon (Select preset or upload image)
                </label>

                <div className="flex items-center gap-3">
                  <img
                    src={form.icon}
                    alt="Preview Icon"
                    className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-cyan-500/50 shrink-0"
                  />
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileChange}
                      className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-950 file:text-cyan-400 hover:file:bg-slate-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
                  <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0">Presets:</span>
                  {presetIcons.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setForm({ ...form, icon: p.url })}
                      className={`shrink-0 p-1 rounded-lg border transition-all ${
                        form.icon === p.url ? 'border-cyan-400 bg-cyan-950' : 'border-slate-800 bg-slate-950 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-7 h-7 rounded-md object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Feature this app on Nox Store Hero Banner
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isSubmitting ? 'Publishing Package...' : 'Publish APK to Nox Store'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Edit App Info Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 space-y-4 text-slate-100 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-base">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <span>Edit App Info — {editingApp.name}</span>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-950 rounded-full border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description / About text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">
                App Description (Preview Overview)
              </label>
              <textarea
                rows={3}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                placeholder="Write text about your app..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl p-3 outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Release Notes / What's New */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">
                What's New (Release Notes)
              </label>
              <textarea
                rows={3}
                value={changelogText}
                onChange={(e) => setChangelogText(e.target.value)}
                placeholder="Describe new features and improvements..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl p-3 outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Edit Screenshots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 block">
                  App Screenshots (Up to 10)
                </label>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {editScreenshots.length} / 10
                </span>
              </div>

              {editScreenshots.length < 10 && (
                <div className="border border-slate-800 bg-slate-950/60 hover:bg-slate-950 rounded-xl p-3 text-center border-dashed hover:border-cyan-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditScreenshotsUpload}
                    className="hidden"
                    id="editScreenshotsInput"
                  />
                  <label htmlFor="editScreenshotsInput" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-cyan-400 font-bold">
                    <Image className="w-4 h-4 text-cyan-400" />
                    <span>Upload New Screenshots ({10 - editScreenshots.length} remaining)</span>
                  </label>
                </div>
              )}

              {editScreenshots.length > 0 && (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {editScreenshots.map((src, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-square">
                      <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditScreenshot(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAppEdits}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 transition-all"
              >
                Save App Info
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
