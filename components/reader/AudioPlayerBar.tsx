'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  FastForward,
  Sparkles,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { AlignedVerse, Book, Translation } from '@/lib/types';

interface AudioPlayerBarProps {
  book: Book;
  chapter: number;
  verses: AlignedVerse[];
  activeTranslation: Translation;
  activePlayingVerse: number | null;
  onActivePlayingVerseChange: (verseNum: number | null) => void;
  onClose: () => void;
  onNextChapter?: () => void;
}

export function AudioPlayerBar({
  book,
  chapter,
  verses,
  activeTranslation,
  activePlayingVerse,
  onActivePlayingVerseChange,
  onClose,
  onNextChapter,
}: AudioPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        const isAmharic = activeTranslation.code.startsWith('am');
        
        let matchingVoice: SpeechSynthesisVoice | null = null;
        if (isAmharic) {
          matchingVoice = voices.find((v) => v.lang.includes('am') || v.lang.includes('gez')) || null;
        } else if (activeTranslation.code.startsWith('heb')) {
          matchingVoice = voices.find((v) => v.lang.includes('he') || v.lang.includes('iw')) || null;
        } else if (activeTranslation.code.startsWith('grc')) {
          matchingVoice = voices.find((v) => v.lang.includes('el') || v.lang.includes('gr')) || null;
        } else {
          matchingVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Zira'))) || voices.find((v) => v.lang.startsWith('en')) || null;
        }

        setSelectedVoice(matchingVoice || (voices.length > 0 ? voices[0] : null));
      };

      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [activeTranslation]);

  // Clean verse text for narration
  const getNarrationText = (vIndex: number): string => {
    if (!verses[vIndex]) return '';
    const v = verses[vIndex];
    const transText = v.translations[activeTranslation.code]?.text ||
      v.translations['am-1875']?.text ||
      v.translations['eng-kjv']?.text ||
      '';
    return `Verse ${v.verse_num}. ${transText}`;
  };

  const speakVerse = (vIndex: number) => {
    if (!synthRef.current || vIndex >= verses.length) {
      setIsPlaying(false);
      onActivePlayingVerseChange(null);
      if (vIndex >= verses.length && onNextChapter) {
        onNextChapter();
      }
      return;
    }

    synthRef.current.cancel();

    const textToSpeak = getNarrationText(vIndex);
    if (!textToSpeak) {
      if (vIndex + 1 < verses.length) {
        speakVerse(vIndex + 1);
      }
      return;
    }

    const currentVNum = verses[vIndex].verse_num;
    setCurrentVerseIndex(vIndex);
    onActivePlayingVerseChange(currentVNum);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = playbackRate;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1.0;

    utterance.onend = () => {
      if (vIndex + 1 < verses.length) {
        speakVerse(vIndex + 1);
      } else {
        setIsPlaying(false);
        onActivePlayingVerseChange(null);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const handlePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
        speakVerse(currentVerseIndex);
      }
    }
  };

  const handleSkipNext = () => {
    if (currentVerseIndex + 1 < verses.length) {
      const nextIdx = currentVerseIndex + 1;
      setCurrentVerseIndex(nextIdx);
      if (isPlaying) {
        speakVerse(nextIdx);
      } else {
        onActivePlayingVerseChange(verses[nextIdx].verse_num);
      }
    }
  };

  const handleSkipPrev = () => {
    if (currentVerseIndex > 0) {
      const prevIdx = currentVerseIndex - 1;
      setCurrentVerseIndex(prevIdx);
      if (isPlaying) {
        speakVerse(prevIdx);
      } else {
        onActivePlayingVerseChange(verses[prevIdx].verse_num);
      }
    }
  };

  const handleSpeedCycle = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    setPlaybackRate(newRate);
    if (isPlaying && synthRef.current) {
      speakVerse(currentVerseIndex);
    }
  };

  const currentVerseNum = verses[currentVerseIndex]?.verse_num || 1;
  const totalVerses = verses.length;
  const progressPercent = totalVerses > 0 ? ((currentVerseIndex + 1) / totalVerses) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[92%] sm:max-w-2xl z-50 animate-slideUp">
      <div className="bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--gold-border)] rounded-2xl p-3.5 sm:p-4 shadow-2xl ring-1 ring-black/5">
        {/* Top bar: Current Passage & Status */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[var(--border-color)] text-xs">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-6 h-6 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center shrink-0">
              <Headphones className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="font-bold text-[var(--text-primary)] truncate">
              {book.name_en} {chapter}:{currentVerseNum}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider shrink-0">
              {activeTranslation.short_code || activeTranslation.code}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleSpeedCycle}
              className="px-2 py-0.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[10px] font-bold text-[var(--accent-color)] transition-colors"
              title="Playback speed"
            >
              {playbackRate}x
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                onActivePlayingVerseChange(null);
                onClose();
              }}
              className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
              title="Close audio player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="relative w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[var(--gold-gradient)] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium text-[var(--text-muted)]">
            Verse {currentVerseNum} of {totalVerses}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkipPrev}
              disabled={currentVerseIndex === 0}
              className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] disabled:opacity-30 text-[var(--text-primary)] transition-colors"
              title="Previous verse"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full bg-[var(--gold-gradient)] hover:brightness-105 active:scale-95 text-[#241c08] flex items-center justify-center shadow-lg transition-transform"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleSkipNext}
              disabled={currentVerseIndex >= totalVerses - 1}
              className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] disabled:opacity-30 text-[var(--text-primary)] transition-colors"
              title="Next verse"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {onNextChapter ? (
            <button
              onClick={onNextChapter}
              className="inline-flex items-center space-x-1 text-[11px] font-bold text-[var(--accent-color)] hover:underline"
            >
              <span>Next Ch</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </div>
    </div>
  );
}
