'use client';

import React, { useState, useEffect } from 'react';
import { SavedNote } from '@/lib/types';
import { X, FileText, Save, Trash2, Check, Tag } from 'lucide-react';

interface VerseNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseNum: number;
  verseText: string;
  onSaveNote: (note: SavedNote | null) => void;
}

export function VerseNoteModal({
  isOpen,
  onClose,
  bookSlug,
  bookName,
  chapter,
  verseNum,
  verseText,
  onSaveNote,
}: VerseNoteModalProps) {
  const [noteContent, setNoteContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const noteKey = `${bookSlug}-${chapter}-${verseNum}`;

  useEffect(() => {
    if (isOpen) {
      setIsSaved(false);
      try {
        const notesStr = localStorage.getItem('ruth_notes');
        if (notesStr) {
          const notesObj: Record<string, SavedNote> = JSON.parse(notesStr);
          if (notesObj[noteKey]) {
            setNoteContent(notesObj[noteKey].note_text);
            setTags((notesObj[noteKey].tags || []).join(', '));
            return;
          }
        }
      } catch (err) {}
      setNoteContent('');
      setTags('');
    }
  }, [isOpen, noteKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!noteContent.trim()) {
      handleDelete();
      return;
    }

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedNote: SavedNote = {
      id: noteKey,
      book_slug: bookSlug,
      book_name: bookName,
      chapter,
      verse_num: verseNum,
      note_text: noteContent.trim(),
      tags: tagArray,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const notesStr = localStorage.getItem('ruth_notes') || '{}';
      const notesObj: Record<string, SavedNote> = JSON.parse(notesStr);
      notesObj[noteKey] = updatedNote;
      localStorage.setItem('ruth_notes', JSON.stringify(notesObj));
    } catch (e) {}

    onSaveNote(updatedNote);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleDelete = () => {
    try {
      const notesStr = localStorage.getItem('ruth_notes');
      if (notesStr) {
        const notesObj: Record<string, SavedNote> = JSON.parse(notesStr);
        delete notesObj[noteKey];
        localStorage.setItem('ruth_notes', JSON.stringify(notesObj));
      }
    } catch (e) {}

    onSaveNote(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                የግል ማስታወሻ • Personal Study Note
              </h2>
              <p className="text-[11px] text-[var(--accent-color)] font-semibold">
                {bookName} {chapter}:{verseNum}
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

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Verse context quote */}
          <blockquote className="p-3 rounded-2xl bg-[var(--bg-secondary)]/50 border-l-4 border-[var(--accent-color)] text-xs text-[var(--text-secondary)] leading-relaxed italic">
            "{verseText}"
          </blockquote>

          {/* Note Editor Area */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Your Reflections & Study Thoughts:
            </label>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your personal reflections, cross-references, sermon notes, or prayer thoughts here..."
              rows={5}
              className="w-full p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
          </div>

          {/* Tags input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
              <Tag className="w-3 h-3 text-[var(--accent-color)]" />
              Tags (comma separated):
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Prayer, Faith, Covenant, Grace"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Note</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
