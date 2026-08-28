import React from 'react';
import Image from 'next/image';

interface BibleHeroProps {
  /** App name in Amharic, e.g. "መጽሐፍ ቅዱስ" */
  title?: string;
  /** Three short words shown under the title, separated by dividers */
  words?: [string, string, string];
  /** Verse text and reference shown in the footer band */
  verse?: {
    text: string;
    reference: string;
  };
  /** Path to the background image, e.g. "/images/hero-book.jpg" */
  backgroundSrc?: string;
}

export function BibleHero({
  title = 'መጽሐፍ ቅዱስ',
  words = ['Davar', 'Emet', 'Ruach'],
  verse = {
    text: 'ስትመጣ በጢሮአዳ ከአክርጳ ዘንድ የተውሁትን በርኖሱንና መጻሕፍቱን ይልቁንም በብራና የተጻፉትን አምጣልኝ።',
    reference: '2ኛ ጢሞቴዎስ 4፥13',
  },
  backgroundSrc = '/images/hero-book.jpg',
}: BibleHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden bg-black shadow-xl rounded-2xl sm:rounded-3xl"
      aria-label="Bible app splash"
    >
      {/* Background photo */}
      <div className="relative aspect-[3/4] sm:aspect-[16/10] md:aspect-[21/10] lg:aspect-[24/10] w-full min-h-[300px] sm:min-h-[400px] md:min-h-[440px]">
        <Image
          src={backgroundSrc}
          alt="Holy Bible Open on Table with Divine Light"
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

        {/* Title + subtitle, centered above book */}
        <div className="absolute inset-x-0 top-[18%] sm:top-[22%] md:top-[25%] flex flex-col items-center px-4 text-center z-10">
          <h1 className="font-eth text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-[#faf6eb] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] tracking-wide">
            {title}
          </h1>

          <div className="mt-3 sm:mt-5 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
            {words.map((word, i) => (
              <span key={word} className="flex items-center gap-2 sm:gap-4 md:gap-6">
                {i > 0 && (
                  <span
                    className="inline-block h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rotate-45 bg-[#eed698] shadow-sm"
                    aria-hidden="true"
                  />
                )}
                <span className="font-serif text-xs sm:text-sm md:text-base tracking-[0.18em] sm:tracking-[0.28em] text-[#faf6eb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-semibold">
                  {word.toUpperCase()}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Verse footer band */}
      <div className="bg-gradient-to-b from-black/95 to-[#0c0e14] px-4 sm:px-6 py-5 sm:py-7 text-center border-t border-[#c6a86e]/20">
        <p className="font-eth mx-auto max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-[#ebe6da] font-normal drop-shadow-sm">
          &ldquo;{verse.text}&rdquo;
        </p>
        <div className="mx-auto mt-3 sm:mt-4 h-px w-16 sm:w-20 bg-[#c6a86e]" aria-hidden="true" />
        <p className="font-eth mt-2.5 text-xs sm:text-sm tracking-wide text-[#c6a86e] font-semibold">
          {verse.reference}
        </p>
      </div>
    </section>
  );
}

export default BibleHero;
