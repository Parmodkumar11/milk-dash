'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ANDROID_APP_URL, openAndroidApp } from '@/lib/app-links';
import BrandLogo from '@/components/common/BrandLogo';
import { APP_NAME } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#171412] text-[#F4F0EA] pt-12 pb-28 md:pb-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-3">
            <BrandLogo size="md" inverted />
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              Hop to a nearby shop for lunch, groceries, and everyday items. Fresh milk coming soon.
            </p>
            <p className="text-xs text-white/40">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 mb-3">Explore</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/nearby" className="text-white/75 hover:text-white transition-colors">Get Anything Nearby</Link>
              <span className="text-white/40">Order milk · Coming soon</span>
              <Link href="/profile" className="text-white/75 hover:text-white transition-colors">Profile</Link>
              <Link href="/privacy-policy" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 mb-3">Get the app</h3>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/dairy.dash.in?igsi=MXFqZGJrcjZ2cXhjbw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/8 hover:bg-white/16 text-pink-300 transition-all"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href={ANDROID_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  openAndroidApp();
                }}
                className="inline-flex items-center gap-2 bg-white text-[#171412] px-3 py-2 rounded-xl hover:bg-white/90 transition-all active:scale-95"
                title="Get it on Google Play"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.6 2.5C3.2 2.8 3 3.3 3 3.9v16.2c0 .6.2 1.1.6 1.4l.1.1 9.1-9.1v-.2L3.7 2.4l-.1.1z"/>
                  <path fill="#34A853" d="M15.8 15.3l-3-3v-.2l3-3 3.6 2c1 .6 1 1.6 0 2.2l-3.6 2z"/>
                  <path fill="#EA4335" d="M15.8 15.3L12.8 12.3 3.7 21.4c.4.4.9.4 1.5.1l10.6-6.2"/>
                  <path fill="#FBBC05" d="M15.8 8.7L5.2 2.5c-.6-.3-1.1-.3-1.5.1l9.1 9.1 3-3z"/>
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[9px] text-[#171412]/50 font-semibold tracking-wider uppercase">GET IT ON</span>
                  <span className="text-xs font-extrabold tracking-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
