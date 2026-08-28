'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getCrossReferences } from '@/lib/cross-references';
import { CrossReference } from '@/lib/types';
import { X, Link2, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

interface CrossReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseNum: number;
}

export function CrossReferencesModal({
  isOpen,
  onClose,
  bookSlug,
  bookName,
  chapter,
  verseNum,
}: CrossReferencesModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const crossRefs = getCrossReferences(bookSlug, chapter, verseNum);

  const handleJump = (ref: CrossReference) => {
    onClose();
    router.push(`/read/${ref.target_book_slug}/${ref.target_chapter}?v=${ref.target_verse_start}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-sm">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                የመስቀለኛ ማጣቀሻዎች • Cross-References
              </h2>
              <p className="text-[11px] text-[var(--accent-color)] font-semibold">
                {bookName} {chapter}:{verseNum} • Treasury of Scripture Knowledge (TSK)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cross-References List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          <div className="p-3 rounded-2xl bg-[var(--accent-light)] border border-[var(--accent-color)]/20 text-xs text-[var(--text-primary)] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
            <span>
              Connected passages bridging prophetic foundations and canonical fulfillment across scripture.
            </span>
          </div>

          <div className="space-y-3">
            {crossRefs.map((ref, idx) => {
              const refString = `${ref.target_book_name} ${ref.target_chapter}:${ref.target_verse_start}${
                ref.target_verse_end ? `-${ref.target_verse_end}` : ''
              }`;

              return (
                <div
                  key={idx}
                  onClick={() => handleJump(ref)}
                  className="p-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer group shadow-sm hover:shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs sm:text-sm text-[var(--accent-color)] group-hover:underline">
                        {refString}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJump(ref);
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] group-hover:border-[var(--accent-color)] group-hover:text-[var(--accent-color)] transition-colors"
                    >
                      <span>Read</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {ref.theme && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                      Theme: {ref.theme}
                    </span>
                  )}

                  {ref.preview_text_am && (
                    <p className="font-eth text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-color)]/60">
                      {ref.preview_text_am}
                    </p>
                  )}

                  {ref.preview_text_en && (
                    <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                      "{ref.preview_text_en}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
