import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery Details',
  description:
    'Enter your name, WhatsApp number, and delivery address. Pin your location on the map for precise milk delivery right to your door.',
  openGraph: {
    title: 'Delivery Details | DairyDash',
    description:
      'Enter your delivery address and pin your location on the map. Fresh milk delivered precisely to your door.',
  },
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
