'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { APP_TAGLINE } from '@/lib/brand';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('hopin-splash-seen')) {
      setShowSplash(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1400);

    const hideTimer = setTimeout(() => {
      sessionStorage.setItem('hopin-splash-seen', '1');
      setShowSplash(false);
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!showSplash) return null;

  return (
    <div
      onClick={() => {
        sessionStorage.setItem('hopin-splash-seen', '1');
        setShowSplash(false);
      }}
      className={`fixed inset-0 z-[100] bg-[#141210] text-white flex flex-col items-center justify-between p-8 transition-all duration-500 cursor-pointer select-none ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="pt-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-extrabold tracking-wider uppercase border border-emerald-500/25">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Nearby shops · Phase 7, Mohali</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-xs">
        <BrandLogo size="lg" inverted />

        <p className="text-sm text-white/70 font-medium italic">
          {APP_TAGLINE}
        </p>

        <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Lunch · Groceries · 5 km</span>
        </div>
      </div>

      <div className="pb-6 text-center space-y-1">
        <p className="text-[11px] text-white/50 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-current inline" /> for your neighbourhood
        </p>
        <span className="text-[9px] text-white/30 tracking-widest uppercase block">Tap anywhere to skip</span>
      </div>
    </div>
  );
}
