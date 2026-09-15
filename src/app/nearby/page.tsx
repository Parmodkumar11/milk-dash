import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Clock,
  MapPin,
  ShoppingBag,
  Store,
  ShieldCheck,
  Bike,
} from 'lucide-react';
import BannerMedia from '@/components/common/BannerMedia';
import SessionHours from '@/components/common/SessionHours';
import { IMAGES } from '@/lib/images';
import { NEARBY_DELIVERY_FEE, NEARBY_PROCUREMENT_FEE, NEARBY_RADIUS_KM, NEARBY_AREA_NAME } from '@/lib/nearby';

export const metadata: Metadata = {
  title: 'Get Anything Nearby',
  description:
    'Need something from a nearby shop in Phase 7, Mohali? Lunch, groceries, medicines — we buy nearby and deliver within 5 km.',
};

export default function NearbyLandingPage() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <section className="relative overflow-hidden border-b border-border-custom">
        <div className="absolute inset-0">
          <BannerMedia src={IMAGES.nearby} alt="Nearby local shop" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120C08]/90 via-[#4A3018]/48 to-transparent" />
          <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 sm:py-20">
          <div className="max-w-xl space-y-4 sm:space-y-5">
            <span className="dd-chip bg-gold/20 text-amber-100 border border-gold/30">
              Within {NEARBY_RADIUS_KM} km · {NEARBY_AREA_NAME}
            </span>
            <h1 className="font-display text-[2rem] leading-[1.15] sm:text-5xl font-semibold text-white">
              Need something from a nearby shop?
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Tell us what you need. We’ll buy it and deliver it to your room.
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              We can procure items from nearby shops in {NEARBY_AREA_NAME} and around. Applicable procurement and delivery charges will be added to your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/nearby/request" className="dd-btn-primary w-full sm:w-auto justify-center">
                Get Anything Nearby
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nearby/request?item=Lunch" className="dd-btn-ghost bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto justify-center">
                Lunch in Phase 7
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <SessionHours />
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-12 sm:py-0 sm:pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShoppingBag, title: 'List your items', body: 'Groceries, medicines, snacks, stationery — add as many as you need.' },
            { icon: Store, title: 'We shop nearby', body: `A shopper buys from a local store in ${NEARBY_AREA_NAME}, within about ${NEARBY_RADIUS_KM} km of you.` },
            { icon: Bike, title: 'Delivered to your room', body: 'Pay the actual item cost plus a small procurement and delivery fee.' },
          ].map((card) => (
            <div key={card.title} className="dd-card p-5 space-y-2">
              <card.icon className="w-6 h-6 text-primary" />
              <h2 className="font-display text-lg font-semibold">{card.title}</h2>
              <p className="text-sm text-muted-fg leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-8 md:pb-16">
        <div className="max-w-6xl mx-auto dd-surface p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">Transparent charges</h2>
            <p className="text-sm text-muted-fg leading-relaxed">
              Item prices are billed at what the shop actually charges. Estimates you enter are only a guide.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between gap-4 border-b border-border-custom pb-2">
                <span>Procurement / service</span>
                <span className="font-bold">₹{NEARBY_PROCUREMENT_FEE}</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-border-custom pb-2">
                <span>Delivery (within {NEARBY_RADIUS_KM} km)</span>
                <span className="font-bold">₹{NEARBY_DELIVERY_FEE}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-fg pt-1">
                <MapPin className="w-4 h-4 text-primary" />
                Service area: approximately {NEARBY_RADIUS_KM} km around {NEARBY_AREA_NAME}
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="dd-card p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-sm text-muted-fg">Typical turnaround depends on shop queue and item availability. We’ll update your request status as we shop.</p>
            </div>
            <div className="dd-card p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-fg">If an item is unavailable, we’ll message you before substituting or skipping it.</p>
            </div>
            <Link href="/nearby/request" className="dd-btn-dark w-full">
              Start a request
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
