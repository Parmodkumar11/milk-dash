import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import BannerMedia from '@/components/common/BannerMedia';
import { IMAGES } from '@/lib/images';
import { NEARBY_AREA_NAME } from '@/lib/nearby';

export default function ComingSoon({ title = 'Fresh milk' }: { title?: string }) {
  return (
    <div className="dd-page pb-28 sm:pb-12">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-border-custom min-h-[280px] sm:min-h-[340px]">
        <BannerMedia src={IMAGES.hero} alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A1216]/92 via-[#E23744]/40 to-transparent" />
        <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
        <div className="relative z-10 p-6 sm:p-10 max-w-lg space-y-4">
          <span className="dd-chip bg-gold/20 text-amber-100 border border-gold/30">
            <Clock className="w-3.5 h-3.5" /> Coming soon
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-tight">
            {title} is coming soon
          </h1>
          <p className="text-sm text-white/75 leading-relaxed">
            Hot milk, cold milk, and dry fruit add-ons are temporarily disabled. Nearby shop requests in {NEARBY_AREA_NAME} are available now.
          </p>
          <Link href="/nearby" className="dd-btn-primary">
            Get Anything Nearby
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
