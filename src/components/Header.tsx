'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { href: '/jobs', label: 'お仕事をさがす', emoji: '🔍' },
    { href: '/areas', label: 'エリアから', emoji: '📍' },
    { href: '/voice', label: '先輩の声', emoji: '💬' },
    { href: '/guide', label: 'はじめての方へ', emoji: '🧭' },
    { href: '/admin', label: '企業の方へ', emoji: '🏢' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-cream/85 shadow-[0_6px_20px_-16px_rgba(0,0,0,0.4)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-grad text-lg shadow-soft transition group-hover:rotate-6">
            🧭
          </span>
          <span className="text-lg font-black tracking-tight text-ink">
            シゴト<span className="gradient-text">ナビ</span>
          </span>
        </Link>

        {/* PC ナビ */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                isActive(n.href) ? 'bg-white text-brand-600 shadow-card' : 'text-ink-soft hover:bg-white/70 hover:text-brand-600'
              }`}
            >
              <span className="mr-1">{n.emoji}</span>
              {n.label}
            </Link>
          ))}
          <Link href="/register" className="btn-primary ml-2 !w-auto px-5 py-2.5 text-sm">
            無料登録
          </Link>
        </nav>

        {/* スマホ ハンバーガー */}
        <button
          aria-label="メニュー"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-ink shadow-card lg:hidden"
        >
          <span className="text-xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* スマホ メニュー */}
      {open && (
        <nav className="animate-pop-in border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-bold transition ${
                isActive(n.href) ? 'bg-brand-50 text-brand-600' : 'text-ink hover:bg-brand-50'
              }`}
            >
              <span className="text-xl">{n.emoji}</span>
              {n.label}
            </Link>
          ))}
          <Link href="/register" className="btn-primary mt-2">
            無料で会員登録する
          </Link>
        </nav>
      )}
    </header>
  );
}
