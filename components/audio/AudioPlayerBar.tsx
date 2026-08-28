'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlignedVerse, Translation } from '@/lib/types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, Gauge } from 'lucide-react';

interface AudioPlayerBarProps {
  verses: AlignedVerse[];
  activeTranslation: Translation;
  bookName: string;
  chapterNum: number;
  currentVerseNum: number | null;
  onVerseChange: (verseNum: number) => void;
  onClose: () => void;
}

export function AudioPlayerBar({
  verses,
  activeTranslation,
  bookName,
  chapterNum,
  currentVerseNum,
  onVerseChange,
  onClose,
}: AudioPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update index if currentVerseNum changes externally
  useEffect(() => {
    if (currentVerseNum) {
      const idx = verses.findIndex((v) => v.verse_num === currentVerseNum);
      if (idx !== -1 && idx !== activeIdx) {
        setActiveIdx(idx);
      }
    }
  }, [currentVerseNum, verses]);

  const getCurrentVerseText = (idx: number): string => {
    if (!verses[idx]) return '';
    const vObj = verses[idx];
    const trData = vObj.translations[activeTranslation.code];
    return trData?.text || Object.values(vObj.translations)[0]?.text || '';
  };

  const playVerseAtIndex = (idx: number) => {
    if (idx < 0 || idx >= verses.length) {
      setIsPlaying(false);
      return;
    }

    const currentV = verses[idx];
    setActiveIdx(idx);
    onVerseChange(currentV.verse_num);

    if (!synthRef.current) return;
    synthRef.current.cancel();

    const textToSpeak = getCurrentVerseText(idx);
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playSpeed;
    utterance.volume = isMuted ? 0 : 1;

    // Detect language code
    if (activeTranslation.language === 'Amharic') {
      utterance.lang = 'am-ET';
    } else if (activeTranslation.language === 'Greek') {
      utterance.lang = 'el-GR';
    } else if (activeTranslation.language === 'Hebrew') {
      utterance.lang = 'he-IL';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      if (idx + 1 < verses.length) {
        playVerseAtIndex(idx + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis playback error:', e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      playVerseAtIndex(activeIdx);
    }
  };

  const handleNext = () => {
    if (activeIdx + 1 < verses.length) {
      playVerseAtIndex(activeIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx - 1 >= 0) {
      playVerseAtIndex(activeIdx - 1);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaySpeed(nextSpeed);
    if (isPlaying) {
      playVerseAtIndex(activeIdx);
    }
  };

  const currentVNum = verses[activeIdx]?.verse_num || 1;

  return (
    <aside
      aria-label="Audio Recitation Player"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--border-color)] shadow-2xl rounded-2xl p-3 sm:p-4 text-[var(--text-primary)] transition-all animate-slideUp"
    >
      <div className="flex items-center justify-between gap-2.5">
        {/* Left: Scripture Info */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {isPlaying ? (
              <span className="flex space-x-0.5 items-end h-4">
                <span className="w-1 bg-white h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-white h-4 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-white h-3 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
              {bookName} {chapterNum}:{currentVNum}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] truncate">
              {activeTranslation.name}
            </span>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={activeIdx <= 0}
            className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] disabled:opacity-30 text-[var(--text-secondary)] transition-colors"
            title="Previous Verse"
            aria-label="Previous Verse"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title={isPlaying ? 'Pause Audio Recitation' : 'Play Audio Recitation'}
            aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            disabled={activeIdx >= verses.length - 1}
            className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] disabled:opacity-30 text-[var(--text-secondary)] transition-colors"
            title="Next Verse"
            aria-label="Next Verse"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed & Close */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] font-bold font-mono text-[var(--accent-color)] hover:bg-[var(--border-color)] transition-colors"
            title="Recitation Speed"
          >
            {playSpeed}x
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              if (synthRef.current) synthRef.current.cancel();
              setIsPlaying(false);
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
