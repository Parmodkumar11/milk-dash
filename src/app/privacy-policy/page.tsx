'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { IMAGES } from '@/lib/images';
import { APP_NAME, APP_CITY } from '@/lib/brand';
import { NEARBY_AREA_NAME, NEARBY_RADIUS_KM } from '@/lib/nearby';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="dd-page pb-28 sm:pb-12 w-full flex-1">
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted transition-all"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker="Trust & transparency"
          title="Privacy Policy"
          subtitle="Effective Date: 16 September 2026 · HopInMohali"
          imageSrc={IMAGES.privacy}
          imageAlt="Privacy and trust"
          tone="slate"
        />
      </div>

      <div className="dd-card p-6 sm:p-8 space-y-6 text-sm text-foreground/80 leading-relaxed">
        <p className="font-medium text-foreground">
          {APP_NAME} (“we”, “us”) helps you get items from nearby shops in {NEARBY_AREA_NAME} and around {APP_CITY}, and may later offer fresh milk delivery. This Privacy Policy explains what information we collect, why we collect it, and how we protect it when you use our website or send a request.
        </p>
        <p className="text-sm dd-surface p-3.5 text-muted-fg italic">
          We only collect what we need to shop for you, deliver to you, and confirm your request. We do not sell your personal information.
        </p>

        <div className="space-y-4 pt-2">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">1. Who this policy covers</h2>
            <p className="text-sm text-foreground/75">
              This policy applies to people who use the {APP_NAME} website, place a nearby-shop request, save a profile, or contact us on WhatsApp or phone. Fresh milk ordering is currently listed as coming soon. If milk ordering is enabled later, the same types of information will be used to complete those orders.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">2. Information we collect</h2>
            <p className="text-sm text-muted-fg mb-2">Depending on how you use {APP_NAME}, we may collect:</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-foreground/75 pl-2">
              <li>Name and 10-digit WhatsApp / mobile number</li>
              <li>Delivery address, room / house / flat number, landmark, and delivery instructions</li>
              <li>Map pin and GPS coordinates if you allow location access or drop a pin on the map</li>
              <li>Item list, quantities, notes, preferred shop, and any cost estimates you enter</li>
              <li>Profile details and request / order history stored on your device</li>
              <li>Theme preference and splash-screen status stored on your device</li>
              <li>Any extra details you send us while chatting on WhatsApp or phone</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">3. Location information</h2>
            <p className="text-sm text-foreground/75">
              Nearby delivery is limited to about {NEARBY_RADIUS_KM} km around {NEARBY_AREA_NAME}. We use the pin you place (and, if you tap locate, your browser’s location) so a shopper can reach the right room or building. Location is used only for delivery and request confirmation. You can refuse browser location and still type an address and drop a pin yourself.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">4. How we use your information</h2>
            <p className="text-sm text-muted-fg mb-2">We use your information to:</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-foreground/75 pl-2">
              <li>Create and confirm nearby-shop requests (and milk orders, when that service is live)</li>
              <li>Buy items from a nearby shop and deliver them to your pin</li>
              <li>Contact you about availability, substitutes, timing, or charges</li>
              <li>Share only what a shopper or delivery person needs to complete the run</li>
              <li>Keep a record of requests you send through WhatsApp</li>
              <li>Improve how the website works</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">5. WhatsApp, phone, and device storage</h2>
            <p className="text-sm text-foreground/75 mb-2">
              When you confirm a request, your browser may open WhatsApp with a pre-filled message that includes your name, phone, address, map link, item list, and fee estimate. That message is sent by you to our WhatsApp number so we can process the request.
            </p>
            <p className="text-sm text-foreground/75">
              Request drafts, profile details, cart data (for milk, when enabled), and display theme may be saved in your browser (local storage). This stays on your device unless you clear site data. We do not run a separate customer database on this website for those drafts.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">6. We do not sell your information</h2>
            <p className="text-sm text-foreground/75">
              We do not sell, rent, or trade your personal information for others’ marketing. We share details only when needed to serve you — for example with a shopper, delivery partner, or WhatsApp / map services you use to send or view the request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">7. Payments</h2>
            <p className="text-sm text-foreground/75">
              Nearby items are billed at the shop’s actual price, plus stated procurement and delivery charges. If you pay online later, a third-party payment provider may process UPI or card details. We do not intend to store your full card, UPI PIN, or bank password on this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">8. Cookies and similar technologies</h2>
            <p className="text-sm text-foreground/75">
              We may use basic cookies or local storage so the site remembers your theme, your draft request, and that you have seen the splash screen. We do not use this for unnecessary advertising.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">9. How we protect information</h2>
            <p className="text-sm text-foreground/75">
              We take reasonable steps to keep request details and communications from being misused. No website, WhatsApp chat, or map link is completely risk-free. Please do not send passwords or extra sensitive data in item notes unless it is needed for delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">10. Children</h2>
            <p className="text-sm text-foreground/75">
              {APP_NAME} is not meant to collect personal information from children without a parent or guardian. If you think a child has sent us details, contact us and we will take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">11. Changes</h2>
            <p className="text-sm text-foreground/75">
              We may update this Privacy Policy when our services change (including when fresh milk ordering goes live). The new version will be posted on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">12. Contact us</h2>
            <p className="text-sm text-foreground/75">
              For questions about this policy or your information, message {APP_NAME} on WhatsApp using the same number you use to send nearby requests, or use the contact options on this website.
            </p>
          </section>

          <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground">
            <h3 className="font-extrabold text-primary mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Our promise
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              Trust matters. {APP_NAME} will handle your name, phone, pin, and shopping list only to hop to a nearby shop and bring items to you — honestly and only for genuine service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
