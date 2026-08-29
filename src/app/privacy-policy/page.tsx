'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-28 sm:pb-12 w-full flex-1">
      {/* Header */}
      <div className="mb-6 pb-3 border-b border-border-custom flex justify-between items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Privacy Policy</span>
          </h1>
          <p className="text-xs text-foreground/60">Effective Date: August 29, 2026</p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full border border-border-custom bg-white text-foreground/70 hover:text-foreground hover:bg-[#FCFAF6] transition-all shadow-xs shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-border-custom p-6 sm:p-8 rounded-2xl shadow-xs space-y-6 text-sm text-foreground/80 leading-relaxed">
        <p className="font-medium text-foreground">
          We care about our customers and respect your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website or place an order with us.
        </p>
        <p className="text-xs bg-[#FCFAF6] p-3.5 rounded-xl border border-border-custom text-foreground/70 italic">
          We believe in being genuine and transparent with our customers. We only collect information that is needed to provide our products and services to you.
        </p>

        <div className="space-y-4 pt-2">
          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">1. Information We Collect</h2>
            <p className="text-xs text-foreground/70 mb-2">When you use our website or place an order, we may collect:</p>
            <ul className="list-disc list-inside text-xs space-y-1 text-foreground/75 pl-2">
              <li>Your name</li>
              <li>Phone number</li>
              <li>Delivery address</li>
              <li>House or apartment number</li>
              <li>Order details</li>
              <li>Any information you choose to provide while contacting us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">2. How We Use Your Information</h2>
            <p className="text-xs text-foreground/70 mb-2">We use your information only when needed to:</p>
            <ul className="list-disc list-inside text-xs space-y-1 text-foreground/75 pl-2">
              <li>Process and confirm your order</li>
              <li>Deliver your order to the correct address</li>
              <li>Contact you about your order</li>
              <li>Respond to your questions or requests</li>
              <li>Improve our products and customer service</li>
              <li>Maintain records related to your orders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">3. We Do Not Sell Your Information</h2>
            <p className="text-xs text-foreground/75">
              We value your trust. We do not sell, rent, or trade your personal information to third parties for their own marketing purposes. We only share information when it is necessary to provide our services, such as sharing delivery details with a person responsible for delivering your order.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">4. Payment Information</h2>
            <p className="text-xs text-foreground/75">
              If online payment is available on our website, your payment may be processed through a third-party payment service provider. We do not intentionally store your complete card, UPI, or banking information on our website. Payment information is handled according to the payment provider's security and privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">5. WhatsApp and Phone Communication</h2>
            <p className="text-xs text-foreground/75">
              If you contact us through WhatsApp or phone, we may use the information you provide to respond to your questions, confirm orders, and provide delivery-related updates.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">6. Cookies and Website Information</h2>
            <p className="text-xs text-foreground/75">
              Our website may use basic cookies or similar technologies to make the website work properly, improve your experience, and understand how customers use our website. We do not use your information for unnecessary purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">7. Protecting Your Information</h2>
            <p className="text-xs text-foreground/75">
              We take reasonable steps to protect the information you provide to us from unauthorized access, misuse, or disclosure. However, no website or online service can guarantee complete security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">8. Children's Privacy</h2>
            <p className="text-xs text-foreground/75">
              Our website is not intended to knowingly collect personal information from children without appropriate parental or guardian involvement. If you believe that a child has provided us with personal information, please contact us so we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">9. Changes to This Privacy Policy</h2>
            <p className="text-xs text-foreground/75">
              We may update this Privacy Policy from time to time if our services or practices change. Any updated Privacy Policy will be posted on this page with a new effective date.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-foreground mb-2">10. Contact Us</h2>
            <p className="text-xs text-foreground/75">
              If you have any questions about this Privacy Policy or how we handle your information, please contact us through the contact details provided on our website.
            </p>
          </section>

          <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground">
            <h3 className="font-extrabold text-primary mb-1">Our Promise</h3>
            <p className="text-foreground/80 leading-relaxed">
              We care about our customers, and we believe trust is built through honesty and transparency. We will always try to handle your information responsibly and use it only for genuine business and customer-service purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
