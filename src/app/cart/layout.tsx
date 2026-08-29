import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart',
  description:
    'Review your customised milk order — adjust quantities, tweak dry fruit add-ons, and check your total before proceeding to delivery.',
  openGraph: {
    title: 'Your Cart | DairyDash',
    description:
      'Review your milk order, adjust quantities and dry fruit add-ons, then proceed to delivery.',
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
