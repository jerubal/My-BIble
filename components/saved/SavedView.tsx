'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SavedFavorite, SavedHighlight, SavedNote, HighlightColor } from '@/lib/types';
import {
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
} from 'lucide-react';

interface SavedViewProps {
  onRefresh?: () => void;
}

export function SavedView({ onRefresh }: SavedViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'favorites' | 'highlights' | 'notes'>('favorites');
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
    loadSavedData();
  }, []);

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

  const handleCopyText = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        favorites: JSON.parse(localStorage.getItem('ruth_favorites') || '{}'),
        highlights: JSON.parse(localStorage.getItem('ruth_highlights') || '{}'),
        notes: JSON.parse(localStorage.getItem('ruth_notes') || '{}'),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `bible_study_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to export study backup');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

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
        setImportStatus('Error restoring backup. Invalid file format.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Color Swatches
  const highlightColors: Array<{ id: HighlightColor; name: string; dot: string }> = [
    { id: 'yellow', name: 'Yellow', dot: '#eab308' },
    { id: 'gold', name: 'Gold', dot: '#d97706' },
    { id: 'orange', name: 'Orange', dot: '#f97316' },
    { id: 'green', name: 'Green', dot: '#22c55e' },
    { id: 'emerald', name: 'Emerald', dot: '#16a34a' },
    { id: 'cyan', name: 'Cyan', dot: '#06b6d4' },
    { id: 'blue', name: 'Blue', dot: '#0284c7' },
    { id: 'indigo', name: 'Indigo', dot: '#4f46e5' },
    { id: 'purple', name: 'Purple', dot: '#a855f7' },
    { id: 'pink', name: 'Pink', dot: '#db2777' },
    { id: 'rose', name: 'Rose', dot: '#f43f5e' },
    { id: 'slate', name: 'Slate', dot: '#64748b' },
  ];

  // Filtering
  const filteredFavorites = favorites.filter((f) => {
    const q = searchQuery.toLowerCase();
    return f.book_name.toLowerCase().includes(q) || f.verse_text.toLowerCase().includes(q);
  });

  const filteredHighlights = highlights.filter((h) => {
    const q = searchQuery.toLowerCase();
    const matchesColor = selectedColorFilter === 'all' || h.color === selectedColorFilter;
    const matchesText = h.book_name.toLowerCase().includes(q) || h.verse_text.toLowerCase().includes(q);
    return matchesColor && matchesText;
  });

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchesText =
      n.book_name.toLowerCase().includes(q) ||
      n.note_text.toLowerCase().includes(q) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesText;
  });

  return (
    <div className="space-y-4 animate-fadeIn pb-24">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)] block">
            Personal Scripture Study
          </span>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Saved Verses & Notes</h2>
        </div>

        {/* Backup / Export Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleExportBackup}
            className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-color)] text-xs flex items-center gap-1"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] font-bold">Export</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-color)] text-xs flex items-center gap-1"
            title="Restore JSON Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] font-bold">Restore</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {importStatus && (
        <div className="p-2.5 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-semibold text-center border border-[var(--border-gold)]">
          {importStatus}
        </div>
      )}

      {/* Main Tabs (Favorites, Highlights, Notes) */}
      <div className="flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'favorites'
              ? 'bg-[var(--accent-color)] text-[#241c08] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'highlights'
              ? 'bg-[var(--accent-color)] text-[#241c08] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span>Highlights ({highlights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-[var(--accent-color)] text-[#241c08] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes ({notes.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="search-pill">
        <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search saved verses, tags, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs w-full text-[var(--text-primary)] focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-[var(--text-muted)]">
            ✕
          </button>
        )}
      </div>

      {/* Color Filter Swatches (Only for Highlights) */}
      {activeTab === 'highlights' && (
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mr-1">Colors:</span>
          <button
            onClick={() => setSelectedColorFilter('all')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
              selectedColorFilter === 'all'
                ? 'bg-[var(--accent-color)] text-[#241c08]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
            }`}
          >
            All
          </button>
          {highlightColors.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedColorFilter(c.id)}
              className={`w-5 h-5 rounded-full transition-transform flex items-center justify-center ${
                selectedColorFilter === c.id ? 'ring-2 ring-offset-1 ring-[var(--accent-color)] scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.dot }}
              title={c.name}
            >
              {selectedColorFilter === c.id && <Check className="w-2.5 h-2.5 text-white" />}
            </button>
          ))}
        </div>
      )}

      {/* 1. FAVORITES LIST */}
      {activeTab === 'favorites' && (
        <div className="space-y-2.5">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] space-y-1">
              <Star className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-30" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">No favorites saved yet</p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Tap the star icon on any verse while reading to bookmark it.
              </p>
            </div>
          ) : (
            filteredFavorites.map((fav) => (
              <div
                key={fav.id}
                onClick={() => router.push(`/read/${fav.book_slug}/${fav.chapter}?v=${fav.verse_num}`)}
                className="p-3 rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-gold)] border border-[var(--border-color)] transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--accent-color)] flex items-center gap-1 group-hover:underline">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {fav.book_name} {fav.chapter}:{fav.verse_num}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleCopyText(fav.verse_text, fav.id, e)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                    >
                      {copiedId === fav.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => handleDeleteFavorite(fav.id, e)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-secondary)]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed font-serif">
                  "{fav.verse_text}"
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. HIGHLIGHTS LIST */}
      {activeTab === 'highlights' && (
        <div className="space-y-2.5">
          {filteredHighlights.length === 0 ? (
            <div className="text-center py-12 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] space-y-1">
              <Highlighter className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-30" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">No highlights saved yet</p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Select any verse to highlight it with your choice of 12 colors.
              </p>
            </div>
          ) : (
            filteredHighlights.map((hl) => (
              <div
                key={hl.id}
                onClick={() => router.push(`/read/${hl.book_slug}/${hl.chapter}?v=${hl.verse_num}`)}
                className={`p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--border-gold)] transition-all cursor-pointer space-y-1.5 hl-${hl.color} group`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-primary)] group-hover:underline">
                    {hl.book_name} {hl.chapter}:{hl.verse_num}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleCopyText(hl.verse_text, hl.id, e)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                    >
                      {copiedId === hl.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => handleDeleteHighlight(hl.id, e)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-secondary)]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed font-serif">
                  "{hl.verse_text}"
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. NOTES LIST */}
      {activeTab === 'notes' && (
        <div className="space-y-2.5">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] space-y-1">
              <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-30" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">No notes created yet</p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Select any verse and tap "Note" to save personal reflections.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => router.push(`/read/${note.book_slug}/${note.chapter}?v=${note.verse_num}`)}
                className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--border-gold)] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--accent-color)] group-hover:underline flex items-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-500" />
                    {note.book_name} {note.chapter}:{note.verse_num}
                  </span>

                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-secondary)]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap font-sans bg-[var(--bg-secondary)]/50 p-2.5 rounded-xl">
                  {note.note_text}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[9px] text-[var(--text-muted)] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
