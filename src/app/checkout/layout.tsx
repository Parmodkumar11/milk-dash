import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Your Order',
  description:
    'Review your milk order, delivery address, and choose your payment method — online UPI or cash on delivery. Place your order via WhatsApp in one tap.',
  openGraph: {
    title: 'Confirm Your Order | DairyDash',
    description:
      'Review order details and select payment — UPI or Cash on Delivery. Place your milk order via WhatsApp.',
  },
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
