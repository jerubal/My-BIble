'use client';

import React from 'react';
import { Translation } from '@/lib/types';
import { ShieldCheck, X, ExternalLink, Globe, BookOpen } from 'lucide-react';

interface TranslationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations?: Translation[];
}

export function TranslationInfoModal({
  isOpen,
  onClose,
  translations = [],
}: TranslationInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Translation Licensing & Manuscripts</h2>
              <p className="text-xs text-[var(--text-muted)]">Verified public domain and scholarly biblical texts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Every translation in this application has verified, documented licensing in accordance with open-access biblical scholarship and copyright law.
          </p>

          <div className="space-y-4">
            {translations.map((tr) => (
              <div
                key={tr.code}
                className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[var(--accent-color)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">
                      {tr.language} ({tr.short_code || tr.code})
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      tr.license_type === 'public_domain'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                    }`}
                  >
                    {tr.license_type === 'public_domain' ? 'Public Domain' : tr.license_type}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)]">{tr.name}</h3>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {tr.description || 'Complete scripture text and aligned verses.'}
                </p>

                {tr.source_url && (
                  <div className="pt-2">
                    <a
                      href={tr.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-[var(--accent-color)] hover:underline"
                    >
                      <span>Source Repository / Publisher</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
