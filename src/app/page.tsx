import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import BannerMedia from '@/components/common/BannerMedia';
import {
  Flame,
  Snowflake,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Heart,
  CheckCircle2,
  Award,
  Sparkles,
  Store,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { NEARBY_AREA_NAME } from '@/lib/nearby';
import { MILK_ENABLED } from '@/lib/features';
import SessionHours from '@/components/common/SessionHours';

export const metadata: Metadata = {
  title: 'HopInMohali — Get anything from a nearby shop',
  description:
    'Order 100% pure hot or cold milk with premium dry fruit add-ons, delivered fresh to your doorstep. Genuine homemade quality. Customise your milk your way — place your order in seconds.',
  alternates: {
    canonical: 'https://milk-app-ten.vercel.app',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <section className="relative overflow-hidden border-b border-border-custom">
        <div className="absolute inset-0">
          <BannerMedia src={IMAGES.hero} alt="Glass of fresh milk" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120E0C]/90 via-[#120E0C]/58 to-transparent" />
          <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-28 sm:py-20 md:py-24">
          <div className="max-w-2xl space-y-5">
            <div className="dd-chip bg-emerald-400/15 text-emerald-200 border border-emerald-300/25 backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Pure, Fresh & Vegetarian</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-[3.35rem] font-semibold text-white leading-[1.12]">
              Fresh milk,
              <br className="hidden sm:block" />
              {' '}exactly your way.
            </h1>

            <p className="text-sm sm:text-base text-white/78 leading-relaxed max-w-md">
              Piping hot or chilled cold milk, finished with premium dry fruits. Homemade care, delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {MILK_ENABLED ? (
                <Link href="/order" className="dd-btn-primary">
                  <span>Order now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="dd-btn-ghost bg-white/10 border-white/20 text-white pointer-events-none">
                  Fresh milk · Coming soon
                </span>
              )}
              <Link href="/nearby" className="dd-btn-primary">
                Get Anything Nearby
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/80 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 100% Veg
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" /> Homemade Touch
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" /> Express Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-end gap-4">
            <div>
              <p className="dd-chip bg-primary/8 text-primary mb-2">Choose a style</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                Select milk category
              </h2>
              <p className="text-sm text-muted-fg mt-1">Start with temperature, then customise quantity and add-ons.</p>
            </div>
            {MILK_ENABLED ? (
              <Link href="/order" className="hidden sm:inline-flex text-sm font-bold text-primary hover:underline">
                View all →
              </Link>
            ) : (
              <span className="hidden sm:inline-flex dd-chip bg-gold/15 text-gold">Coming soon</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <Link
              href="/order?type=hot"
              className="group dd-card overflow-hidden hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] transition-all"
            >
              <div className="relative h-40 sm:h-48 bg-[#4A2C1A]">
                <BannerMedia src={IMAGES.hotMilk} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0E0A]/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 dd-chip bg-hot text-white">Boiled warm</span>
              </div>
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-hot/10 text-hot flex items-center justify-center">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">Hot Milk</h3>
                    <p className="text-sm text-muted-fg">Comforting, freshly boiled</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-fg group-hover:text-hot group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>

            <Link
              href="/order?type=cold"
              className="group dd-card overflow-hidden hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] transition-all"
            >
              <div className="relative h-40 sm:h-48 bg-[#1D4E7A]">
                <BannerMedia src={IMAGES.coldMilk} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061824]/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 dd-chip bg-cold text-white">Chilled</span>
              </div>
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cold/10 text-cold flex items-center justify-center">
                    <Snowflake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">Cold Milk</h3>
                    <p className="text-sm text-muted-fg">Refreshing chilled dairy</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-fg group-hover:text-cold group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[1.6rem] border border-border-custom min-h-[220px] sm:min-h-[260px]">
          <BannerMedia src={IMAGES.dryFruits} alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1008]/90 via-[#5A3518]/50 to-transparent" />
          <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
          <div className="relative z-10 p-6 sm:p-10 max-w-lg space-y-3">
            <span className="dd-chip bg-gold/20 text-amber-100 border border-gold/30">
              <Sparkles className="w-3.5 h-3.5" /> Premium add-ons
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              Almonds, cashews, dates & mixed dry fruits.
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Finish your glass with restaurant-style toppings. Add them while you customise — pricing updates instantly.
            </p>
            {MILK_ENABLED ? (
              <Link href="/order" className="dd-btn-primary mt-2">
                Add dry fruits
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="dd-chip bg-white/12 text-white border border-white/20 mt-2">Coming soon</span>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[1.6rem] border border-border-custom min-h-[220px] sm:min-h-[260px]">
          <BannerMedia src={IMAGES.nearby} alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120C08]/90 via-[#4A3018]/50 to-transparent" />
          <div className="absolute inset-0 dd-banner-grain pointer-events-none" />
          <div className="relative z-10 p-6 sm:p-10 max-w-lg space-y-3">
            <span className="dd-chip bg-gold/20 text-amber-100 border border-gold/30">
              <Store className="w-3.5 h-3.5" /> {NEARBY_AREA_NAME} · 5 km
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              Need something from a nearby shop?
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Lunch, groceries, medicines — we’ll buy from shops around {NEARBY_AREA_NAME} and deliver to your room. Applicable procurement and delivery charges apply.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Link href="/nearby" className="dd-btn-primary">
                Get Anything Nearby
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nearby/request?item=Lunch" className="dd-btn-ghost bg-white/10 border-white/20 text-white hover:bg-white/20">
                Lunch in Phase 7
              </Link>
            </div>
            <SessionHours compact />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-6">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Customise', body: 'Pick hot or cold, quantity, and optional dry fruits.' },
              { step: '02', title: 'Pin delivery', body: 'Drop your exact location on the map and add address details.' },
              { step: '03', title: 'Confirm', body: 'Review totals and send the order on WhatsApp in one tap.' },
            ].map((item) => (
              <div key={item.step} className="dd-card p-5 sm:p-6">
                <span className="text-gold font-display text-xl font-semibold">{item.step}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-fg leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <div className="relative overflow-hidden rounded-[1.6rem] min-h-[240px] border border-border-custom">
            <BannerMedia src={IMAGES.farm} alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#122010]/85 via-[#122010]/20 to-transparent" />
            <div className="absolute bottom-0 p-6 text-white">
              <span className="dd-chip bg-white/12 border border-white/15 mb-2">Sourced with care</span>
              <h3 className="font-display text-2xl font-semibold">From trusted local dairies</h3>
            </div>
          </div>

          <div className="dd-surface p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <span className="dd-chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                <Award className="w-3.5 h-3.5" /> 100% Vegetarian
              </span>
              <span className="text-[11px] text-muted-fg font-bold uppercase tracking-wider">Our commitment</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Fresh, homemade & 100% veg
            </h2>
            <p className="text-sm text-muted-fg leading-relaxed">
              We serve something simple, fresh, and genuine. Beverages are <strong className="text-foreground">100% vegetarian</strong>, freshly prepared with a <strong className="text-foreground">homemade touch</strong> so you can drink with confidence.
            </p>
            <p className="text-sm font-semibold text-primary italic">
              Your trust matters. Prepared with genuine care for every customer.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dd-card p-5 space-y-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h4 className="font-display text-lg font-semibold">Pure & hygienic</h4>
            <p className="text-sm text-muted-fg leading-relaxed">Directly sourced from trusted local dairies.</p>
          </div>
          <div className="dd-card p-5 space-y-2">
            <Clock className="w-6 h-6 text-primary" />
            <h4 className="font-display text-lg font-semibold">Express delivery</h4>
            <p className="text-sm text-muted-fg leading-relaxed">Hot milk stays hot, cold milk stays chilled.</p>
          </div>
          <div className="dd-card p-5 space-y-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h4 className="font-display text-lg font-semibold">Pinpoint accuracy</h4>
            <p className="text-sm text-muted-fg leading-relaxed">Exact OpenStreetMap location pin tracking.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
