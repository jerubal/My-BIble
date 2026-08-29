'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import {
  X,
  BookOpen,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  ChevronRight,
  Flame,
  ArrowRight,
  Award,
} from 'lucide-react';
import {
  READING_PLANS,
  ReadingPlan,
  getCompletedPlanDays,
  togglePlanDayCompleted,
} from '@/lib/reading-plans';

interface ReadingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReadingPlansModal({ isOpen, onClose }: ReadingPlansModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(READING_PLANS[0].id);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const currentPlan = READING_PLANS.find((p) => p.id === selectedPlanId) || READING_PLANS[0];

  useEffect(() => {
    if (isOpen) {
      setCompletedDays(getCompletedPlanDays(selectedPlanId));
    }
  }, [isOpen, selectedPlanId]);

  const handleToggleDay = (day: number) => {
    const updated = togglePlanDayCompleted(selectedPlanId, day);
    setCompletedDays(updated);
  };

  const completedCount = completedDays.length;
  const totalDays = currentPlan.durationDays;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--gold-gradient)] text-[#241c08] flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Guided Scripture Reading Plans
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                የመጽሐፍ ቅዱስ ንባብ እቅዶች
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

        {/* Plan Selector Ribbon */}
        <div className="flex items-center space-x-2 overflow-x-auto py-3 border-b border-[var(--border-color)]/70 scrollbar-none">
          {READING_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-[var(--gold-gradient)] text-[#241c08] shadow-md scale-105'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                <span>{plan.badge}</span>
                <span>{plan.title}</span>
              </button>
            );
          })}
        </div>

        {/* Plan Details & Progress Card */}
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              {currentPlan.title} ({currentPlan.titleAm})
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl">
              {currentPlan.description}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <div className="text-sm font-extrabold text-[var(--accent-color)]">
                {progressPercent}% Complete
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-medium">
                {completedCount} of {totalDays} days finished
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--accent-color)] flex items-center justify-center font-bold text-xs text-[var(--text-primary)] shadow-sm">
              {completedCount}/{totalDays}
            </div>
          </div>
        </div>

        {/* Days Checklist */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {currentPlan.days.map((d) => {
            const isDone = completedDays.includes(d.day);
            return (
              <div
                key={d.day}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleDay(d.day)}
                    className="p-1 rounded-full hover:scale-110 transition-transform"
                    title={isDone ? 'Mark unread' : 'Mark finished'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[var(--accent-color)]">
                        Day {d.day}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {d.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 mt-1 flex-wrap gap-y-1">
                      {d.passages.map((p, idx) => (
                        <a
                          key={idx}
                          href={`/read/${p.bookSlug}/${p.chapter}`}
                          onClick={onClose}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--accent-color)]/20 text-[11px] font-semibold text-[var(--text-primary)] border border-[var(--border-color)] transition-colors inline-flex items-center space-x-1"
                        >
                          <BookOpen className="w-3 h-3 text-[var(--accent-color)]" />
                          <span>
                            {p.bookNameEn} ({p.bookNameAm}) {p.chapter}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={`/read/${d.passages[0].bookSlug}/${d.passages[0].chapter}`}
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--gold-gradient)] hover:text-[#241c08] text-[var(--text-primary)] text-xs font-bold transition-all shrink-0 flex items-center space-x-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Progress automatically synced to your device and database.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
