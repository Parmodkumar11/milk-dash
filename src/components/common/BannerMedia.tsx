import React from 'react';

interface BannerMediaProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BannerMedia({ src, alt, className = '' }: BannerMediaProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover object-center ${className}`}
    />
  );
}
