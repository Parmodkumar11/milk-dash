'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getTodaySession, serviceHoursSummary } from '@/lib/sessions';

export default function SessionHours({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState(() => getTodaySession());

  useEffect(() => {
    setStatus(getTodaySession());
    const timer = window.setInterval(() => setStatus(getTodaySession()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (compact) {
    return (
      <p className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-amber-300" />
        {status.open ? 'Open now' : 'Closed now'} · {status.label}
      </p>
    );
  }

  return (
    <div className="dd-card p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="dd-chip bg-primary/8 text-primary mb-2">
            <Clock className="w-3.5 h-3.5" /> Delivery hours
          </p>
          <h2 className="font-display text-xl font-semibold">When we deliver</h2>
          <p className="text-sm text-muted-fg mt-1">All times in IST</p>
        </div>
        <span
          className={`dd-chip shrink-0 ${
            status.open
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'bg-muted text-muted-fg'
          }`}
        >
          {status.open ? 'Open now' : 'Closed now'}
        </span>
      </div>
      <p className="text-sm font-medium">{serviceHoursSummary()}</p>
    </div>
  );
}
