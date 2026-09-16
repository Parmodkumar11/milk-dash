import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BottomTabBar from '@/components/common/BottomTabBar';
import SplashScreen from '@/components/common/SplashScreen';
import ThemeProvider from '@/components/common/ThemeProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#E23744',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://milk-app-ten.vercel.app'),
  title: {
    default: 'HopInMohali — Get anything from a nearby shop',
    template: '%s | HopInMohali',
  },
  description:
    'HopInMohali fetches lunch, groceries, medicines and more from nearby shops in Phase 7, Mohali — delivered within about 5 km. Fresh milk coming soon.',
  keywords: [
    'HopInMohali',
    'HopIn',
    'Mohali delivery',
    'Phase 7 Mohali',
    'nearby shop delivery',
    'lunch delivery Mohali',
    'grocery fetch',
  ],
  authors: [{ name: 'HopInMohali' }],
  creator: 'HopInMohali',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://milk-app-ten.vercel.app',
    siteName: 'HopInMohali',
    title: 'HopInMohali — Get anything from a nearby shop',
    description:
      'Lunch, groceries, medicines from nearby shops in Phase 7, Mohali. Delivered within about 5 km.',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'HopInMohali',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'HopInMohali — Get anything from a nearby shop',
    description:
      'Lunch, groceries, medicines from nearby shops in Phase 7, Mohali. Delivered within about 5 km.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="antialiased"
    >
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <SplashScreen />
          <Navbar />
          <main className="w-full flex-1 md:pb-8">
            {children}
          </main>
          <BottomTabBar />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
