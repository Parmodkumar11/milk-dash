'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { Home, ShoppingCart, User } from 'lucide-react';
import { cartItemCount } from '@/lib/pricing';

export default function BottomTabBar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badge = mounted ? cartItemCount(items) : 0;

  const tabs = [
    { name: 'Home', path: '/', icon: Home, isCenter: true },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (!mounted) return null;

  return createPortal(
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[200] bg-card-bg border-t border-border-custom px-6 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active =
          tab.path === '/'
            ? pathname === '/'
            : pathname === tab.path || pathname.startsWith(`${tab.path}/`);

        if (tab.isCenter) {
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative -top-3 flex items-center justify-center w-12 h-12 rounded-full bg-brand-yellow text-ink shadow-md border-4 border-card-bg active:scale-95 transition-transform"
              aria-label="Home"
            >
              <Icon className="w-6 h-6" strokeWidth={2.25} />
            </Link>
          );
        }

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-0 flex-1 max-w-[4.5rem] ${
              active ? 'text-accent-green font-extrabold' : 'text-muted-fg'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" strokeWidth={active ? 2.5 : 2} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-accent-green text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] leading-none">{tab.name}</span>
          </Link>
        );
      })}
    </nav>,
    document.body
  );
}
