import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nearby Shop Procurement',
  description:
    'Need something from a nearby shop in Phase 7, Mohali? Lunch, groceries, medicines — delivered within 5 km.',
};

export default function NearbyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
