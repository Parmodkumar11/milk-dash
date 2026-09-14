'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ANDROID_APP_URL, openAndroidApp } from '@/lib/app-links';

export default function Footer() {
  return (
    <footer className="relative z-[60] bg-foreground text-background/80 pt-3 pb-20 md:pb-3 border-t border-[#3C2D21]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-row items-center justify-between gap-4 text-xs overflow-x-auto whitespace-nowrap">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                🥛
              </span>
              DairyDash
            </span>
            <span className="text-background/40">|</span>
            <span className="text-background/60 text-[11px]">Fresh Milk Delivery</span>
          </div>

          {/* Social Links & Google Play Badge */}
          <div className="flex items-center gap-3">
            {/* Instagram Icon Link */}
            <a
              href="https://www.instagram.com/dairy.dash.in?igsi=MXFqZGJrcjZ2cXhjbw=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-400 transition-all shrink-0"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* GET IT ON Google Play Badge */}
            <a
              href={ANDROID_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                openAndroidApp();
              }}
              className="inline-flex items-center gap-2 bg-black text-white border border-white/20 px-2.5 py-1 rounded-lg hover:border-white/40 transition-all active:scale-95 shrink-0"
              title="Get it on Google Play"
            >
              {/* Play Store Triangle Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M3.6 2.5C3.2 2.8 3 3.3 3 3.9v16.2c0 .6.2 1.1.6 1.4l.1.1 9.1-9.1v-.2L3.7 2.4l-.1.1z"/>
                <path fill="#34A853" d="M15.8 15.3l-3-3v-.2l3-3 3.6 2c1 .6 1 1.6 0 2.2l-3.6 2z"/>
                <path fill="#EA4335" d="M15.8 15.3L12.8 12.3 3.7 21.4c.4.4.9.4 1.5.1l10.6-6.2"/>
                <path fill="#FBBC05" d="M15.8 8.7L5.2 2.5c-.6-.3-1.1-.3-1.5.1l9.1 9.1 3-3z"/>
              </svg>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[7px] text-gray-300 font-semibold tracking-wider uppercase">GET IT ON</span>
                <span className="text-[11px] font-extrabold text-white tracking-tight">Google Play</span>
              </div>
            </a>

            {/* Privacy Policy Icon Link */}
            <a
              href="/privacy-policy"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-400 transition-all shrink-0"
              title="Privacy Policy"
            >
              <ShieldCheck className="w-4 h-4" />
            </a>

            {/* Copyright */}
            <span className="text-background/50 text-[11px] ml-1">
              © {new Date().getFullYear()} DairyDash
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
