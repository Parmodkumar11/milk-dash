'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Hero banners (rotated with arrows) ─── */
const heroBanners = [
  {
    id: 1,
    headline: 'Stock up on daily essentials',
    sub: 'Fresh milk, doodh, lays & more delivered to your door',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #1a7a2e 0%, #0C831F 45%, #34a853 100%)',
    emoji: '🥛🍌🥦',
    category: 'grocery',
  },
  {
    id: 2,
    headline: 'Morning chai & coffee sorted',
    sub: 'Premium tea, instant coffee, biscuits — all in one order',
    cta: 'Order Now',
    bg: 'linear-gradient(135deg, #7c4c1e 0%, #b56d2a 50%, #e8973a 100%)',
    emoji: '☕🍵🫖',
    category: 'tea-coffee',
  },
  {
    id: 3,
    headline: 'Snacks for every craving',
    sub: 'Chips, namkeen, biscuits & more — delivered fast',
    cta: 'Browse Snacks',
    bg: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #f07b6a 100%)',
    emoji: '🍿🥨🍪',
    category: 'snacks',
  },
];

/* ─── Small promo cards ─── */
const promoCards = [
  {
    id: 2,
    headline: 'Fresh veggies & fruit',
    sub: 'Farm-fresh goodness daily',
    bg: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
    emoji: '🥕',
    category: 'vegetables',
  },
  {
    id: 3,
    headline: 'Household must-haves',
    sub: 'Cleaners, care & more',
    bg: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
    emoji: '🧹',
    category: 'household',
  },
  {
    id: 4,
    headline: 'Dry fruits & nuts',
    sub: 'Almonds, cashews, raisins & more',
    bg: 'linear-gradient(135deg, #795548 0%, #a1887f 100%)',
    emoji: '🥜',
    category: 'dry-fruits',
  },
];

interface PromoBannersProps {
  onCategorySelect: (cat: string) => void;
}

export default function PromoBanners({ onCategorySelect }: PromoBannersProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + heroBanners.length) % heroBanners.length);
  const next = () => setCurrent((c) => (c + 1) % heroBanners.length);
  const banner = heroBanners[current];

  return (
    <div className="space-y-3">
      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden rounded-2xl cursor-pointer select-none"
        style={{ background: banner.bg, minHeight: 160 }}
        onClick={() => onCategorySelect(banner.category)}
      >
        {/* decorative blobs */}
        <div
          className="absolute -right-8 -top-8 w-44 h-44 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.35)' }}
        />
        <div
          className="absolute right-16 bottom-0 w-28 h-28 rounded-full opacity-15"
          style={{ background: 'rgba(255,255,255,0.4)' }}
        />

        {/* content */}
        <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between gap-4">
          <div className="space-y-2 max-w-xs">
            <h2 className="text-white font-extrabold text-xl sm:text-2xl leading-tight">
              {banner.headline}
            </h2>
            <p className="text-white/75 text-sm leading-snug">{banner.sub}</p>
            <button
              type="button"
              className="mt-1 bg-white text-ink font-bold text-sm px-4 py-2 rounded-lg shadow hover:opacity-90 active:scale-[0.97] transition-all"
            >
              {banner.cta}
            </button>
          </div>

          {/* big emoji */}
          <div className="text-6xl sm:text-7xl shrink-0 leading-none select-none">
            {banner.emoji}
          </div>
        </div>

        {/* arrow controls */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center text-white transition-colors"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center text-white transition-colors"
          aria-label="Next banner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/45'
              }`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Small promo cards ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {promoCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCategorySelect(card.category)}
            className="relative overflow-hidden rounded-xl text-left active:scale-[0.97] transition-transform"
            style={{ background: card.bg }}
          >
            {/* decorative blob */}
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'rgba(255,255,255,0.4)' }}
            />
            <div className="relative z-10 p-3 sm:p-4">
              <div className="text-3xl mb-2 leading-none">{card.emoji}</div>
              <p className="text-white font-extrabold text-xs sm:text-sm leading-tight">
                {card.headline}
              </p>
              <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 leading-snug hidden sm:block">
                {card.sub}
              </p>
              <span className="mt-2 inline-block text-[10px] font-bold text-white/90 border border-white/30 rounded px-2 py-0.5">
                Order Now
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
