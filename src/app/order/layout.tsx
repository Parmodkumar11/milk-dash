import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customise Your Milk',
  description:
    'Choose hot or cold milk, select your quantity (250ml–1000ml+), and add premium dry fruit add-ons. Fresh milk made your way — order now.',
  openGraph: {
    title: 'Customise Your Milk | DairyDash',
    description:
      'Choose hot or cold milk, select quantity, and add dry fruit add-ons. Fresh homemade milk delivered to your door.',
  },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
