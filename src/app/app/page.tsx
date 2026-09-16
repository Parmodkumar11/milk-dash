import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Smartphone, ShieldCheck } from 'lucide-react';
import { HopInMark } from '@/components/common/BrandLogo';
import AndroidDownloadButton from '@/components/common/AndroidDownloadButton';
import { APP_NAME } from '@/lib/brand';
import { NEARBY_AREA_NAME } from '@/lib/nearby';

export const metadata: Metadata = {
  title: 'Get the Android app',
  description: `Download the ${APP_NAME} Android app for nearby shop requests in ${NEARBY_AREA_NAME}.`,
};

const STEPS = [
  { n: '1', title: 'Download the APK', body: 'Tap Download Android APK. Google Drive opens — choose Download.' },
  { n: '2', title: 'Allow this install', body: 'If Android asks, allow installs from your browser or Files app, then confirm.' },
  { n: '3', title: 'Open HopInMohali', body: 'Install the file, then open the app and request from nearby shops.' },
];

export default function AndroidAppPage() {
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
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-sm bg-on-ink ring-2 ring-white/35">
              <HopInMark />
            </div>
            <p className="dd-chip bg-white/15 text-on-ink border border-white/20 mx-auto">
              <Smartphone className="w-3.5 h-3.5" /> Android
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
              Get the HopInMohali app
            </h1>
            <p className="text-sm text-on-ink/80 leading-relaxed">
              Nearby shop requests on your phone. Not on Google Play yet — we share a direct Android install.
            </p>
            <AndroidDownloadButton tone="onBrand" className="w-full hidden sm:inline-flex" />
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <ol className="space-y-3">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-on-ink text-sm font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-fg leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-fg text-center leading-relaxed">
              Android only. iPhone users can keep using this website.
            </p>
          </div>
        </div>

        <div className="dd-card p-5 flex gap-3 text-sm text-muted-fg leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p>
            The file is our HopInMohali Android build. Your phone may warn because it is not from Play Store — that is expected until we publish there.
          </p>
        </div>

        <Link href="/nearby" className="dd-btn-ghost w-full">
          Continue on the website
        </Link>
      </div>

      <div className="sm:hidden fixed z-[210] left-3 right-3 bottom-[4.75rem]">
        <AndroidDownloadButton className="w-full shadow-[var(--shadow-soft)]" />
      </div>
    </div>
  );
}
