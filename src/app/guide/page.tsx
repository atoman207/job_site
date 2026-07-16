import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { GUIDE_SECTIONS, JOURNEY } from '@/lib/content';

export const metadata: Metadata = {
  title: 'はじめての転職ガイド',
  description:
    '未経験・フリーター・派遣経験者のための、やさしい転職ガイド。正社員のメリットから応募の流れ、面接のコツまで、シンプルな言葉で解説します。',
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">はじめての転職ガイド</span>
      </nav>

      {/* ヒーロー */}
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-grad p-8 text-white shadow-soft sm:p-12">
        <span className="pointer-events-none absolute -right-6 -top-6 text-8xl opacity-20">🧭</span>
        <span className="eyebrow !bg-white/20 !text-white !ring-white/30">FIRST GUIDE</span>
        <h1 className="mt-4 text-3xl font-black leading-tight text-balance sm:text-4xl">
          はじめての転職、<br />いっしょに一歩ずつ。
        </h1>
        <p className="mt-3 max-w-xl text-white/90">
          「何から始めればいいの？」がぜんぶ分かる、やさしいガイドです。
          むずかしい言葉は使いません。あなたのペースで読んでみてください😊
        </p>
      </div>

      {/* 目次 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {GUIDE_SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="btn-ghost !w-auto text-sm">
            {s.emoji} {s.title}
          </a>
        ))}
      </div>

      {/* 本文 */}
      <div className="mt-8 space-y-6">
        {GUIDE_SECTIONS.map((s, i) => (
          <Reveal key={s.id}>
            <section id={s.id} className="card scroll-mt-24 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-3xl shadow-inner">{s.emoji}</span>
                <div>
                  <span className="text-xs font-black text-brand-500">STEP {i + 1}</span>
                  <h2 className="text-xl font-black text-ink sm:text-2xl">{s.title}</h2>
                </div>
              </div>
              <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 font-bold text-brand-700">{s.lead}</p>
              <div className="mt-4 space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="leading-relaxed text-ink">{p}</p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* ステップの再掲 */}
      <section className="mt-10">
        <h2 className="section-title text-center">応募から入社まで、たったの4ステップ</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {JOURNEY.map((s) => (
            <div key={s.n} className="rounded-3xl bg-white p-5 text-center shadow-card ring-1 ring-black/[0.04]">
              <div className="text-3xl">{s.emoji}</div>
              <p className="mt-2 font-black text-ink">{s.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-pop-mint/20 to-brand-100 p-8 text-center">
        <h2 className="text-2xl font-black text-ink">準備はいりません。まずは一歩。</h2>
        <p className="mt-2 text-ink-soft">読んで少しでも「やってみようかな」と思えたら、それが第一歩です🌱</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-primary !w-auto">無料で相談してみる</Link>
          <Link href="/jobs" className="btn-secondary !w-auto">求人を見てみる</Link>
        </div>
      </div>
    </div>
  );
}
