import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BottomTabBar from '@/components/common/BottomTabBar';
import SplashScreen from '@/components/common/SplashScreen';
import LanguageProvider from '@/components/common/LanguageProvider';
import ServiceLocationProvider from '@/components/common/ServiceLocationProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F8CB46',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://milk-app-ten.vercel.app'),
  title: {
    default: 'HopInMohali — Phase 7 evening delivery',
    template: '%s | HopInMohali',
  },
  description:
    'Order from nearby shops in Phase 7, Mohali. ₹10 per 2 items service charge. Browse quick picks or tell us exactly what you need.',
  keywords: [
    'HopInMohali',
    'Mohali delivery',
    'Phase 7 Mohali',
    'evening delivery',
    'local shop delivery',
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
    title: 'HopInMohali — Phase 7 evening delivery',
    description: '₹10 per 2 items · Phase 7, Mohali only.',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'HopInMohali',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          <ServiceLocationProvider>
            <SplashScreen />
            <Navbar />
            <main className="w-full flex-1 md:pb-8">{children}</main>
            <BottomTabBar />
            <Footer />
          </ServiceLocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
