'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { ANDROID_APP_URL } from '@/lib/app-links';

export default function AndroidDownloadButton({
  className = '',
  tone = 'primary',
}: {
  className?: string;
  tone?: 'primary' | 'onBrand';
}) {
  const styles =
    tone === 'onBrand'
      ? 'inline-flex items-center justify-center gap-2 rounded-[0.95rem] bg-on-ink text-primary font-bold px-6 py-3.5 hover:bg-gold/90 transition-colors'
      : 'dd-btn-primary';

  return (
    <a
      href={ANDROID_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles} ${className}`}
    >
      <Download className="w-4 h-4" />
      Download Android APK
    </a>
  );
}
