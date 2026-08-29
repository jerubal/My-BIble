'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration failed:', err));
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed it recently
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-40 max-w-sm w-full animate-slideDown">
      <div className="bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--gold-border)] rounded-2xl p-4 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--gold-gradient)] text-[#241c08] flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              Install Multilingual Bible App
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              Read offline anytime with zero internet connection on your home screen.
            </p>

            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--gold-gradient)] hover:brightness-105 active:scale-95 text-[#241c08] text-xs font-bold shadow-md transition-all inline-flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-muted)] text-xs font-semibold transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
