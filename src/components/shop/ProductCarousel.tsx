'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { RequestProduct } from '@/data/request-catalog';
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailsCarousel from '@/components/shop/ProductDetailsCarousel';

type Props = {
  products: RequestProduct[];
  /** If true, first 3 cards are priority-loaded */
  priorityCount?: number;
};

export default function ProductCarousel({ products, priorityCount = 3 }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Small delay to let layout settle
    const t = setTimeout(checkScroll, 80);
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      clearTimeout(t);
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, products]);

  const CARD_W = 160; // px — matches the card width below

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // Snap to next group of visible cards
    const visibleCards = Math.floor(el.clientWidth / CARD_W);
    el.scrollBy({
      left: dir === 'left' ? -(visibleCards * CARD_W) : visibleCards * CARD_W,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <>
    <div className="relative group">
      {/* ── Left arrow ── */}
      <button
        type="button"
        aria-label="Scroll products left"
        onClick={() => scroll('left')}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-10
          hidden sm:flex items-center justify-center
          w-9 h-9 rounded-full bg-white shadow-lg border border-border-custom
          transition-all duration-200 -translate-x-4
          ${canScrollLeft
            ? 'opacity-0 group-hover:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5 text-ink" />
      </button>

      {/* ── Scrollable track ── */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="flex-shrink-0"
            style={{
              width: CARD_W,
              scrollSnapAlign: 'start',
            }}
          >
            <ProductCard
              product={product}
              priority={idx < priorityCount}
              onOpenDetails={() => setSelectedIndex(idx)}
            />
          </div>
        ))}
      </div>

      {/* ── Right arrow ── */}
      <button
        type="button"
        aria-label="Scroll products right"
        onClick={() => scroll('right')}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-10
          hidden sm:flex items-center justify-center
          w-9 h-9 rounded-full bg-white shadow-lg border border-border-custom
          transition-all duration-200 translate-x-4
          ${canScrollRight
            ? 'opacity-0 group-hover:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        <ChevronRight className="w-5 h-5 text-ink" />
      </button>
    </div>
    {selectedIndex !== null ? (
      <ProductDetailsCarousel
        key={products[selectedIndex].id}
        products={products}
        activeIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    ) : null}
    </>
  );
}
