'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { ShoppingCart, Flame, MapPin, CheckSquare, ChevronRight, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/common/ThemeProvider';


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

  const steps = [
    { name: 'Order', path: '/order', icon: Flame },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Delivery', path: '/delivery', icon: MapPin },
    { name: 'Checkout', path: '/checkout', icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFAF6]/90 backdrop-blur-md border-b border-border-custom transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
                🥛
              </span>
              <span className="font-extrabold bg-gradient-to-r from-[#2C1D11] to-[#F0A500] bg-clip-text text-transparent">
                DairyDash
              </span>
            </span>
          </Link>

          {/* Breadcrumb Steps - Visible on Tablet/Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const active = isActive(step.path);
              return (
                <React.Fragment key={step.path}>
                  <Link
                    href={step.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                      active
                        ? 'bg-foreground text-background font-semibold'
                        : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{step.name}</span>
                  </Link>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-foreground/30" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Section: Theme Toggle + Profile Avatar + Cart CTA */}
          <div className="flex items-center gap-2.5">
            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-full border border-border-custom bg-white dark:bg-card-bg hover:border-primary transition-all shadow-xs flex items-center justify-center w-9 h-9 group"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-foreground/60 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <Link
              href="/profile"
              className={`p-1.5 rounded-full border border-border-custom bg-white dark:bg-card-bg hover:border-primary transition-all shadow-xs flex items-center justify-center ${
                isActive('/profile') ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              title="My User Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-amber-400 text-white flex items-center justify-center text-xs font-black shadow-xs">
                {mounted && customer.name ? customer.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
              </div>
            </Link>

            <Link
              href="/cart"
              className={`hidden md:flex relative items-center gap-2 px-4 py-2 rounded-full border border-border-custom bg-white hover:bg-foreground hover:text-white hover:border-foreground transition-all duration-200 ${
                isActive('/cart') ? 'bg-foreground text-white border-foreground' : ''
              }`}
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {mounted && totalItemsCount > 0 && (
                <>
                  <span className="hidden sm:inline text-xs font-semibold">
                    ₹{totalPrice}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalItemsCount}
                  </span>
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
