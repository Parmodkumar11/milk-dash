import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'HopInMohali — Get anything from a nearby shop',
  description:
    'Order 100% pure hot or cold milk with premium dry fruit add-ons, delivered fresh to your doorstep. Genuine homemade quality. Customise your milk your way — place your order in seconds.',
  alternates: {
    canonical: 'https://milk-app-ten.vercel.app',
  },
};

export default function Home() {
  return <HomeContent />;
}
