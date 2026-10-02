'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICE_AREA_LABEL } from '@/lib/delivery';

export default function ComingSoon({ title = 'This page' }: { title?: string }) {
  return (
    <div className="dd-page pb-28 sm:pb-12 max-w-lg mx-auto text-center space-y-4">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-fg">This section is not available. Start ordering from home — {SERVICE_AREA_LABEL}.</p>
      <Link href="/" className="dd-btn-primary inline-flex justify-center gap-2">
        Go to home
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
