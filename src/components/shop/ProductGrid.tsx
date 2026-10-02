'use client';

import React from 'react';
import type { RequestProduct } from '@/data/request-catalog';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';

type Props = {
  products: RequestProduct[];
  loading?: boolean;
  skeletonCount?: number;
};

export default function ProductGrid({ products, loading, skeletonCount = 8 }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 grid-fade">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
