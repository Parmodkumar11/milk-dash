import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';

export const metadata: Metadata = {
  title: 'HopInMohali — Order from nearby shops',
  description:
    'Request anything from nearby shops in Phase 7, Mohali. ₹10 per 2 items service charge. Search, browse, or ask for custom items.',
  alternates: {
    canonical: 'https://milk-app-ten.vercel.app',
  },
};

function HomeFallback() {
  return (
    <div className="dd-page max-w-6xl mx-auto pt-4 pb-32">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
