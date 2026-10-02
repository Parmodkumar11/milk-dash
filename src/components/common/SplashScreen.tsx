'use client';

import React, { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { SERVICE_AREA_LABEL, serviceChargeFormulaLabel } from '@/lib/delivery';
import { serviceHoursSummary } from '@/lib/sessions';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    if (sessionStorage.getItem('hopin-splash-seen')) {
      setShowSplash(false);
      return;
    }

    const exitTimer = setTimeout(() => setPhase('exit'), 1600);
    const hideTimer = setTimeout(() => {
      sessionStorage.setItem('hopin-splash-seen', '1');
      setShowSplash(false);
    }, 2100);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('hopin-splash-seen', '1');
    setPhase('exit');
    setTimeout(() => setShowSplash(false), 400);
  };

  if (!showSplash) return null;

  return (
    <div
      onClick={dismiss}
      className={`fixed inset-0 z-[100] dd-header-yellow flex flex-col items-center justify-center p-8 cursor-pointer select-none transition-all duration-500 ${
        phase === 'exit' ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-black/5">
        <div className="h-full w-1/3 bg-accent-green animate-shimmer" />
      </div>

      <div className="animate-splash-logo flex flex-col items-center text-center space-y-5 max-w-xs">
        <BrandLogo size="lg" onYellow showWordmark />

        <p className="text-sm font-semibold text-ink/85 leading-relaxed">
          Evening delivery from nearby shops — order in seconds.
        </p>

        <div className="flex flex-col gap-2 w-full text-left text-xs font-bold">
          <span className="flex items-center gap-2 dd-chip bg-white/80 border-white">
            <MapPin className="w-3.5 h-3.5 text-accent-green" />
            {SERVICE_AREA_LABEL}
          </span>
          <span className="flex items-center gap-2 dd-chip bg-white/80 border-white">
            <Clock className="w-3.5 h-3.5 text-accent-green" />
            {serviceHoursSummary()} · {serviceChargeFormulaLabel()}
          </span>
        </div>
      </div>

      <p className="absolute bottom-8 text-[10px] font-bold uppercase tracking-widest text-ink/40">
        Tap to continue
      </p>
    </div>
  );
}
