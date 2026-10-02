'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { ShoppingCart, User, Sun, Moon, MapPin } from 'lucide-react';
import { useTheme } from '@/components/common/ThemeProvider';
import BrandLogo from '@/components/common/BrandLogo';
import { cartItemCount } from '@/lib/pricing';
import { SERVICE_AREA_LABEL } from '@/lib/delivery';
import { serviceHoursSummary } from '@/lib/sessions';
import { useLocale } from '@/components/common/LanguageProvider';

export default function Navbar() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const customer = useCartStore((s) => s.customer);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, ready: localeReady } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? cartItemCount(items) : 0;
  const isActive = (path: string) => pathname === path;
  const onHome = pathname === '/';

  return (
    <header className={`sticky top-0 z-[70] ${onHome ? 'dd-header-yellow' : 'bg-card-bg border-b border-border-custom'}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center h-14 gap-2">
          <Link href="/" className="min-w-0 shrink" aria-label="HopInMohali home">
            <BrandLogo size="md" onYellow={onHome} />
          </Link>

          <div
            className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-bold max-w-[11rem] sm:max-w-[14rem] truncate min-w-0 ${
              onHome ? 'text-ink' : 'text-muted-fg'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate leading-tight">
              {SERVICE_AREA_LABEL}
              <span className="hidden sm:inline"> · {serviceHoursSummary()}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {localeReady ? (
              <div className="flex rounded-lg border border-black/10 overflow-hidden text-[10px] font-extrabold">
                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  className={`px-2 py-1.5 ${locale === 'en' ? 'bg-brand-yellow text-ink' : 'bg-white/60 text-ink/70'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('hi')}
                  className={`px-2 py-1.5 ${locale === 'hi' ? 'bg-brand-yellow text-ink' : 'bg-white/60 text-ink/70'}`}
                >
                  हिं
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="rounded-lg border border-black/10 bg-white/50 hover:bg-white/80 transition-all flex items-center justify-center w-9 h-9"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-ink/70" />
              )}
            </button>

            <Link
              href="/cart"
              className={`relative rounded-lg border border-black/10 bg-white/60 hover:bg-white flex items-center justify-center gap-1.5 px-2.5 h-9 ${
                isActive('/cart') ? 'ring-2 ring-accent-green/40' : ''
              }`}
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && count > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              ) : null}
            </Link>

            <Link
              href="/profile"
              className={`rounded-lg border border-black/10 bg-white/60 hover:bg-white flex items-center justify-center w-9 h-9 ${
                isActive('/profile') ? 'ring-2 ring-accent-green/40' : ''
              }`}
              title="Profile"
            >
              <div className="w-7 h-7 rounded-full bg-accent-green text-white flex items-center justify-center text-xs font-black">
                {mounted && customer.name ? customer.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
