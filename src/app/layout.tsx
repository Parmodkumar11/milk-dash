import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BottomTabBar from '@/components/common/BottomTabBar';
import SplashScreen from '@/components/common/SplashScreen';
import ThemeProvider from '@/components/common/ThemeProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://milk-app-ten.vercel.app'),
  title: {
    default: 'DairyDash — Fresh Milk Delivered to Your Door',
    template: '%s | DairyDash',
  },
  description:
    'Order fresh hot or cold milk with premium dry fruit add-ons, delivered straight to your doorstep. 100% pure, vegetarian & homemade quality. Customise your milk your way.',
  keywords: [
    'fresh milk delivery',
    'hot milk delivery',
    'cold milk delivery',
    'milk with dry fruits',
    'DairyDash',
    'dairy delivery',
    'homemade milk',
    'milk order online',
    'pure milk',
    'vegetarian dairy',
  ],
  authors: [{ name: 'DairyDash' }],
  creator: 'DairyDash',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/milk-icon.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://milk-app-ten.vercel.app',
    siteName: 'DairyDash',
    title: 'DairyDash — Fresh Milk Delivered to Your Door',
    description:
      'Order fresh hot or cold milk with premium dry fruit add-ons. 100% pure, vegetarian & homemade quality. Customise your milk your way.',
    images: [
      {
        url: '/milk-icon.jpg',
        width: 1024,
        height: 1024,
        alt: 'DairyDash — Fresh Milk Delivery',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'DairyDash — Fresh Milk Delivered to Your Door',
    description:
      'Order fresh hot or cold milk with premium dry fruit add-ons, delivered to your doorstep. Pure. Vegetarian. Homemade.',
    images: ['/milk-icon.jpg'],
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
      className={`${jakarta.variable} antialiased`}
    >
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <SplashScreen />
          <Navbar />
          <main className="w-full flex-1 pb-36 md:pb-16">
            {children}
          </main>
          <BottomTabBar />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
