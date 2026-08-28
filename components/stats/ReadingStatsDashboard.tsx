'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, BookOpen, Layers, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { getReadingStats, ReadingStats } from '@/lib/reading-tracker';

export function ReadingStatsDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<ReadingStats | null>(null);

  useEffect(() => {
    setStats(getReadingStats());
  }, []);

  if (!stats) return null;

  const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const activeDaysCount = stats.weekActivity.filter(Boolean).length;

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
        <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] text-xs font-bold shadow-sm">
          <Trophy className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 1. Current Streak Card (Gold Glow from concept) */}
      <div className="verse-card space-y-1">
        <div className="eyebrow flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Current streak</span>
        </div>
        <div className="font-voice text-4xl text-[var(--text-primary)] font-bold flex items-baseline gap-2">
          <span>{stats.currentStreak}</span>
          <span className="text-sm font-sans font-normal text-[var(--text-muted)]">days</span>
        </div>
        <div className="verse-ref pt-1 flex items-center justify-between">
          <span>Longest streak: {stats.longestStreak} days</span>
          <span className="text-amber-500 font-semibold flex items-center gap-1">
            <span>Active</span>
            <span>🔥</span>
          </span>
        </div>
      </div>

      {/* 2. Metrics Grid (Chapters & Verses) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="row-card flex-col items-start justify-center p-4">
          <div className="row-label flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Chapters read</span>
          </div>
          <div className="row-value text-2xl font-bold text-[var(--text-primary)] pt-1">
            {stats.totalChaptersRead.toLocaleString()}
          </div>
        </div>

        <div className="row-card flex-col items-start justify-center p-4">
          <div className="row-label flex items-center gap-1">
            <Layers className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Verses read</span>
          </div>
          <div className="row-value text-2xl font-bold text-[var(--text-primary)] pt-1">
            {stats.totalVersesRead.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. This Week Tracker (Dots from concept: ●●●●●○○) */}
      <div className="row-card">
        <div>
          <div className="row-label">This week</div>
          <div className="row-value">{activeDaysCount} of 7 days active</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center space-x-1.5 text-base tracking-widest text-[var(--accent-color)]">
            {stats.weekActivity.map((completed, idx) => (
              <span
                key={idx}
                className={completed ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-dim)] opacity-40'}
                title={`${weekDayLabels[idx]}: ${completed ? 'Read' : 'Missed'}`}
              >
                {completed ? '●' : '○'}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-[9px] text-[var(--text-dim)] font-mono">
            {weekDayLabels.map((lbl, idx) => (
              <span key={idx} className="w-3 text-center">{lbl}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Most Read Book Card */}
      <div
        onClick={() => router.push(`/read/${stats.mostReadBookSlug}/1`)}
        className="row-card group"
      >
        <div>
          <div className="row-label">Most read book</div>
          <div className="row-value font-amharic text-base">
            {stats.mostReadBookAmharic || stats.mostReadBookName}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {stats.mostReadBookName} · Tap to continue
          </div>
        </div>
        <span className="gold-dot group-hover:translate-x-1 transition-transform">
          {stats.mostReadBookName} →
        </span>
      </div>

      {/* 5. Continue Reading */}
      {stats.lastRead && (
        <div
          onClick={() => router.push(`/read/${stats.lastRead?.bookSlug}/${stats.lastRead?.chapter}`)}
          className="row-card group"
        >
          <div>
            <div className="row-label">Continue reading</div>
            <div className="row-value font-amharic text-base">
              {stats.lastRead.bookNameAm || stats.lastRead.bookNameEn} {stats.lastRead.chapter}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {stats.lastRead.bookNameEn} Chapter {stats.lastRead.chapter}
            </div>
          </div>
          <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
        </div>
      )}
    </div>
  );
}
