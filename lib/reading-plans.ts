export interface ReadingDay {
  day: number;
  title: string;
  passages: Array<{
    bookSlug: string;
    bookNameEn: string;
    bookNameAm: string;
    chapter: number;
    verseRange?: string;
  }>;
}

export interface ReadingPlan {
  id: string;
  title: string;
  titleAm: string;
  description: string;
  durationDays: number;
  category: 'canonical' | 'gospels' | 'wisdom' | 'topical';
  badge: string;
  days: ReadingDay[];
}

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'gospels-30',
    title: 'The Four Gospels in 30 Days',
    titleAm: 'አራቱ ወንጌላት በ30 ቀናት',
    description: 'Walk through the life, miracles, and teachings of Jesus Christ in Matthew, Mark, Luke, and John.',
    durationDays: 30,
    category: 'gospels',
    badge: '👑 Messiah Life',
    days: [
      { day: 1, title: 'The Birth of the King', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 1 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 2 }] },
      { day: 2, title: 'Baptism & Temptation', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 3 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 4 }] },
      { day: 3, title: 'Sermon on the Mount I', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 5 }] },
      { day: 4, title: 'Sermon on the Mount II', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 6 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 7 }] },
      { day: 5, title: 'Miracles of Authority', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 8 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 9 }] },
      { day: 6, title: 'Sending the Twelve', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 10 }] },
      { day: 7, title: 'Parables of the Kingdom', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 13 }] },
      { day: 8, title: 'Feeding the Multitude', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 14 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 15 }] },
      { day: 9, title: 'The Transfiguration', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 16 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 17 }] },
      { day: 10, title: 'Triumphal Entry', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 21 }] },
      { day: 11, title: 'The Olivet Discourse', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 24 }] },
      { day: 12, title: 'The Cross & Resurrection', passages: [{ bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 27 }, { bookSlug: 'matthew', bookNameEn: 'Matthew', bookNameAm: 'የማቴዎስ ወንጌል', chapter: 28 }] },
      { day: 13, title: 'Mark: The Servant in Action', passages: [{ bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 1 }, { bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 2 }] },
      { day: 14, title: 'Calming the Storm', passages: [{ bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 4 }, { bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 5 }] },
      { day: 15, title: 'Ransom for Many', passages: [{ bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 10 }, { bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 11 }] },
      { day: 16, title: 'The Son of Man Rises', passages: [{ bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 15 }, { bookSlug: 'mark', bookNameEn: 'Mark', bookNameAm: 'የማርቆስ ወንጌል', chapter: 16 }] },
      { day: 17, title: 'Luke: Good News to All', passages: [{ bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 1 }, { bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 2 }] },
      { day: 18, title: 'Ministry in Galilee', passages: [{ bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 4 }, { bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 5 }] },
      { day: 19, title: 'The Good Samaritan', passages: [{ bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 10 }] },
      { day: 20, title: 'The Lost is Found', passages: [{ bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 15 }] },
      { day: 21, title: 'The Road to Emmaus', passages: [{ bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 23 }, { bookSlug: 'luke', bookNameEn: 'Luke', bookNameAm: 'የሉቃስ ወንጌል', chapter: 24 }] },
      { day: 22, title: 'The Word Became Flesh', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 1 }] },
      { day: 23, title: 'Born Again of Spirit', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 3 }, { bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 4 }] },
      { day: 24, title: 'Bread of Life', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 6 }] },
      { day: 25, title: 'Light of the World', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 8 }, { bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 9 }] },
      { day: 26, title: 'The Good Shepherd', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 10 }, { bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 11 }] },
      { day: 27, title: 'The Way, Truth & Life', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 14 }, { bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 15 }] },
      { day: 28, title: 'High Priestly Prayer', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 17 }] },
      { day: 29, title: 'It is Finished', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 18 }, { bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 19 }] },
      { day: 30, title: 'Feed My Sheep', passages: [{ bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 20 }, { bookSlug: 'john', bookNameEn: 'John', bookNameAm: 'የዮሐንስ ወንጌል', chapter: 21 }] },
    ],
  },
  {
    id: 'proverbs-31',
    title: 'Proverbs: 31 Days of Wisdom',
    titleAm: 'ምሳሌ፦ የ31 ቀናት ጥበብ',
    description: 'Read one chapter of King Solomon’s Proverbs every single day of the month for divine wisdom and guidance.',
    durationDays: 31,
    category: 'wisdom',
    badge: '💡 Divine Wisdom',
    days: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      title: `Proverbs Chapter ${i + 1}`,
      passages: [{ bookSlug: 'proverbs', bookNameEn: 'Proverbs', bookNameAm: 'መጽሐፈ ምሳሌ', chapter: i + 1 }],
    })),
  },
  {
    id: 'psalms-peace-14',
    title: '14 Days of Peace & Praise (Psalms)',
    titleAm: 'የ14 ቀናት ሰላምና ምስጋና (መዝሙር)',
    description: 'Comfort your soul and strengthen your prayers with the most powerful Psalms of peace, trust, and worship.',
    durationDays: 14,
    category: 'topical',
    badge: '🕊️ Peace & Trust',
    days: [
      { day: 1, title: 'The Tree by the River', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 1 }, { bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 23 }] },
      { day: 2, title: 'The Lord is My Light', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 27 }] },
      { day: 3, title: 'God is Our Refuge & Strength', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 46 }] },
      { day: 4, title: 'Create in Me a Clean Heart', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 51 }] },
      { day: 5, title: 'He Who Dwells in the Secret Place', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 91 }] },
      { day: 6, title: 'Bless the Lord O My Soul', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 103 }] },
      { day: 7, title: 'Thy Word is a Lamp', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 119 }] },
      { day: 8, title: 'My Help Comes From the Lord', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 121 }] },
      { day: 9, title: 'I Was Glad When They Said', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 122 }] },
      { day: 10, title: 'Unless the Lord Builds', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 127 }] },
      { day: 11, title: 'Fearfully and Wonderfully Made', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 139 }] },
      { day: 12, title: 'The Lord Upholds All Who Fall', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 145 }] },
      { day: 13, title: 'Praise the Lord For He is Good', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 147 }] },
      { day: 14, title: 'Let Everything That Hath Breath Praise', passages: [{ bookSlug: 'psalms', bookNameEn: 'Psalms', bookNameAm: 'መዝሙረ ዳዊት', chapter: 150 }] },
    ],
  },
];

// Helper functions for reading plan progress in localStorage
export function getCompletedPlanDays(planId: string): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`plan_${planId}_completed`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function togglePlanDayCompleted(planId: string, day: number): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCompletedPlanDays(planId);
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort((a, b) => a - b);
    localStorage.setItem(`plan_${planId}_completed`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}
