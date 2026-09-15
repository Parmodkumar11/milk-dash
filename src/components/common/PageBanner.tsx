import React from 'react';
import BannerMedia from '@/components/common/BannerMedia';

type BannerTone = 'espresso' | 'ember' | 'ice' | 'wood' | 'meadow' | 'shop' | 'slate';

const TONE: Record<BannerTone, string> = {
  espresso: 'from-[#120E0C]/92 via-[#120E0C]/58 to-transparent',
  ember: 'from-[#2A0E0A]/90 via-[#A33A22]/45 to-transparent',
  ice: 'from-[#061824]/92 via-[#1A5A86]/48 to-transparent',
  wood: 'from-[#1A1008]/92 via-[#5A3518]/50 to-transparent',
  meadow: 'from-[#122010]/88 via-[#2F4A28]/45 to-transparent',
  shop: 'from-[#120C08]/92 via-[#4A3018]/50 to-transparent',
  slate: 'from-[#0E1210]/92 via-[#1F3A2A]/48 to-transparent',
};

interface PageBannerProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  compact?: boolean;
  tone?: BannerTone;
}

export default function PageBanner({
  kicker,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  compact = false,
  tone = 'espresso',
}: PageBannerProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.7rem] border border-white/10 shadow-[var(--shadow-soft)] ${
        compact ? 'min-h-[168px] sm:min-h-[200px]' : 'min-h-[210px] sm:min-h-[250px]'
      }`}
    >
      <BannerMedia src={imageSrc} alt={imageAlt} />
      <div className={`absolute inset-0 bg-gradient-to-r ${TONE[tone]}`} />
      <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
      <div className={`relative z-10 ${compact ? 'p-5 sm:p-8' : 'p-6 sm:p-10'} max-w-2xl`}>
        {kicker ? (
          <p className="dd-chip bg-white/12 text-white border border-white/20 backdrop-blur-md mb-3">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display text-[1.65rem] sm:text-3xl md:text-[2.35rem] font-semibold text-white leading-[1.12] drop-shadow-sm">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2.5 text-sm sm:text-[0.95rem] text-white/84 leading-relaxed max-w-md">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
