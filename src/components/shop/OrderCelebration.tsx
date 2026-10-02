'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  orderKey: string;
};

function burst() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:300';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => canvas.remove();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#F8CB46', '#0C831F', '#FF6B6B', '#4ECDC4', '#FFE66D'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: canvas.width / 2,
    y: canvas.height * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.2,
  }));

  let frame = 0;
  const maxFrames = 90;
  let raf = 0;

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    frame += 1;
    if (frame < maxFrames) raf = requestAnimationFrame(tick);
    else canvas.remove();
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  };
}

export default function OrderCelebration({ orderKey }: Props) {
  const [show, setShow] = useState(false);
  const storageKey = `hopin-celebrated-${orderKey}`;

  useEffect(() => {
    if (!orderKey) return;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
    setShow(true);
    const cleanup = burst();
    const t = setTimeout(() => setShow(false), 1600);
    return () => {
      clearTimeout(t);
      cleanup?.();
    };
  }, [orderKey, storageKey]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <div className="animate-pop rounded-2xl bg-brand-yellow text-ink px-6 py-4 font-extrabold text-lg shadow-xl">
        Order sent! 🎉
      </div>
    </div>
  );
}
