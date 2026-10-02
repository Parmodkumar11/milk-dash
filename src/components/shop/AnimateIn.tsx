'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: 'div' | 'li';
};

export default function AnimateIn({ children, className = '', delayMs = 0, as = 'div' }: Props) {
  const Tag = as;
  return (
    <Tag
      className={`animate-in-up ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}
