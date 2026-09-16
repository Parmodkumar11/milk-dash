import React from 'react';
import { APP_NAME } from '@/lib/brand';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
  showWordmark?: boolean;
};

const sizes = {
  sm: { box: 'w-8 h-8', text: 'text-[0.95rem]', radius: 'rounded-lg' },
  md: { box: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-[0.95rem] sm:text-[1.2rem] lg:text-[1.3rem]', radius: 'rounded-xl' },
  lg: { box: 'w-20 h-20', text: 'text-3xl sm:text-4xl', radius: 'rounded-2xl' },
};

export function HopInMark({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--brand-red, #E23744)" />
      <path
        d="M10 34c6-2 10-10 12-16"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M22 18c4-6 11-9 18-8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M33 14.5c0 5.2 7 9.6 7 14.2 0 3.4-2.8 5.8-7 5.8s-7-2.4-7-5.8c0-4.6 7-9 7-14.2z"
        fill="var(--brand-cream, #F6F3EC)"
      />
      <circle cx="33" cy="28.2" r="2.4" fill="var(--brand-red, #E23744)" />
      <circle cx="14" cy="36.5" r="1.6" fill="var(--brand-gold, #D4B483)" />
      <circle cx="19" cy="31" r="1.15" fill="var(--brand-gold, #D4B483)" opacity="0.85" />
    </svg>
  );
}

export default function BrandLogo({ size = 'md', inverted = false, showWordmark = true }: BrandLogoProps) {
  const s = sizes[size];
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2.5 group min-w-0">
      <span className={`${s.box} ${s.radius} overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
        <HopInMark />
      </span>
      {showWordmark && (
        <span className={`font-display font-semibold tracking-tight leading-none truncate ${s.text} ${inverted ? 'text-white' : 'text-foreground'}`}>
          HopIn<span className="text-gold">Mohali</span>
        </span>
      )}
      <span className="sr-only">{APP_NAME}</span>
    </span>
  );
}
