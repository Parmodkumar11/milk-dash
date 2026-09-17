import type { Metadata } from 'next';
import NearbyLanding from '@/components/nearby/NearbyLanding';

export const metadata: Metadata = {
  title: 'Get Anything Nearby',
  description:
    'Need something from a nearby shop in Phase 7, Mohali? Lunch, groceries, medicines — we buy nearby and deliver within 5 km.',
};

export default function NearbyLandingPage() {
  return <NearbyLanding />;
}
