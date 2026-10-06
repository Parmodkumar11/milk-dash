'use client';

import React, { useState } from 'react';
import type { RequestProduct } from '@/data/request-catalog';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton';
import ProductDetailsCarousel from '@/components/shop/ProductDetailsCarousel';

type Props = {
  products: RequestProduct[];
  loading?: boolean;
  skeletonCount?: number;
};

export default function ProductGrid({ products, loading, skeletonCount = 8 }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedIndex = products.findIndex((product) => product.id === selectedProductId);

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
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 grid-fade">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenDetails={() => setSelectedProductId(product.id)}
          />
        ))}
      </div>
      {selectedIndex >= 0 ? (
        <ProductDetailsCarousel
          key={products[selectedIndex].id}
          products={products}
          activeIndex={selectedIndex}
          onClose={() => setSelectedProductId(null)}
          onNavigate={(index) => setSelectedProductId(products[index]?.id ?? null)}
        />
      ) : null}
    </>
  );
}
