'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, BookOpen, Link2, FileText, Search, ArrowRight, Check, Copy } from 'lucide-react';
import { getVerseMorphology } from '@/lib/lexicon';

interface StudyHubProps {
  onOpenSavedNotes?: () => void;
}

export function StudyHub({ onOpenSavedNotes }: StudyHubProps) {
  const router = useRouter();
  const [copied, setCopied] = useState<boolean>(false);

  // Daily Hebrew/Greek Word Study
  const wordOfTheDay = {
    original: 'חֶסֶድ',
    transliteration: 'chesed',
    strongs_id: 'H2617',
    part_of_speech: 'Noun masculine',
    definition_en: 'Loving-kindness, steadfast covenant love, unfailing mercy and grace.',
    definition_am: 'የማይቋረጥ ቸርነት፣ የታመነ ኪዳናዊ ፍቅርና ምሕረት።',
    frequency: 'Appears 248 times in the Hebrew Bible (OT)',
    keyPassage: { bookSlug: 'psalms', bookName: 'Psalms', chapter: 136, verse: 1 },
  };

  const handleCopyWord = () => {
    const text = `[${wordOfTheDay.strongs_id}] ${wordOfTheDay.original} (${wordOfTheDay.transliteration})\n${wordOfTheDay.definition_en}\n${wordOfTheDay.definition_am}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 animate-fadeIn pb-24">
      {/* Topbar Header */}
      <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)] block">
            Original Languages & Tools
          </span>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Study Hub</h2>
        </div>
        <button
          onClick={() => router.push('/read/genesis/1')}
          className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] text-xs"
          title="Search Lexicon"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Last Looked Up Card */}
      <div
        onClick={() => router.push('/read/ruth/1?v=16')}
        className="row-card group"
      >
        <div>
          <div className="row-label">Last looked up</div>
          <div className="row-value font-hebrew text-base text-[var(--accent-color)]">עַמֵּךְ עַמִּי</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Ruth 1:16 · H5971 (People/Nation)</div>
        </div>
        <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
      </div>

      {/* 2. Word of the Day Card (Glow Box from Concept) */}
      <div className="verse-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="eyebrow flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Word of the day</span>
          </div>
          <button
            onClick={handleCopyWord}
            className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--accent-color)] border border-[var(--border-color)] font-medium flex items-center gap-1"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="word-original font-hebrew text-3xl text-[var(--accent-color)] pt-1">
          {wordOfTheDay.original}
        </div>

        <div className="word-strong">
          {wordOfTheDay.strongs_id} · <span className="italic font-voice text-xs text-[var(--text-secondary)]">{wordOfTheDay.transliteration}</span> — {wordOfTheDay.definition_en}
        </div>

        <p className="font-amharic text-xs text-[var(--accent-color)] leading-relaxed bg-[var(--bg-surface)]/60 p-2 rounded-xl">
          {wordOfTheDay.definition_am}
        </p>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-muted)]">
          <span>{wordOfTheDay.frequency}</span>
          <button
            onClick={() => router.push(`/read/${wordOfTheDay.keyPassage.bookSlug}/${wordOfTheDay.keyPassage.chapter}`)}
            className="text-[var(--accent-color)] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Read {wordOfTheDay.keyPassage.bookName} {wordOfTheDay.keyPassage.chapter}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Cross-References Hub Card */}
      <div
        onClick={() => router.push('/read/ruth/1?v=16')}
        className="row-card group"
      >
        <div>
          <div className="row-label">Cross-references (TSK)</div>
          <div className="row-value">Ruth 1:16 · 4 canonical links</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Explore covenant & loyalty references</div>
        </div>
        <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
      </div>

      {/* 4. Your Notes Card */}
      <div
        onClick={onOpenSavedNotes}
        className="row-card group"
      >
        <div>
          <div className="row-label">Your Study Notes</div>
          <div className="row-value">Personal reflections & tags</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Click to view all annotated verses</div>
        </div>
        <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
      </div>

      {/* 5. Quick Greek / Hebrew Alphabet & Strong's Lookup */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-color)] block">
          Original Text Tools
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => router.push('/read/genesis/1')}
            className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-left transition-colors"
          >
            <div className="font-hebrew text-base text-[var(--accent-color)]">תּוֹרָה (OT)</div>
            <div className="font-bold text-[11px] text-[var(--text-primary)]">Hebrew Tanakh</div>
            <div className="text-[10px] text-[var(--text-muted)]">Westminster Leningrad</div>
          </button>

          <button
            onClick={() => router.push('/read/john/1')}
            className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-left transition-colors"
          >
            <div className="font-greek text-base text-[var(--accent-color)]">Καινὴ Διαθήκη (NT)</div>
            <div className="font-bold text-[11px] text-[var(--text-primary)]">Greek New Testament</div>
            <div className="text-[10px] text-[var(--text-muted)]">SBLGNT & Textus Receptus</div>
          </button>
        </div>
      </div>
    </div>
  );
}
