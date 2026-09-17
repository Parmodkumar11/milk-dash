'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { Flame, ShoppingCart, Home, MapPin, CheckSquare, Store, ClipboardList } from 'lucide-react';
import { MILK_ENABLED } from '@/lib/features';
import { useI18n } from '@/components/common/LanguageProvider';

export default function BottomTabBar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((sum, item) => sum + 1, 0) : 0;

  const tabs = MILK_ENABLED
    ? [
        { name: t('nav.order'), path: '/order', icon: Flame },
        { name: t('nav.cart'), path: '/cart', icon: ShoppingCart, badge: totalItems },
        { name: t('nav.home'), path: '/', icon: Home, isCenter: true },
        { name: t('nav.delivery'), path: '/delivery', icon: MapPin },
        { name: t('nav.checkout'), path: '/checkout', icon: CheckSquare },
      ]
    : [
        { name: t('nav.nearby'), path: '/nearby', icon: Store },
        { name: t('nav.request'), path: '/nearby/request', icon: ClipboardList },
        { name: t('nav.home'), path: '/', icon: Home, isCenter: true },
        { name: t('nav.location'), path: '/nearby/location', icon: MapPin },
        { name: t('nav.review'), path: '/nearby/review', icon: CheckSquare },
      ];

  if (!mounted) return null;

  return createPortal(
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[200] bg-surface/95 backdrop-blur-xl border-t border-border-custom px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(28,25,23,0.12)] flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active =
          tab.path === '/'
            ? pathname === '/'
            : tab.path === '/nearby'
              ? pathname === '/nearby'
              : pathname === tab.path || pathname.startsWith(`${tab.path}/`);

        if (tab.isCenter) {
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative -top-3 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-ink shadow-lg border-4 border-surface active:scale-95"
              aria-label={t('nav.home')}
            >
              <Icon className="w-6 h-6 fill-current" />
            </Link>
          );
        }

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-0 flex-1 max-w-[4.5rem] ${
              active ? 'text-primary font-extrabold' : 'text-muted-fg'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
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
    </nav>,
    document.body
  );
}
