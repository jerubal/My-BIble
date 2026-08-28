import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'መጽሐፍ ቅዱስ • Multilingual Scripture Reader (66 Books)',
  description: 'Read the 66 canonical books of the Holy Bible in Amharic (1879 Abu Rumi), English (KJV, WEB, ASV, BBE, YLT, Darby, Amplified), Hebrew (WLC), and Greek (SBLGNT).',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'መጽሐፍ ቅዱስ Bible',
  },
  openGraph: {
    title: 'መጽሐፍ ቅዱስ • Multilingual Scripture Reader (66 Books)',
    description: 'Read Holy Scriptures in Amharic, English, Hebrew, and Greek.',
    siteName: 'Multilingual Holy Bible',
  },
};

export const viewport: Viewport = {
  themeColor: '#8c2d19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="sepia">
      <body className="antialiased selection:bg-amber-200 dark:selection:bg-amber-900">
        {children}
      </body>
    </html>
  );
}
