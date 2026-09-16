'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, MapPin, Receipt, Radio } from 'lucide-react';

const steps = [
  { name: 'Request', path: '/nearby/request', icon: ClipboardList },
  { name: 'Location', path: '/nearby/location', icon: MapPin },
  { name: 'Review', path: '/nearby/review', icon: Receipt },
  { name: 'Track', path: '/nearby/track', icon: Radio },
];

export default function NearbyStepper() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 mb-6" aria-label="Nearby request steps">
      {steps.map((step) => {
        const Icon = step.icon;
        const active = pathname === step.path;
        return (
          <Link
            key={step.path}
            href={step.path}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              active
                ? 'bg-primary text-white border-primary'
                : 'bg-card-bg text-muted-fg border-border-custom hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {step.name}
          </Link>
        );
      })}
    </nav>
  );
}
