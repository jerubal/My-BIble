'use client';

import React from 'react';

export type MainTab = 'home' | 'read' | 'study' | 'stats' | 'saved' | 'cover';

interface BottomNavigationProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
}

export function BottomNavigation({ activeTab, onChangeTab }: BottomNavigationProps) {
  const tabs: Array<{ id: MainTab; label: string; icon: string }> = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'read', label: 'Read', icon: '▤' },
    { id: 'study', label: 'Study', icon: '✦' },
    { id: 'stats', label: 'Stats', icon: '◔' },
    { id: 'saved', label: 'Saved', icon: '☆' },
  ];

  return (
    <nav className="bottomnav select-none" aria-label="Main Navigation">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChangeTab(t.id)}
            className="navitem focus:outline-none"
            aria-label={t.label}
          >
            <span className={`navicon ${isActive ? 'active' : ''}`}>{t.icon}</span>
            <span className={`navlabel ${isActive ? 'active' : ''}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
