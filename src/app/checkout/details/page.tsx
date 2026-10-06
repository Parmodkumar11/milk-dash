'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Phone, User } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import ScheduleDeliveryFields from '@/components/shop/ScheduleDeliveryFields';
import { isSlotWithinService } from '@/lib/sessions';

function indianMobile(raw: string) {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const deliveryTiming = useCartStore((s) => s.deliveryTiming);
  const scheduledAt = useCartStore((s) => s.scheduledAt);
  const setDeliveryTiming = useCartStore((s) => s.setDeliveryTiming);
  const customer = useCartStore((s) => s.customer);
  const notes = useCartStore((s) => s.notes);
  const deliveryLocation = useCartStore((s) => s.deliveryLocation);
  const updateCustomer = useCartStore((s) => s.updateCustomer);
  const updateNotes = useCartStore((s) => s.updateNotes);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) router.replace('/cart');
    else if (deliveryLocation.latitude == null || deliveryLocation.longitude == null) {
      router.replace('/checkout/location');
    }
  }, [mounted, items.length, deliveryLocation.latitude, deliveryLocation.longitude, router]);

  useEffect(() => {
    if (!mounted) return;
    setName(customer.name);
    setPhone(indianMobile(customer.phone));
    setOrderNote(notes);
  }, [mounted, customer.name, customer.phone, notes]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).get('schedule') === '1') {
      setDeliveryTiming('scheduled');
    }
  }, [mounted, setDeliveryTiming]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const mobile = indianMobile(phone);
    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (deliveryTiming === 'scheduled' && !scheduledAt) {
      setError('Please pick a date and time for scheduled delivery.');
      return;
    }
    if (
      deliveryTiming === 'scheduled' &&
      scheduledAt &&
      !isSlotWithinService(new Date(scheduledAt))
    ) {
      setError('Scheduled time must be within service hours for that day.');
      return;
    }
    setError('');
    updateCustomer({ name: trimmedName, phone: mobile });
    updateNotes(orderNote.trim());
    router.push('/checkout/confirm');
  };

  return (
    <div className="dd-page pb-32 max-w-lg mx-auto">
      <Link
        href="/checkout/location"
        className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Location
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-6">Your details</h1>

      <ScheduleDeliveryFields />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" htmlFor="name">
            <User className="w-4 h-4 text-primary" />
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" htmlFor="phone">
            <Phone className="w-4 h-4 text-primary" />
            Mobile number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(indianMobile(e.target.value))}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
            placeholder="10-digit mobile"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="order-note">
            Order note <span className="text-muted-fg font-normal">(optional)</span>
          </label>
          <textarea
            id="order-note"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm resize-none"
            placeholder="e.g. Please call when you reach"
          />
        </div>
        {error ? <p className="text-sm text-primary font-medium">{error}</p> : null}
        <button type="submit" className="dd-btn-primary w-full justify-center">
          Review order
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
