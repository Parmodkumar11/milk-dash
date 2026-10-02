'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { APP_NAME } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-ink text-white pt-10 pb-36 md:pb-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <BrandLogo size="md" inverted />
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              Quick evening delivery in Phase 7, Mohali. ₹10 per 2 items — browse picks or request anything.
            </p>
            <p className="text-xs text-white/40" suppressHydrationWarning>
              © {new Date().getFullYear()} {APP_NAME}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/45 mb-3">Links</h3>
            <div className="flex flex-col gap-2 text-sm font-semibold">
              <Link href="/" className="text-white/75 hover:text-brand-yellow transition-colors">Home</Link>
              <Link href="/cart" className="text-white/75 hover:text-brand-yellow transition-colors">Cart</Link>
              <Link href="/profile" className="text-white/75 hover:text-brand-yellow transition-colors">Profile</Link>
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-1.5 text-white/75 hover:text-brand-yellow transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
