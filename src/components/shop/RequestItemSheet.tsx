'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  FILTER_CATEGORIES,
  type FilterCategoryId,
} from '@/data/filter-categories';
import { useCartStore } from '@/store/cart-store';

const CATEGORY_OPTIONS = FILTER_CATEGORIES.filter((c) => c.id !== 'all') as {
  id: FilterCategoryId;
  label: string;
}[];

type Props = {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  initialCategoryId?: FilterCategoryId;
  source?: 'search' | 'other' | 'global';
  showMedicalDisclaimer?: boolean;
};

export default function RequestItemSheet({
  open,
  onClose,
  initialName = '',
  initialCategoryId = 'others',
  source = 'global',
  showMedicalDisclaimer = false,
}: Props) {
  const addCustomItem = useCartStore((s) => s.addCustomItem);
  const [name, setName] = useState(initialName);
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState<FilterCategoryId>(initialCategoryId);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setCategoryId(initialCategoryId);
    setNote('');
    setError('');
    setShowMedical(showMedicalDisclaimer || initialCategoryId === 'medical');
  }, [open, initialName, initialCategoryId, showMedicalDisclaimer]);

  const [showMedical, setShowMedical] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please describe what you need.');
      return;
    }
    addCustomItem({
      name: trimmed,
      note,
      categoryId,
      source,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center">
      <button type="button" className="absolute inset-0 bg-black/50 animate-fade-in" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-card-bg rounded-t-2xl sm:rounded-2xl border border-border-custom shadow-xl animate-sheet-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border-custom">
          <h2 className="font-bold text-lg">Request an item</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5" htmlFor="req-name">What do you need?</label>
            <input
              id="req-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. USB cable, specific brand biscuits"
              className="w-full rounded-lg border border-border-custom px-3 py-2.5 text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" htmlFor="req-cat">Category</label>
            <select
              id="req-cat"
              value={categoryId}
              onChange={(e) => {
                const id = e.target.value as FilterCategoryId;
                setCategoryId(id);
                setShowMedical(id === 'medical');
              }}
              className="w-full rounded-lg border border-border-custom px-3 py-2.5 text-sm bg-card-bg"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" htmlFor="req-note">
              Additional note <span className="font-normal text-muted-fg">(optional)</span>
            </label>
            <textarea
              id="req-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border-custom px-3 py-2.5 text-sm resize-none"
              placeholder="Brand, size, shop preference…"
            />
          </div>
          {showMedical ? (
            <p className="text-xs text-muted-fg bg-muted rounded-lg p-3 leading-relaxed">
              For prescription medicines, a valid prescription is required. We can help with common OTC and
              pharmacy essentials only.
            </p>
          ) : null}
          {error ? <p className="text-sm font-semibold text-accent-green">{error}</p> : null}
          <button type="submit" className="dd-btn-primary w-full justify-center">Add to cart</button>
        </form>
      </div>
    </div>
  );
}
