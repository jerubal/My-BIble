import { getBooks, getTranslations, getDailyVerse } from '@/lib/db';
import { HomePageClient } from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const books = await getBooks();
  const translations = await getTranslations();
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyVerse = await getDailyVerse(todayStr);

  return (
    <HomePageClient
      books={books}
      translations={translations}
      dailyVerse={dailyVerse}
    />
  );
}
