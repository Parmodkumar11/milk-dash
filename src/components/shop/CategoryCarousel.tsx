'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FILTER_CATEGORIES, type FilterCategoryId } from '@/data/filter-categories';

const CATEGORY_META: Record<
  string,
  { emoji: string; bg: string; imgPath?: string }
> = {
  all: { emoji: '🛒', bg: '#e6f4ea' },
  grocery: { emoji: '🌾', bg: '#fff8e1', imgPath: '/grocery.jpg' },
  'milk-dairy': { emoji: '🥛', bg: '#e3f2fd', imgPath: '/milk-dairy.jpg' },
  snacks: { emoji: '🍟', bg: '#fbe9e7', imgPath: '/snacks.jpg' },
  drinks: { emoji: '🧃', bg: '#e0f2f1', imgPath: '/drinks.jpg' },
  'tea-coffee': { emoji: '☕', bg: '#efebe9', imgPath: '/tea-coffee.jpg' },
  food: { emoji: '🍱', bg: '#fff3e0', imgPath: '/food.jpg' },
  vegetables: { emoji: '🥦', bg: '#f1f8e9', imgPath: '/vegetables.jpg' },
  'dry-fruits': { emoji: '🥜', bg: '#fbe9e7', imgPath: '/dry-fruits.jpg' },
  'personal-care': { emoji: '🧴', bg: '#f3e5f5', imgPath: '/personal-care.jpg' },
  household: { emoji: '🧹', bg: '#eceff1', imgPath: '/household.jpg' },
  medical: { emoji: '💊', bg: '#ffebee', imgPath: '/medical.jpg' },
  others: { emoji: '📦', bg: '#eceff1', imgPath: '/others.jpg' },
};

type Props = {
  active: FilterCategoryId | 'all';
  onChange: (id: FilterCategoryId | 'all') => void;
};

function CategoryChip({
  id,
  label,
  isActive,
  onClick,
}: {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[id] ?? { emoji: '📦', bg: '#eceff1' };
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      data-active={isActive ? 'true' : 'false'}
      onClick={onClick}
      className={`
        flex-shrink-0 flex flex-col items-center gap-1.5
        w-[84px] rounded-2xl py-2 px-1.5 border-2 transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/60
        ${isActive
          ? 'border-accent-green bg-white shadow-md scale-[1.04]'
          : 'border-transparent bg-card-bg hover:border-border-custom hover:bg-white hover:shadow-sm active:scale-[0.97]'
        }
      `}
    >
      {/* Image bubble */}
      <div
        className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-2xl"
        style={{ background: meta.bg }}
      >
        {meta.imgPath && !imgError ? (
          <Image
            src={meta.imgPath}
            alt={label}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl leading-none select-none">{meta.emoji}</span>
        )}
      </div>

      {/* Label — always visible, wraps if needed */}
      <span
        className={`text-[10px] font-bold leading-tight text-center break-words w-full px-0.5 ${isActive ? 'text-accent-green' : 'text-ink'
          }`}
      >
        {label}
      </span>

      {/* Active dot */}
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
      )}
    </button>
  );
}

export default function CategoryCarousel({ active, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  // Scroll active chip into view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeEl = el.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
    }
  }, [active]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      {/* Left arrow — desktop only */}
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-border-custom opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4"
        >
          <ChevronLeft className="w-4 h-4 text-ink" />
        </button>
      )}

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1"
      >
        {FILTER_CATEGORIES.map((chip) => (
          <CategoryChip
            key={chip.id}
            id={chip.id}
            label={chip.label}
            isActive={active === chip.id}
            onClick={() => onChange(chip.id as FilterCategoryId | 'all')}
          />
        ))}
      </div>

      {/* Right arrow — desktop only */}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-border-custom opacity-0 group-hover:opacity-100 transition-opacity translate-x-4"
        >
          <ChevronRight className="w-4 h-4 text-ink" />
        </button>
      )}
    </div>
  );
}
