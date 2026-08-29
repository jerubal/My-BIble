'use client';

import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, Info } from 'lucide-react';
import { AlignedVerse, Book, Translation } from '@/lib/types';
import { getVerseMorphology } from '@/lib/lexicon';

interface InterlinearViewProps {
  book: Book;
  chapter: number;
  verses: AlignedVerse[];
  fontSize: number;
  onSelectVerse: (verseNum: number) => void;
  activeVerseNum: number | null;
}

export function InterlinearView({
  book,
  chapter,
  verses,
  fontSize,
  onSelectVerse,
  activeVerseNum,
}: InterlinearViewProps) {
  const isOldTestament = book.testament === 'old';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Interlinear Banner */}
      <div className="p-4 rounded-2xl bg-[var(--gold-surface)] border border-[var(--gold-border)] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--gold-gradient)] text-[#241c08] flex items-center justify-center font-bold shadow-md shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[var(--gold-heading)] block">
              {isOldTestament ? 'Biblical Hebrew Interlinear (Masoretic Text)' : 'Koine Greek Interlinear (Nestle-Aland / SBL)'}
            </span>
            <span className="text-[11px] text-[var(--gold-text)]">
              Word-by-word morpho-syntactic breakdown with Strong's Concordance and bilingual Amharic & English glosses.
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[var(--bg-surface)] font-bold text-[10px] text-[var(--gold-heading)] border border-[var(--gold-border)]">
          {isOldTestament ? 'עִבְרִית · Hebrew' : 'Ἑλληνική · Greek'}
        </span>
      </div>

      {/* Verses Interlinear Flow */}
      <div className="space-y-6">
        {verses.map((verse) => {
          const isSelected = activeVerseNum === verse.verse_num;
          const origVerseText = isOldTestament
            ? verse.translations['heb-wlc']?.text
            : verse.translations['grc-sblgnt']?.text || verse.translations['grc-tr']?.text;

          const morphData = getVerseMorphology(
            book.slug,
            book.testament,
            chapter,
            verse.verse_num,
            origVerseText
          );
          const morphWords = morphData.words;
          const amharicText = verse.translations['am-1875']?.text || verse.translations['am-1954']?.text || '';
          const englishText = verse.translations['eng-kjv']?.text || verse.translations['eng-web']?.text || '';

          return (
            <div
              key={verse.verse_num}
              id={`verse-${verse.verse_num}`}
              onClick={() => onSelectVerse(verse.verse_num)}
              className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[var(--accent-color)] shadow-lg bg-[var(--bg-secondary)]/90'
                  : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--accent-color)] shadow-sm'
              }`}
            >
              {/* Verse Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-color)]/70">
                <div className="flex items-center space-x-2">
                  <span className="vnum font-bold text-xs">
                    {book.name_en} {chapter}:{verse.verse_num}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-muted)] font-amharic">
                    {book.name_am} {chapter}:{verse.verse_num}
                  </span>
                </div>

                <div className="text-[10px] uppercase font-bold text-[var(--accent-color)] tracking-wider">
                  {morphWords.length} Words Analyzed
                </div>
              </div>

              {/* Translation Previews */}
              <div className="mb-4 space-y-1.5 bg-[var(--bg-secondary)]/40 p-3 rounded-xl border border-[var(--border-color)]/40 text-xs">
                <p className="font-amharic text-[var(--text-primary)] leading-relaxed">
                  <span className="font-bold text-[var(--accent-color)] mr-1.5">አማርኛ:</span>
                  {amharicText}
                </p>
                <p className="text-[var(--text-secondary)] italic leading-relaxed">
                  <span className="font-bold text-[var(--accent-color)] mr-1.5 not-italic">English:</span>
                  {englishText}
                </p>
              </div>

              {/* Word-by-Word Interlinear Grid */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 ${
                  isOldTestament ? 'dir-rtl' : 'dir-ltr'
                }`}
              >
                {morphWords.map((word, wIdx) => (
                  <div
                    key={wIdx}
                    className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]/80 hover:border-[var(--accent-color)] hover:shadow-md transition-all flex flex-col justify-between gap-1 text-center"
                  >
                    {/* Original Word */}
                    <div
                      className={`text-lg font-bold ${
                        isOldTestament ? 'font-hebrew text-amber-700 dark:text-amber-300' : 'font-greek text-sky-700 dark:text-sky-300'
                      }`}
                    >
                      {word.surface_form || word.lemma}
                    </div>

                    {/* Transliteration */}
                    <div className="text-[11px] font-mono text-[var(--text-muted)] tracking-tight">
                      /{word.transliteration}/
                    </div>

                    {/* Strong's ID & Grammar Tag */}
                    <div className="flex items-center justify-center space-x-1 my-1">
                      <span className="px-1.5 py-0.5 rounded-md bg-[var(--gold-surface)] text-[var(--gold-heading)] font-mono text-[9px] font-bold border border-[var(--gold-border)]">
                        {word.strongs_id}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[9px] font-medium truncate max-w-[80px]">
                        {word.part_of_speech}
                      </span>
                    </div>

                    {/* English Gloss */}
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate" title={word.definition_en}>
                      {word.definition_en}
                    </div>

                    {/* Amharic Gloss */}
                    <div className="text-[11px] font-amharic font-semibold text-[var(--accent-color)] truncate" title={word.definition_am}>
                      {word.definition_am}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
