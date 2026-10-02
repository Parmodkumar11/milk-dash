'use client';

import React, { useMemo } from 'react';
import { useCartStore } from '@/store/cart-store';
import {
  formatScheduledIst,
  isSlotWithinService,
  scheduleInputBounds,
  serviceHoursSummary,
} from '@/lib/sessions';

export default function ScheduleDeliveryFields() {
  const deliveryTiming = useCartStore((s) => s.deliveryTiming);
  const scheduledAt = useCartStore((s) => s.scheduledAt);
  const setDeliveryTiming = useCartStore((s) => s.setDeliveryTiming);
  const setScheduledAt = useCartStore((s) => s.setScheduledAt);

  const bounds = useMemo(() => scheduleInputBounds(), []);

  const localValue = scheduledAt
    ? (() => {
        const d = new Date(scheduledAt);
        if (Number.isNaN(d.getTime())) return '';
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      })()
    : '';

  const slotError =
    deliveryTiming === 'scheduled' && scheduledAt && !isSlotWithinService(new Date(scheduledAt))
      ? 'Pick a time within service hours for that day (weekdays 7 PM–12 AM, weekends 24h).'
      : null;

  return (
    <div className="dd-card p-4 space-y-3">
      <h2 className="font-bold text-sm">When should we deliver?</h2>
      <p className="text-xs text-muted-fg">{serviceHoursSummary()}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setDeliveryTiming('asap');
            setScheduledAt(null);
          }}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold border ${
            deliveryTiming === 'asap'
              ? 'bg-brand-yellow text-ink border-brand-yellow'
              : 'border-border-custom'
          }`}
        >
          ASAP
        </button>
        <button
          type="button"
          onClick={() => setDeliveryTiming('scheduled')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold border ${
            deliveryTiming === 'scheduled'
              ? 'bg-brand-yellow text-ink border-brand-yellow'
              : 'border-border-custom'
          }`}
        >
          Schedule
        </button>
      </div>
      {deliveryTiming === 'scheduled' ? (
        <div className="space-y-2">
          <label className="text-xs font-semibold" htmlFor="scheduled-at">
            Date &amp; time (your device timezone)
          </label>
          <input
            id="scheduled-at"
            type="datetime-local"
            min={bounds.min}
            max={bounds.max}
            value={localValue}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                setScheduledAt(null);
                return;
              }
              setScheduledAt(new Date(v).toISOString());
            }}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
          />
          {scheduledAt ? (
            <p className="text-xs text-muted-fg">
              Scheduled: {formatScheduledIst(scheduledAt)} IST
            </p>
          ) : null}
          {slotError ? <p className="text-xs text-primary font-medium">{slotError}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
