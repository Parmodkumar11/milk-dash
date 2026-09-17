'use client';

import React from 'react';
import Link from 'next/link';
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
import {
  NEARBY_PROCUREMENT_FEE,
  NEARBY_DELIVERY_FEE,
  NEARBY_RADIUS_KM,
  NEARBY_AREA_NAME,
} from '@/lib/nearby';
import { useI18n } from '@/components/common/LanguageProvider';

export default function NearbyLanding() {
  const { t } = useI18n();
  const km = NEARBY_RADIUS_KM;
  const area = NEARBY_AREA_NAME;

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <section className="relative overflow-hidden border-b border-border-custom">
        <div className="absolute inset-0">
          <BannerMedia src={IMAGES.nearby} alt="Nearby local shop" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3A1216]/90 via-[#E23744]/42 to-transparent" />
          <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 sm:py-20">
          <div className="max-w-xl space-y-4 sm:space-y-5">
            <span className="dd-chip bg-gold/20 text-amber-100 border border-gold/30">
              {t('nearby.badge', { km, area })}
            </span>
            <h1 className="font-display text-[2rem] leading-[1.15] sm:text-5xl font-semibold text-white">
              {t('nearby.title')}
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              {t('nearby.lead')}
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              {t('nearby.body', { area })}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/nearby/request" className="dd-btn-primary w-full sm:w-auto justify-center">
                {t('common.getNearby')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nearby/request?item=Lunch" className="dd-btn-ghost bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto justify-center">
                {t('nearby.lunchCta')}
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
            { icon: ShoppingBag, title: t('nearby.listTitle'), body: t('nearby.listBody') },
            { icon: Store, title: t('nearby.shopTitle'), body: t('nearby.shopBody', { area, km }) },
            { icon: Bike, title: t('nearby.payTitle'), body: t('nearby.payBody', { proc: NEARBY_PROCUREMENT_FEE, del: NEARBY_DELIVERY_FEE, km }) },
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
            <h2 className="font-display text-2xl font-semibold">{t('nearby.pricing')}</h2>
            <p className="text-sm text-muted-fg leading-relaxed">
              {t('nearby.pricingBody')}
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between gap-4 border-b border-border-custom pb-2">
                <span>{t('nearby.shopBill')}</span>
                <span className="font-bold">{t('nearby.shopCharges')}</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-border-custom pb-2">
                <span>{t('nearby.procurement')}</span>
                <span className="font-bold">₹{NEARBY_PROCUREMENT_FEE}</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-border-custom pb-2">
                <span>{t('nearby.deliveryWithin', { km })}</span>
                <span className="font-bold">₹{NEARBY_DELIVERY_FEE}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-fg pt-1">
                <MapPin className="w-4 h-4 text-primary" />
                {t('nearby.withinOf', { km, area })}
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="dd-card p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-sm text-muted-fg">{t('nearby.turnaround')}</p>
            </div>
            <div className="dd-card p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-fg">{t('nearby.unavailable')}</p>
            </div>
            <Link href="/nearby/request" className="dd-btn-dark w-full">
              {t('nearby.start')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
