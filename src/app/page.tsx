import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Flame, Snowflake, ArrowRight, ShieldCheck, Clock, MapPin, Heart, CheckCircle2, Sparkles, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DairyDash — Fresh Milk Delivered to Your Door',
  description:
    'Order 100% pure hot or cold milk with premium dry fruit add-ons, delivered fresh to your doorstep. Genuine homemade quality. Customise your milk your way — place your order in seconds.',
  alternates: {
    canonical: 'https://milk-app-ten.vercel.app',
  },
};


export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      {/* Hero Section with clear top padding to prevent header collision */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FCFAF6] to-[#F8F8FA] pt-6 pb-10 px-4 sm:px-6 border-b border-border-custom text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Pure, Fresh & Vegetarian</span>
          </div>

          {/* Main Title with crisp line-height */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Fresh Milk. <span className="text-primary">Your Way.</span>
            <br />
            Delivered Fresh to Door.
          </h1>

          <p className="text-xs sm:text-sm text-foreground/70 max-w-md mx-auto leading-relaxed">
            Choose between piping Hot 🔥 or chilled Cold 开启 milk. Customise with premium dry fruits and enjoy genuine homemade quality.
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold px-8 py-3 rounded-xl transition-all shadow-sm active:scale-98 text-sm w-full sm:w-auto"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature Highlights Row */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-foreground/75">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 100% Veg
            </span>
            <span className="text-foreground/30">•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 fill-current" /> Homemade Touch
            </span>
            <span className="text-foreground/30">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" /> Express Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Quick Category Selector Cards (Zomato-style App Tiles) */}
      <section className="py-8 px-4 sm:px-6 bg-[#F8F8FA]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                Select Milk Category
              </h2>
              <p className="text-[11px] text-foreground/60">Choose your preferred temperature to customize</p>
            </div>
            <Link href="/order" className="text-xs font-bold text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hot Milk Category Card */}
            <Link
              href="/order?type=hot"
              className="group bg-white border border-border-custom hover:border-hot/40 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-hot/10 flex items-center justify-center text-hot group-hover:scale-105 transition-transform shrink-0">
                  <Flame className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-extrabold text-base text-foreground">Hot Milk</h3>
                    <span className="text-[9px] bg-hot/10 text-hot font-bold px-1.5 py-0.5 rounded">🔥 Boiled Warm</span>
                  </div>
                  <p className="text-[11px] text-foreground/60">Comforting & soothing boiled milk</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-hot group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>

            {/* Cold Milk Category Card */}
            <Link
              href="/order?type=cold"
              className="group bg-white border border-border-custom hover:border-cold/40 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cold/10 flex items-center justify-center text-cold group-hover:scale-105 transition-transform shrink-0">
                  <Snowflake className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-extrabold text-base text-foreground">Cold Milk</h3>
                    <span className="text-[9px] bg-cold/10 text-cold font-bold px-1.5 py-0.5 rounded">❄️ Chilled</span>
                  </div>
                  <p className="text-[11px] text-foreground/60">Refreshing chilled dairy milk</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-cold group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fresh, Homemade & 100% Veg Statement Banner */}
      <section className="py-8 px-4 sm:px-6 bg-white border-y border-border-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#FCFAF6] border border-border-custom p-5 sm:p-7 rounded-2xl space-y-3 relative">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 100% Vegetarian
              </span>
              <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Our Commitment</span>
            </div>

            <h2 className="text-lg font-extrabold text-foreground tracking-tight">
              Fresh, Homemade & 100% Veg
            </h2>

            <p className="text-xs text-foreground/75 leading-relaxed">
              We care about our customers and believe in serving something that is simple, fresh, and genuine. Our beverages are <strong className="text-foreground font-bold">100% vegetarian</strong>, freshly prepared with care, and made with a <strong className="text-foreground font-bold">homemade touch</strong>. We focus on quality, freshness, and taste so you can enjoy your drink with confidence.
            </p>

            <p className="text-xs font-extrabold text-primary italic pt-1">
              "Your trust matters to us. Prepared with genuine care for every customer."
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Grid */}
      <section className="py-8 px-4 sm:px-6 bg-[#F8F8FA]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
            <div className="p-4 bg-white rounded-xl border border-border-custom shadow-xs space-y-1">
              <ShieldCheck className="w-5 h-5 text-primary mb-1" />
              <h4 className="text-xs font-bold text-foreground">Pure & Hygienic</h4>
              <p className="text-[11px] text-foreground/60 leading-normal">
                Directly sourced from trusted local dairies.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-border-custom shadow-xs space-y-1">
              <Clock className="w-5 h-5 text-primary mb-1" />
              <h4 className="text-xs font-bold text-foreground">Express Delivery</h4>
              <p className="text-[11px] text-foreground/60 leading-normal">
                Hot milk stays hot, cold milk stays chilled.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-border-custom shadow-xs space-y-1">
              <MapPin className="w-5 h-5 text-primary mb-1" />
              <h4 className="text-xs font-bold text-foreground">Pinpoint Accuracy</h4>
              <p className="text-[11px] text-foreground/60 leading-normal">
                Exact OpenStreetMap location pin tracking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
