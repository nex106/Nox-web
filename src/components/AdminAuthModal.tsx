import React, { useState } from 'react';
import { X, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { ADMIN_EMAIL } from '../lib/storage';
import { UserSession } from '../types';
import { loginWithGoogle } from '../lib/firebase';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const googleUser = await loginWithGoogle();
      setLoading(false);

      if (!googleUser.email) {
        setErrorMsg('Could not retrieve email from Google Account.');
        return;
      }

      const cleanEmail = googleUser.email.trim().toLowerCase();
      const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

      const userSession: UserSession = {
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        isAdmin: isAdmin,
        loggedInAt: new Date().toISOString()
      };

      onLoginSuccess(userSession);
      onClose();
    } catch (err: any) {
      setLoading(false);
      console.error('Google Sign In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in window was closed before completion.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked by browser. Please allow popups.');
      } else {
        setErrorMsg(err?.message || 'Google Sign-In failed. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Top Glow bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-950/60 hover:bg-slate-800 rounded-full border border-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-100 tracking-tight">
              Sign In with Google
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Sign in with your Google account. Admin privileges are granted to <span className="text-cyan-300 font-mono font-bold">obyda.cmch@gmail.com</span>.
            </p>
          </div>

          {/* Access Denied Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/90 border border-rose-500/50 rounded-xl flex items-start gap-3 text-rose-200 text-xs animate-shake">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-rose-300 block">
                  Access Denied
                </span>
                <p className="leading-normal">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Direct Google Sign In Action */}
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-sm font-bold transition-all shadow-xl hover:shadow-cyan-500/10 flex items-center justify-between group cursor-pointer disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                {/* Google Logo SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>

                <div className="text-left">
                  <div className="font-extrabold text-slate-900 leading-snug">
                    {loading ? 'Authenticating...' : 'Sign in with Google'}
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center font-mono pt-2">
            Nox Authentication Gateway • Restricted Access Control
          </p>

        </div>

      </div>
    </div>
  );
};

