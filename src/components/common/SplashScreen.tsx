'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out after 1.4s, hide completely at 1.8s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1400);

    const hideTimer = setTimeout(() => {
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
      onClick={() => setShowSplash(false)}
      className={`fixed inset-0 z-[100] bg-[#1C1C1C] text-white flex flex-col items-center justify-between p-8 transition-all duration-500 cursor-pointer select-none ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Branding Pill */}
      <div className="pt-8 text-center animate-pulse">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold tracking-wider uppercase border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>100% Pure & Vegetarian</span>
        </div>
      </div>

      {/* Center Animated Logo & Slogan */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-xs">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-4xl shadow-2xl animate-bounce">
          🥛
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Dairy<span className="text-primary">Dash</span>
        </h1>

        <p className="text-xs text-white/70 font-medium italic">
          "Purity in Every Drop. Freshness in Every Sip."
        </p>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Fresh • Homemade Touch • 100% Veg</span>
        </div>
      </div>

      {/* Bottom Footer Quote */}
      <div className="pb-6 text-center space-y-1">
        <p className="text-[11px] text-white/50 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-current inline" /> for Health & Taste
        </p>
        <span className="text-[9px] text-white/30 tracking-widest uppercase block">Tap anywhere to skip</span>
      </div>
    </div>
  );
}
