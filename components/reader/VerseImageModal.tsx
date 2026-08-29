'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Palette,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Book } from '@/lib/types';

interface VerseImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  chapter: number;
  verseNum: number;
  verseTextEn?: string;
  verseTextAm?: string;
}

const THEMES = [
  {
    id: 'gold-night',
    name: 'Midnight Gold',
    bg: 'linear-gradient(135deg, #0b0f19 0%, #161f30 50%, #0d121d 100%)',
    border: '#d4af37',
    textColor: '#fdfbf7',
    accentColor: '#f3c64c',
    citationColor: '#d4af37',
  },
  {
    id: 'emerald',
    name: 'Deep Emerald',
    bg: 'linear-gradient(135deg, #062419 0%, #0f4a35 50%, #082b1e 100%)',
    border: '#10b981',
    textColor: '#f0fdf4',
    accentColor: '#34d399',
    citationColor: '#6ee7b7',
  },
  {
    id: 'parchment',
    name: 'Warm Parchment',
    bg: 'linear-gradient(135deg, #fbf7ee 0%, #f4ebd9 50%, #eee1c5 100%)',
    border: '#c4a46a',
    textColor: '#2c2214',
    accentColor: '#8c2d19',
    citationColor: '#8c2d19',
  },
  {
    id: 'royal',
    name: 'Royal Velvet',
    bg: 'linear-gradient(135deg, #1e112a 0%, #3b1d5c 50%, #201030 100%)',
    border: '#c084fc',
    textColor: '#faf5ff',
    accentColor: '#e9d5ff',
    citationColor: '#c084fc',
  },
  {
    id: 'sunset',
    name: 'Sunset Sand',
    bg: 'linear-gradient(135deg, #2b1108 0%, #57250d 50%, #301306 100%)',
    border: '#fb923c',
    textColor: '#fff7ed',
    accentColor: '#fed7aa',
    citationColor: '#fb923c',
  },
  {
    id: 'ocean',
    name: 'Abyssal Blue',
    bg: 'linear-gradient(135deg, #081d33 0%, #0d3866 50%, #07192c 100%)',
    border: '#38bdf8',
    textColor: '#f0f9ff',
    accentColor: '#7dd3fc',
    citationColor: '#38bdf8',
  },
];

