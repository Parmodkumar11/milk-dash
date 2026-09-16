import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import InstagramFollowButton from '@/components/common/InstagramFollowButton';
import { APP_NAME } from '@/lib/brand';
import { INSTAGRAM_HANDLE } from '@/lib/app-links';

export const metadata: Metadata = {
  title: 'Instagram',
  description: `Follow ${APP_NAME} on Instagram @${INSTAGRAM_HANDLE}.`,
};

export default function InstagramPage() {
  return (
    <div className="dd-page pb-28 sm:pb-12">
      <Link
        href="/"
        className="inline-flex p-2.5 mb-6 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted"
        title="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="dd-surface overflow-hidden">
          <div className="bg-primary px-5 pt-6 pb-6 text-on-ink text-center space-y-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
              Follow HopInMohali
            </h1>
            <p className="text-sm text-on-ink/80 leading-relaxed">
              Updates, lunch drops, and nearby hops. Scan the code or open Instagram.
            </p>
            <InstagramFollowButton tone="onBrand" className="w-full hidden sm:inline-flex" />
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="rounded-[1.4rem] overflow-hidden bg-[#3B5BFF]">
              <Image
                src="/instagram-qr.png"
                alt={`Instagram QR code for @${INSTAGRAM_HANDLE}`}
                width={720}
                height={1280}
                className="w-full h-auto"
                priority
              />
            </div>
            <p className="text-center font-display text-xl font-semibold tracking-wide">
              @{INSTAGRAM_HANDLE}
            </p>
            <p className="text-xs text-muted-fg text-center leading-relaxed">
              Scan with your camera, or tap Open Instagram on this phone.
            </p>
          </div>
        </div>

        <Link href="/nearby" className="dd-btn-ghost w-full">
          Continue on the website
        </Link>
      </div>

      <div className="sm:hidden fixed z-[210] left-3 right-3 bottom-[4.75rem]">
        <InstagramFollowButton className="w-full shadow-[var(--shadow-soft)]" />
      </div>
    </div>
  );
}
