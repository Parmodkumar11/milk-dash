'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Smartphone } from 'lucide-react';
import { ANDROID_APP_PATH, INSTAGRAM_PATH } from '@/lib/app-links';
import { InstagramGlyph } from '@/components/common/InstagramFollowButton';
import BrandLogo from '@/components/common/BrandLogo';
import { APP_NAME } from '@/lib/brand';
import { useI18n } from '@/components/common/LanguageProvider';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative z-10 bg-ink text-on-ink pt-12 pb-36 md:pb-10 border-t border-gold/25">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-3">
            <BrandLogo size="md" inverted />
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              {t('footer.blurb')}
            </p>
            <p className="text-xs text-white/40" suppressHydrationWarning>
              © {new Date().getFullYear()} {APP_NAME}. {t('footer.rights')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 mb-3">{t('footer.explore')}</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/nearby" className="text-white/75 hover:text-white transition-colors">{t('common.getNearby')}</Link>
              <span className="text-white/40">{t('footer.milkSoon')}</span>
              <Link href="/profile" className="text-white/75 hover:text-white transition-colors">{t('footer.profile')}</Link>
              <Link href="/privacy-policy" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t('footer.privacy')}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 mb-3">{t('footer.getApp')}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={INSTAGRAM_PATH}
                className="p-2.5 rounded-full bg-white/8 hover:bg-white/16 text-pink-300 transition-all"
                title={t('footer.instagram')}
              >
                <InstagramGlyph />
              </Link>

              <Link
                href={ANDROID_APP_PATH}
                className="inline-flex items-center gap-2 bg-on-ink text-ink px-3 py-2 rounded-xl hover:bg-gold/40 transition-all active:scale-95"
                title={t('footer.getApp')}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[9px] text-ink/50 font-semibold tracking-wider uppercase">{t('footer.android')}</span>
                  <span className="text-xs font-extrabold tracking-tight">{t('footer.getApp')}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