export function VerseImageModal({
  isOpen,
  onClose,
  book,
  chapter,
  verseNum,
  verseTextEn,
  verseTextAm,
}: VerseImageModalProps) {
  const [selectedThemeId, setSelectedThemeId] = useState('gold-night');
  const [languageMode, setLanguageMode] = useState<'both' | 'am' | 'en'>('both');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  const primaryAm = verseTextAm || 'በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።';
  const primaryEn = verseTextEn || 'For where you go, I will go; and where you lodge, I will lodge.';

  // Draw Card to HTML5 Canvas for Export
  const drawCardToCanvas = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (currentTheme.id === 'emerald') {
        grad.addColorStop(0, '#062419');
        grad.addColorStop(0.5, '#0f4a35');
        grad.addColorStop(1, '#082b1e');
      } else if (currentTheme.id === 'parchment') {
        grad.addColorStop(0, '#fbf7ee');
        grad.addColorStop(0.5, '#f4ebd9');
        grad.addColorStop(1, '#eee1c5');
      } else if (currentTheme.id === 'royal') {
        grad.addColorStop(0, '#1e112a');
        grad.addColorStop(0.5, '#3b1d5c');
        grad.addColorStop(1, '#201030');
      } else if (currentTheme.id === 'sunset') {
        grad.addColorStop(0, '#2b1108');
        grad.addColorStop(0.5, '#57250d');
        grad.addColorStop(1, '#301306');
      } else if (currentTheme.id === 'ocean') {
        grad.addColorStop(0, '#081d33');
        grad.addColorStop(0.5, '#0d3866');
        grad.addColorStop(1, '#07192c');
      } else {
        grad.addColorStop(0, '#0b0f19');
        grad.addColorStop(0.5, '#161f30');
        grad.addColorStop(1, '#0d121d');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Elegant Outer Frame & Corner Ornaments
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      ctx.lineWidth = 1.5;
      ctx.strokeRect(62, 62, width - 124, height - 124);

      // Header App Logo / Cross
      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 30px "Nyala", "Abyssinica SIL", "Noto Serif", serif';
      ctx.textAlign = 'center';
      ctx.fillText('† መጽሐፍ ቅዱስ · HOLY SCRIPTURES †', width / 2, 130);

      // Wrap and render text helper
      const wrapText = (text: string, x: number, startY: number, maxW: number, lineH: number, fontStr: string, color: string): number => {
        ctx.font = fontStr;
        ctx.fillStyle = color;
        const words = text.split(' ');
        let line = '';
        let y = startY;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxW && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineH;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
        return y + lineH;
      };

      let nextY = 280;

      // Amharic Verse Text
      if (languageMode === 'both' || languageMode === 'am') {
        ctx.textAlign = 'center';
        nextY = wrapText(
          `«${primaryAm}»`,
          width / 2,
          nextY,
          width - 240,
          58,
          'bold 42px "Nyala", "Abyssinica SIL", "Noto Sans Ethiopic", serif',
          currentTheme.textColor
        );
        nextY += 30;
      }

      // English Verse Text
      if (languageMode === 'both' || languageMode === 'en') {
        ctx.textAlign = 'center';
        nextY = wrapText(
          `"${primaryEn}"`,
          width / 2,
          nextY,
          width - 240,
          48,
          'italic 34px "Georgia", "Baskerville", serif',
          currentTheme.textColor
        );
      }

      // Citation at Bottom
      ctx.fillStyle = currentTheme.citationColor;
      ctx.font = 'bold 36px "Nyala", "Abyssinica SIL", "Georgia", serif';
      ctx.textAlign = 'center';
      const citationStr = `${book.name_en} (${book.name_am || ''}) ${chapter}:${verseNum}`;
      ctx.fillText(citationStr, width / 2, height - 120);

      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    const dataUrl = await drawCardToCanvas();
    const link = document.createElement('a');
    link.download = `${book.slug}_${chapter}_${verseNum}_verse_card.png`;
    link.href = dataUrl;
    link.click();
    setIsGenerating(false);
  };

  const handleCopyImage = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await drawCardToCanvas();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy failed:', e);
    }
    setIsGenerating(false);
  };

  const handleWebShare = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await drawCardToCanvas();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${book.slug}_${chapter}_${verseNum}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${book.name_en} ${chapter}:${verseNum}`,
          text: `${book.name_en} ${chapter}:${verseNum}\n${primaryAm}\n${primaryEn}`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (e) {}
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--gold-gradient)] text-[#241c08] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Scripture Card Generator
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {book.name_en} {chapter}:{verseNum}
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

        {/* Modal Body: Live Card Preview & Controls */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Live Card Preview */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="w-full max-w-sm aspect-square rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative border transition-all"
              style={{
                background: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textColor,
              }}
            >
              {/* Inner Decorative Frame */}
              <div
                className="absolute inset-2 rounded-xl border border-dashed pointer-events-none opacity-40"
                style={{ borderColor: currentTheme.border }}
              />

              {/* Header */}
              <div className="text-center">
                <span
                  className="text-[11px] uppercase tracking-widest font-bold font-serif"
                  style={{ color: currentTheme.accentColor }}
                >
                  † መጽሐፍ ቅዱስ · Holy Scriptures †
                </span>
              </div>

              {/* Verse Content */}
              <div className="my-auto space-y-3 text-center z-10">
                {(languageMode === 'both' || languageMode === 'am') && (
                  <p className="font-amharic text-sm sm:text-base font-bold leading-relaxed">
                    «{primaryAm}»
                  </p>
                )}
                {(languageMode === 'both' || languageMode === 'en') && (
                  <p className="font-serif italic text-xs sm:text-sm opacity-90 leading-relaxed">
                    "{primaryEn}"
                  </p>
                )}
              </div>

              {/* Citation Footer */}
              <div className="text-center pt-2 z-10">
                <span
                  className="text-xs sm:text-sm font-bold font-serif tracking-wide"
                  style={{ color: currentTheme.citationColor }}
                >
                  {book.name_en} ({book.name_am}) {chapter}:{verseNum}
                </span>
              </div>
            </div>
          </div>

          {/* Theme Palette Chooser */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] mb-2 block flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Select Card Aesthetic:</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {THEMES.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'ring-2 ring-[var(--accent-color)] border-transparent scale-105 shadow-md bg-[var(--bg-secondary)]'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div
                      className="w-full h-7 rounded-lg shadow-inner border border-white/10"
                      style={{ background: theme.bg }}
                    />
                    <span className="text-[10px] font-semibold text-[var(--text-primary)] truncate w-full">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Mode Toggle */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] mb-2 block flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Verse Languages:</span>
            </label>
            <div className="flex rounded-xl bg-[var(--bg-secondary)] p-1 border border-[var(--border-color)] text-xs font-semibold">
              <button
                onClick={() => setLanguageMode('both')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  languageMode === 'both'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Bilingual (አማ + En)
              </button>
              <button
                onClick={() => setLanguageMode('am')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  languageMode === 'am'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Amharic Only
              </button>
              <button
                onClick={() => setLanguageMode('en')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  languageMode === 'en'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                English Only
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={handleCopyImage}
            disabled={isGenerating}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] transition-all flex items-center justify-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleWebShare}
              disabled={isGenerating}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-bold text-[var(--accent-color)] border border-[var(--border-color)] transition-all flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[var(--gold-gradient)] hover:brightness-105 active:scale-95 text-[#241c08] text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
