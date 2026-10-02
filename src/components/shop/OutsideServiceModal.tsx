'use client';

import { MapPinOff } from 'lucide-react';
import { SERVICE_AREA_LABEL } from '@/lib/delivery';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function OutsideServiceModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="dd-card w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-full bg-primary/10 text-primary">
            <MapPinOff className="w-5 h-5" />
          </span>
          <h2 className="font-display text-lg font-semibold">Outside service area</h2>
        </div>
        <p className="text-sm text-muted-fg leading-relaxed">
          We currently serve <strong className="text-foreground">{SERVICE_AREA_LABEL}</strong> only.
          Please choose a delivery point inside Phase 7 to continue.
        </p>
        <button type="button" className="dd-btn-primary w-full justify-center" onClick={onClose}>
          OK, I will adjust location
        </button>
      </div>
    </div>
  );
}
