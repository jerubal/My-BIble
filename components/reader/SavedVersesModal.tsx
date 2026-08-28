'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SavedFavorite, SavedHighlight, SavedNote, HighlightColor } from '@/lib/types';
import {
  X,
  Star,
  Highlighter,
  FileText,
  Search,
  Trash2,
  Copy,
  Check,
  Download,
  Upload,
  BookOpen,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';

interface SavedVersesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type ModalTab = 'favorites' | 'highlights' | 'notes';

export function SavedVersesModal({ isOpen, onClose, onRefresh }: SavedVersesModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ModalTab>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<HighlightColor | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [highlights, setHighlights] = useState<SavedHighlight[]>([]);
  const [notes, setNotes] = useState<SavedNote[]>([]);

  const loadSavedData = () => {
    try {
      const favStr = localStorage.getItem('ruth_favorites');
      if (favStr) {
        const favObj: Record<string, SavedFavorite> = JSON.parse(favStr);
        setFavorites(Object.values(favObj).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')));
      } else {
        setFavorites([]);
      }

      const hlStr = localStorage.getItem('ruth_highlights');
      if (hlStr) {
        const hlObj: Record<string, SavedHighlight> = JSON.parse(hlStr);
        setHighlights(Object.values(hlObj).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')));
      } else {
        setHighlights([]);
      }

      const notesStr = localStorage.getItem('ruth_notes');
      if (notesStr) {
        const notesObj: Record<string, SavedNote> = JSON.parse(notesStr);
        setNotes(Object.values(notesObj).sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || '')));
      } else {
        setNotes([]);
      }
    } catch (e) {
      console.warn('Error reading saved data:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSavedData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const favStr = localStorage.getItem('ruth_favorites');
      if (favStr) {
        const favObj: Record<string, SavedFavorite> = JSON.parse(favStr);
        delete favObj[id];
        localStorage.setItem('ruth_favorites', JSON.stringify(favObj));
        loadSavedData();
        if (onRefresh) onRefresh();
      }
    } catch (err) {}
  };

  const handleDeleteHighlight = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const hlStr = localStorage.getItem('ruth_highlights');
      if (hlStr) {
        const hlObj: Record<string, SavedHighlight> = JSON.parse(hlStr);
        delete hlObj[id];
        localStorage.setItem('ruth_highlights', JSON.stringify(hlObj));
        loadSavedData();
        if (onRefresh) onRefresh();
      }
    } catch (err) {}
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const notesStr = localStorage.getItem('ruth_notes');
      if (notesStr) {
        const notesObj: Record<string, SavedNote> = JSON.parse(notesStr);
        delete notesObj[id];
        localStorage.setItem('ruth_notes', JSON.stringify(notesObj));
        loadSavedData();
        if (onRefresh) onRefresh();
      }
    } catch (err) {}
  };

  const handleCopyText = (id: string, ref: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${ref}\n"${text}"`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJump = (bookSlug: string, chapter: number, verseNum: number) => {
    onClose();
    router.push(`/read/${bookSlug}/${chapter}?v=${verseNum}`);
  };

  // Export all saved user data as JSON
  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exported_at: new Date().toISOString(),
      favorites: JSON.parse(localStorage.getItem('ruth_favorites') || '{}'),
      highlights: JSON.parse(localStorage.getItem('ruth_highlights') || '{}'),
      notes: JSON.parse(localStorage.getItem('ruth_notes') || '{}'),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruth-bible-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.favorites) {
          localStorage.setItem('ruth_favorites', JSON.stringify(parsed.favorites));
        }
        if (parsed.highlights) {
          localStorage.setItem('ruth_highlights', JSON.stringify(parsed.highlights));
        }
        if (parsed.notes) {
          localStorage.setItem('ruth_notes', JSON.stringify(parsed.notes));
        }
        loadSavedData();
        if (onRefresh) onRefresh();
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err) {
        setImportStatus('Failed to restore backup: Invalid file format.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  // 12-Color metadata
  const colorMap: Record<HighlightColor, { label: string; dot: string }> = {
    yellow: { label: 'Yellow', dot: '#eab308' },
    gold: { label: 'Gold', dot: '#d97706' },
    orange: { label: 'Orange', dot: '#f97316' },
    green: { label: 'Green', dot: '#22c55e' },
    emerald: { label: 'Emerald', dot: '#16a34a' },
    cyan: { label: 'Cyan', dot: '#06b6d4' },
    blue: { label: 'Blue', dot: '#0284c7' },
    indigo: { label: 'Indigo', dot: '#4f46e5' },
    purple: { label: 'Purple', dot: '#a855f7' },
    pink: { label: 'Pink', dot: '#db2777' },
    rose: { label: 'Rose', dot: '#f43f5e' },
    slate: { label: 'Slate', dot: '#64748b' },
  };

  const filteredFavorites = useMemo(() => {
    return favorites.filter((f) => {
      const matchSearch =
        !searchQuery ||
        f.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.verse_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${f.chapter}:${f.verse_num}`.includes(searchQuery);
      return matchSearch;
    });
  }, [favorites, searchQuery]);

  const filteredHighlights = useMemo(() => {
    return highlights.filter((h) => {
      const matchColor = selectedColorFilter === 'all' || h.color === selectedColorFilter;
      const matchSearch =
        !searchQuery ||
        h.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.verse_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${h.chapter}:${h.verse_num}`.includes(searchQuery);
      return matchColor && matchSearch;
    });
  }, [highlights, selectedColorFilter, searchQuery]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchSearch =
        !searchQuery ||
        n.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.note_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `${n.chapter}:${n.verse_num}`.includes(searchQuery);
      return matchSearch;
    });
  }, [notes, searchQuery]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                የተቀመጡ ጥቅሶችና ማስታወሻዎች
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Saved Bookmarks, Highlights & Personal Study Notes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Backup & Restore buttons */}
            <button
              onClick={handleExportBackup}
              className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
              title="Export Backup (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
              title="Restore Backup (JSON)"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notice */}
        {importStatus && (
          <div className="px-4 py-2 bg-[var(--accent-color)] text-white text-xs font-semibold text-center animate-fadeIn">
            {importStatus}
          </div>
        )}

        {/* Tab Switcher & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* 3 Tabs */}
            <div className="inline-flex rounded-xl p-1 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-[var(--bg-surface)] text-amber-500 shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Favorites ({favorites.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('highlights')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'highlights'
                    ? 'bg-[var(--bg-surface)] text-[var(--accent-color)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Highlights ({highlights.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'notes'
                    ? 'bg-[var(--bg-surface)] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({notes.length})</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved scriptures..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
              />
            </div>
          </div>

          {/* Color Filter Row (Highlights Tab) */}
          {activeTab === 'highlights' && (
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setSelectedColorFilter('all')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all ${
                  selectedColorFilter === 'all'
                    ? 'bg-[var(--accent-color)] text-white border-transparent'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
                }`}
              >
                All Colors ({highlights.length})
              </button>
              {(Object.keys(colorMap) as HighlightColor[]).map((c) => {
                const count = highlights.filter((h) => h.color === c).length;
                if (count === 0 && selectedColorFilter !== c) return null;
                const isSelected = selectedColorFilter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedColorFilter(c)}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[var(--accent-color)] text-white border-transparent'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[c].dot }} />
                    <span>{colorMap[c].label}</span>
                    <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Body List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* ================= FAVORITES TAB ================= */}
          {activeTab === 'favorites' && (
            <>
              {filteredFavorites.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Star className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">No saved favorites found.</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Tap any verse in the reader and select "Favorite" to save it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredFavorites.map((fav) => (
                    <div
                      key={fav.id}
                      onClick={() => handleJump(fav.book_slug, fav.chapter, fav.verse_num)}
                      className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer group shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                            {fav.book_name} {fav.chapter}:{fav.verse_num}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) =>
                              handleCopyText(fav.id, `${fav.book_name} ${fav.chapter}:${fav.verse_num}`, fav.verse_text, e)
                            }
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            title="Copy text"
                          >
                            {copiedId === fav.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleDeleteFavorite(fav.id, e)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                            title="Remove Favorite"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-eth line-clamp-3">
                        "{fav.verse_text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================= HIGHLIGHTS TAB ================= */}
          {activeTab === 'highlights' && (
            <>
              {filteredHighlights.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Highlighter className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">No highlighted verses found.</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Tap any verse in the reader and pick a color swatch to highlight it.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredHighlights.map((hl) => (
                    <div
                      key={hl.id}
                      onClick={() => handleJump(hl.book_slug, hl.chapter, hl.verse_num)}
                      className={`p-3.5 sm:p-4 rounded-2xl hl-${hl.color} hover:shadow-md border border-[var(--border-color)] transition-all cursor-pointer group flex flex-col gap-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: colorMap[hl.color]?.dot || '#eab308' }}
                          />
                          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                            {hl.book_name} {hl.chapter}:{hl.verse_num}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) =>
                              handleCopyText(hl.id, `${hl.book_name} ${hl.chapter}:${hl.verse_num}`, hl.verse_text, e)
                            }
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            title="Copy text"
                          >
                            {copiedId === hl.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleDeleteHighlight(hl.id, e)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                            title="Remove highlight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-eth line-clamp-3">
                        "{hl.verse_text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================= NOTES TAB ================= */}
          {activeTab === 'notes' && (
            <>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">No personal study notes found.</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Tap any verse in the reader and select "Note" to write reflections and study notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleJump(note.book_slug, note.chapter, note.verse_num)}
                      className="p-4 rounded-2xl bg-[var(--bg-secondary)]/60 hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer group shadow-sm flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                            {note.book_name} {note.chapter}:{note.verse_num}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) =>
                              handleCopyText(
                                note.id,
                                `Note on ${note.book_name} ${note.chapter}:${note.verse_num}`,
                                note.note_text,
                                e
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            title="Copy note"
                          >
                            {copiedId === note.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]/60 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                        {note.note_text}
                      </div>

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {note.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-[var(--accent-light)] text-[var(--accent-color)] text-[10px] font-bold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
