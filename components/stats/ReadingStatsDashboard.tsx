'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, BookOpen, Layers, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';

export function ReadingStatsDashboard() {
  const router = useRouter();
  const [streakDays, setStreakDays] = useState<number>(6);
  const [longestStreak, setLongestStreak] = useState<number>(21);
  const [chaptersRead, setChaptersRead] = useState<number>(142);
  const [versesRead, setVersesRead] = useState<number>(3481);
  const [weekDots, setWeekDots] = useState<boolean[]>([true, true, true, true, true, false, false]);

  useEffect(() => {
    // Load local stats if stored
    try {
      const savedStats = localStorage.getItem('ruth_reading_stats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        if (parsed.streakDays) setStreakDays(parsed.streakDays);
        if (parsed.longestStreak) setLongestStreak(parsed.longestStreak);
        if (parsed.chaptersRead) setChaptersRead(parsed.chaptersRead);
        if (parsed.versesRead) setVersesRead(parsed.versesRead);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-4 animate-fadeIn pb-24">
      {/* Topbar Header */}
      <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)] block">
            Reading Analytics
          </span>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Your Reading</h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 1. Current Streak Card (Gold Glow) */}
      <div className="verse-card space-y-1">
        <div className="eyebrow flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Current streak</span>
        </div>
        <div className="font-voice text-4xl text-[var(--text-primary)] font-bold flex items-baseline gap-2">
          <span>{streakDays}</span>
          <span className="text-sm font-sans font-normal text-[var(--text-muted)]">days</span>
        </div>
        <div className="verse-ref pt-1 flex items-center justify-between">
          <span>Longest streak: {longestStreak} days</span>
          <span className="text-amber-500 font-semibold">Active 🔥</span>
        </div>
      </div>

      {/* 2. Parallel Metrics Grid (Chapters & Verses) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="row-card flex-col items-start justify-center p-4">
          <div className="row-label flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Chapters read</span>
          </div>
          <div className="row-value text-2xl font-bold text-[var(--text-primary)] pt-1">
            {chaptersRead.toLocaleString()}
          </div>
        </div>

        <div className="row-card flex-col items-start justify-center p-4">
          <div className="row-label flex items-center gap-1">
            <Layers className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Verses read</span>
          </div>
          <div className="row-value text-2xl font-bold text-[var(--text-primary)] pt-1">
            {versesRead.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. This Week Tracker (Dots from concept: ●●●●●○○) */}
      <div className="row-card">
        <div>
          <div className="row-label">This week</div>
          <div className="row-value">5 of 7 days completed</div>
        </div>
        <div className="flex items-center space-x-1.5 text-base tracking-widest text-[var(--accent-color)]">
          {weekDots.map((completed, idx) => (
            <span key={idx} className={completed ? 'text-[var(--accent-color)]' : 'text-[var(--text-dim)]'}>
              {completed ? '●' : '○'}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Most Read Book Card */}
      <div
        onClick={() => router.push('/read/psalms/1')}
        className="row-card group"
      >
        <div>
          <div className="row-label">Most read book</div>
          <div className="row-value font-amharic text-base">መዝሙረ ዳዊት</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Psalms · 150 Chapters</div>
        </div>
        <span className="gold-dot group-hover:translate-x-1 transition-transform">Psalms →</span>
      </div>

      {/* 5. Recommended Next Chapter */}
      <div
        onClick={() => router.push('/read/ruth/2')}
        className="row-card group"
      >
        <div>
          <div className="row-label">Continue reading</div>
          <div className="row-value font-amharic text-base">መጽሐፈ ሩት 2</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Book of Ruth Chapter 2</div>
        </div>
        <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  );
}
