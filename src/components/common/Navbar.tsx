'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { ShoppingCart, Flame, MapPin, CheckSquare, ChevronRight, User, Sun, Moon, Store, ClipboardList } from 'lucide-react';
import { useTheme } from '@/components/common/ThemeProvider';
import { MILK_ENABLED } from '@/lib/features';
import BrandLogo from '@/components/common/BrandLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { items, customer } = useCartStore();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItemsCount = mounted ? items.reduce((sum, item) => sum + 1, 0) : 0;
  const totalPrice = mounted ? items.reduce((sum, item) => sum + item.price, 0) : 0;

  const isActive = (path: string) => pathname === path;

  const milkSteps = [
    { name: 'Order', path: '/order', icon: Flame },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Delivery', path: '/delivery', icon: MapPin },
    { name: 'Checkout', path: '/checkout', icon: CheckSquare },
  ];

  const nearbySteps = [
    { name: 'Nearby', path: '/nearby', icon: Store },
    { name: 'Request', path: '/nearby/request', icon: ClipboardList },
    { name: 'Location', path: '/nearby/location', icon: MapPin },
    { name: 'Review', path: '/nearby/review', icon: CheckSquare },
  ];

  const nearbyFlow = pathname.startsWith('/nearby') || !MILK_ENABLED;
  const steps = nearbyFlow ? nearbySteps : milkSteps;

  return (
    <header className="sticky top-0 z-50 border-b border-border-custom bg-surface/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[4.25rem]">
          <Link href="/" className="shrink-0" aria-label="HopInMohali home">
            <BrandLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-sm font-medium min-w-0" aria-label="Order steps">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const active = isActive(step.path);
              return (
                <React.Fragment key={step.path}>
                  <Link
                    href={step.path}
                    className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-2 rounded-full transition-colors ${
                      nearbyFlow
                        ? pathname === step.path || (step.path !== '/nearby' && pathname.startsWith(step.path))
                          ? 'bg-foreground text-background font-semibold shadow-sm'
                          : 'text-muted-fg hover:text-foreground hover:bg-muted'
                        : active
                          ? 'bg-foreground text-background font-semibold shadow-sm'
                          : 'text-muted-fg hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{step.name}</span>
                  </Link>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-foreground/25 hidden lg:block" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/nearby"
              title="Get Anything Nearby"
              className={`rounded-full border flex items-center gap-1.5 px-2.5 sm:px-3 h-10 text-xs font-bold transition-all ${
                nearbyFlow
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-custom bg-card-bg text-foreground hover:border-primary/50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Nearby</span>
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="rounded-full border border-border-custom bg-card-bg hover:border-primary/50 transition-all shadow-xs flex items-center justify-center w-10 h-10"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-muted-fg" />
              )}
            </button>

            <Link
              href="/profile"
              className={`rounded-full border border-border-custom bg-card-bg hover:border-primary/50 transition-all shadow-xs flex items-center justify-center w-10 h-10 ${
                isActive('/profile') ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              title="My User Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-gold text-white flex items-center justify-center text-xs font-black">
                {mounted && customer.name ? customer.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
              </div>
            </Link>

            {MILK_ENABLED && (
            <Link
              href="/cart"
              className={`hidden md:flex relative items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 ${
                isActive('/cart')
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border-custom bg-card-bg hover:bg-foreground hover:text-background hover:border-foreground'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && totalItemsCount > 0 && (
                <>
                  <span className="hidden sm:inline text-xs font-semibold">
                    ₹{totalPrice}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                </>
              )}
            </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
