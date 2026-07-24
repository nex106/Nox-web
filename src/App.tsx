import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AppCard } from './components/AppCard';
import { AppDetailsModal } from './components/AppDetailsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { 
  getStoredApps, 
  saveApp, 
  deleteApp, 
  resetAppsToDefault, 
  getSavedSession, 
  saveSession, 
  triggerApkDownload 
} from './lib/storage';
import { ApkApp, ApkCategory, UploadFormData, UserSession } from './types';
import { SearchX, Filter, Sparkles, Smartphone } from 'lucide-react';
import { logoutGoogle } from './lib/firebase';

export default function App() {
  const [appsList, setAppsList] = useState<ApkApp[]>([]);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'dashboard'>('store');
  
  // Store Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApkCategory>('All');
  
  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAppDetails, setSelectedAppDetails] = useState<ApkApp | null>(null);

  // Load initial data on mount
  useEffect(() => {
    const loadedApps = getStoredApps();
    setAppsList(loadedApps);

    const savedUser = getSavedSession();
    if (savedUser) {
      setUserSession(savedUser);
    }
  }, []);

  // Handlers
  const handleOpenAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    saveSession(session);
    if (session.isAdmin) {
      setActiveView('dashboard');
    } else {
      setActiveView('store');
    }
  };

  const handleSignOut = () => {
    logoutGoogle();
    setUserSession(null);
    saveSession(null);
    setActiveView('store');
  };

  const handleDownloadApp = async (app: ApkApp, onProgress?: (pct: number) => void) => {
    await triggerApkDownload(app, onProgress);
    // Reload apps to refresh local download count
    const updatedApps = getStoredApps();
    setAppsList(updatedApps);
    if (selectedAppDetails) {
      const updatedSelected = updatedApps.find(a => a.id === selectedAppDetails.id);
      if (updatedSelected) {
        setSelectedAppDetails(updatedSelected);
      }
    }
  };

  const handleUpdateApp = async (appId: string, updates: Partial<ApkApp>) => {
    const currentApps = getStoredApps();
    const targetIndex = currentApps.findIndex(a => a.id === appId);
    if (targetIndex >= 0) {
      const updatedApp = { ...currentApps[targetIndex], ...updates };
      const updatedList = await saveApp(updatedApp);
      setAppsList(updatedList);
      if (selectedAppDetails && selectedAppDetails.id === appId) {
        setSelectedAppDetails(updatedApp);
      }
    }
  };

  const handleUploadNewApp = async (formData: UploadFormData) => {
    const newApp: ApkApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name,
      packageName: formData.packageName || `com.nox.${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      version: formData.version,
      size: formData.apkFile ? `${(formData.apkFile.size / (1024 * 1024)).toFixed(1)} MB` : '35.4 MB',
      sizeBytes: formData.apkFile ? formData.apkFile.size : 37120000,
      icon: formData.icon,
      category: formData.category || 'Utilities',
      description: formData.description,
      developer: formData.developer || 'Nox Developer',
      rating: 4.9,
      downloads: 1,
      uploadedAt: new Date().toISOString().split('T')[0],
      isFeatured: formData.isFeatured,
      minAndroidVersion: formData.minAndroidVersion || 'Android 8.0+',
      changelog: formData.changelog,
      screenshots: formData.screenshots && formData.screenshots.length > 0 ? formData.screenshots : [formData.icon]
    };

    const updated = await saveApp(newApp, formData.apkFile);
    setAppsList(updated);
  };

  const handleDeleteApp = async (appId: string) => {
    const updated = await deleteApp(appId);
    setAppsList(updated);
  };

  const handleResetDefaults = () => {
    const defaults = resetAppsToDefault();
    setAppsList(defaults);
  };

  // Filtered Apps List for Store
  const filteredApps = appsList.filter((app) => {
    return (
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const featuredApp = appsList.find(a => a.isFeatured) || appsList[0] || null;
  const totalDownloadsCount = appsList.reduce((acc, a) => acc + a.downloads, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        userSession={userSession}
        onOpenAuthModal={handleOpenAuthModal}
        onSignOut={handleSignOut}
        onOpenDashboard={() => setActiveView('dashboard')}
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalAppsCount={appsList.length}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'store' ? (
          <div>
            
            {/* Hero Showcase Banner */}
            {selectedCategory === 'All' && !searchQuery && (
              <HeroBanner
                featuredApp={featuredApp}
                onDownloadApp={handleDownloadApp}
                onViewDetails={(app) => setSelectedAppDetails(app)}
                totalDownloadsCount={totalDownloadsCount}
              />
            )}

            {/* Main Store Apps Grid Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              
              {/* Grid Title & Filter Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-900">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    Available APK Downloads
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select any package to download directly. No account required.
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  Showing {filteredApps.length} of {appsList.length} APK packages
                </div>
              </div>

              {/* Apps Grid */}
              {filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onDownload={handleDownloadApp}
                      onOpenDetails={(a) => setSelectedAppDetails(a)}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state when no apps match search */
                <div className="py-16 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-200">
                      No APKs found
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We couldn't find any APK files matching "{searchQuery}".
                    </p>
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Admin Dashboard View */
          userSession?.isAdmin ? (
            <AdminDashboard
              userSession={userSession}
              appsList={appsList}
              onUploadNewApp={handleUploadNewApp}
              onDeleteApp={handleDeleteApp}
              onResetDefaults={handleResetDefaults}
              onViewAppInStore={(app) => {
                setActiveView('store');
                setSelectedAppDetails(app);
              }}
              onDownloadApp={handleDownloadApp}
              onUpdateApp={handleUpdateApp}
            />
          ) : (
            /* Fallback if user navigates to dashboard without admin privileges */
            <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
                🔒
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {userSession ? 'Admin Access Restricted' : 'Sign In Required'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {userSession
                  ? `Your account (${userSession.email}) does not have administrative permissions.`
                  : 'Please sign in with Google to access application features or admin tools.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveView('store')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
                >
                  Return to Store
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* App Details Modal */}
      <AppDetailsModal
        app={selectedAppDetails}
        onClose={() => setSelectedAppDetails(null)}
        onDownload={handleDownloadApp}
      />

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
