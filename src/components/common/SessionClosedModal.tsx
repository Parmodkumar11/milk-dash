'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getNextHopCopy, getTodaySession } from '@/lib/sessions';

const FUNNY_GIFS = [
  { src: '/gifs/nope.png', alt: 'Nope, not yet' },
  { src: '/gifs/wait.png', alt: 'Waiting it out' },
  { src: '/gifs/sleepy.png', alt: 'Still sleepy' },
] as const;

const FUNNY_LINES = [
  { title: 'Too early to hop.', body: 'Weekdays: 7 PM–12 AM. Weekends: 24 hours. Or schedule for a valid slot.' },
  { title: 'Hold that order.', body: 'WhatsApp orders open at 7 PM IST.' },
  { title: 'Nice try, early bird.', body: 'We love the energy — orders start at 7 PM.' },
] as const;

export default function SessionClosedModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const nextHop = getNextHopCopy();
  const session = getTodaySession();
  const gif = useMemo(
    () => FUNNY_GIFS[Math.floor(Math.random() * FUNNY_GIFS.length)],
    [open]
  );
  const line = useMemo(
    () => FUNNY_LINES[Math.floor(Math.random() * FUNNY_LINES.length)],
    [open]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-closed-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 bg-card-bg rounded-t-[1.6rem] sm:rounded-[1.6rem] w-full max-w-md overflow-hidden animate-slide-up sm:animate-none border border-border-custom shadow-[var(--shadow-soft)]">
        <div className="relative bg-muted aspect-[16/10] overflow-hidden">
          <img
            src={gif.src}
            alt={gif.alt}
            className="h-full w-full object-cover animate-session-gif"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/45 text-white hover:bg-black/60"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <p className="dd-chip bg-primary/8 text-primary mb-2">Outside service hours</p>
            <h3 id="session-closed-title" className="font-display text-2xl font-semibold text-foreground leading-tight">
              {line.title}
            </h3>
            <p className="text-sm text-muted-fg mt-2 leading-relaxed">{line.body}</p>
          </div>

          <div className="dd-surface p-3.5 text-sm">
            <p className="font-bold text-foreground">
              {nextHop ? `We open again at ${nextHop.time} IST.` : 'Sat–Sun: 24h · Mon–Fri: 7 PM–12 AM.'}
            </p>
            <p className="text-muted-fg mt-1">Today&apos;s window: {session.label}</p>
          </div>

          <button type="button" onClick={onClose} className="dd-btn-primary w-full">
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
