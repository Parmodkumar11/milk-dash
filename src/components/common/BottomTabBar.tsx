'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { Flame, ShoppingCart, Home, MapPin, CheckSquare } from 'lucide-react';

export default function BottomTabBar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((sum, item) => sum + 1, 0) : 0;

  const tabs = [
    { name: 'Order', path: '/order', icon: Flame },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: totalItems },
    { name: 'Home', path: '/', icon: Home, isCenter: true },
    { name: 'Delivery', path: '/delivery', icon: MapPin },
    { name: 'Checkout', path: '/checkout', icon: CheckSquare },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FCFAF6]/95 dark:bg-[#1A1A1F]/95 backdrop-blur-lg border-t border-border-custom z-50 px-2 py-1.5 shadow-2xl flex items-center justify-around pb-safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.path;

        if (tab.isCenter) {
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-background shadow-lg border-4 border-[#FCFAF6] dark:border-[#1A1A1F] hover:scale-105 active:scale-95 transition-transform"
            >
              <Icon className="w-6 h-6 fill-current" />
            </Link>
          );
        }

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              active ? 'text-primary font-extrabold' : 'text-foreground/60'
            }`}
          >
            <div className="relative">
              <Icon className="w-5.5 h-5.5 mb-0.5" />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] tracking-tight">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
