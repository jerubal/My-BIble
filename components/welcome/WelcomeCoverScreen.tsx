'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowRight, BookOpen } from 'lucide-react';

interface WelcomeCoverScreenProps {
  onEnter: () => void;
  lastRead?: {
    bookSlug: string;
    bookName: string;
    chapter: number;
  } | null;
}

export function WelcomeCoverScreen({ onEnter, lastRead }: WelcomeCoverScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-black text-[#faf6eb] select-none"
      aria-label="Holy Bible Welcoming Poster"
    >
      {/* Background Sacred Poster Artwork */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/welcome-cover.jpg"
          alt="Holy Bible Open on Altar with Celestial Light"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Soft atmospheric overlay preserving artwork vibrancy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/85 pointer-events-none" />
      </div>

      {/* Top Region: Title & Divine Attributes */}
      <div className="relative z-10 pt-6 sm:pt-10 px-4 text-center flex flex-col items-center shrink-0">
        {/* Ethiopic Holy Bible Title */}
        <h1 className="font-eth text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
          መጽሐፍ ቅዱስ
        </h1>

        {/* Triple Sacred Words: DAVAR ◆ EMET ◆ RUACH */}
        <div className="mt-2.5 sm:mt-4 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="font-serif text-xs sm:text-base md:text-lg font-bold tracking-[0.2em] text-[#faf6eb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            DAVAR
          </span>
          <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rotate-45 bg-[#f0d48f] shadow-md" />
          <span className="font-serif text-xs sm:text-base md:text-lg font-bold tracking-[0.2em] text-[#faf6eb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            EMET
          </span>
          <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rotate-45 bg-[#f0d48f] shadow-md" />
          <span className="font-serif text-xs sm:text-base md:text-lg font-bold tracking-[0.2em] text-[#faf6eb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            RUACH
          </span>
        </div>
      </div>

      {/* Middle Spacer to let the glorious central Holy Bible artwork shine */}
      <div className="relative z-10 flex-1 min-h-0" />

      {/* Bottom Region: Scripture Verse Banner & The Arrow Button */}
      <div className="relative z-10 pb-6 sm:pb-10 px-4 sm:px-6 text-center flex flex-col items-center space-y-4 sm:space-y-5 shrink-0">
        {/* Sacred Verse Banner from 2nd Timothy 4:13 */}
        <div className="max-w-xl mx-auto space-y-1.5 bg-black/60 backdrop-blur-md px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl border border-[#c6a86e]/30 shadow-2xl">
          <p className="font-eth text-xs sm:text-base md:text-lg leading-relaxed text-[#ede7dc] font-normal drop-shadow">
            ስትመጣ በጢሮአዳ ከአክርጳ ዘንድ የተውሁትን በርኖሱንና መጻሕፍቱን ይልቁንም በብራና የተጻፉትን አምጣልኝ።
          </p>
          <p className="font-eth text-[10px] sm:text-xs font-semibold tracking-wider text-[#e6ca85]">
            2ኛ ጢሞቴዎስ 4፥13
          </p>
        </div>

        {/* The Action Arrow: Takes User Directly to Bible App */}
        <button
          onClick={onEnter}
          className="group relative inline-flex flex-col items-center justify-center focus:outline-none cursor-pointer"
          aria-label="Enter Bible App"
        >
          {/* Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-[#c6a86e]/40 blur-xl group-hover:bg-[#c6a86e]/60 group-hover:scale-125 transition-all duration-300 animate-pulse" />

          {/* Capsule Button */}
          <div className="relative flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#1c1813] via-[#2e2316] to-[#1c1813] border border-[#e6ca85] shadow-2xl backdrop-blur-md group-hover:border-white transition-all transform group-hover:-translate-y-0.5 active:scale-95">
            <span className="font-eth text-xs sm:text-sm md:text-base font-bold text-white tracking-wide">
              {lastRead ? `ወደ መጽሐፍ ቅዱስ ግባ (${lastRead.bookName})` : 'ወደ መጽሐፍ ቅዱስ ይግቡ • Open Bible'}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e6ca85] text-black flex items-center justify-center font-bold shadow-lg group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          <div className="mt-1.5 flex items-center space-x-1 text-[10px] sm:text-[11px] text-[#e6ca85] tracking-widest uppercase font-semibold">
            <span>ENTER BIBLE APP</span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </div>
        </button>
      </div>
    </div>
  );
}
