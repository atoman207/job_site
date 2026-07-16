import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { TESTIMONIALS } from '@/lib/content';

export const metadata: Metadata = {
  title: '先輩の声・体験談',
  description:
    'フリーター・派遣・未経験から正社員デビューした先輩たちのリアルな体験談。あなたと同じ場所からのスタートを応援します。',
};

export default function VoicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">先輩の声</span>
      </nav>

      <div className="text-center">
        <span className="eyebrow">💬 VOICE</span>
        <h1 className="mt-3 text-3xl font-black text-ink text-balance sm:text-4xl">
          未経験から始めた、<span className="gradient-text">先輩たちの声</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          「自分にできるかな」は、みんなが通った道。同じ場所からスタートした先輩たちのリアルをどうぞ。
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 60}>
            <figure className={`card grid gap-5 p-6 ring-2 sm:grid-cols-[auto_1fr] sm:p-8 ${t.accent}`}>
              <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-cream text-5xl shadow-inner">
                  {t.emoji}
                </span>
                <div>
                  <figcaption className="text-lg font-black text-ink">{t.name}</figcaption>
                  <p className="text-sm text-ink-soft">{t.age}</p>
                  <p className="mt-1 text-xs font-bold text-ink-faint">📍 {t.area}</p>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                  <span className="chip bg-line text-ink-soft">Before：{t.before}</span>
                  <span className="text-brand-500">➜</span>
                  <span className="chip bg-brand-100 text-brand-700">After：{t.after}</span>
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-ink">
                  <span className="text-3xl leading-none text-brand-200">“</span>
                  {t.quote}
                </blockquote>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-ink-faint">
        ※ 体験談はイメージ例です。実際のインタビュー内容に順次差し替えていきます。
      </p>

      <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-brand-500 to-pop-rose p-8 text-center text-white shadow-soft">
        <h2 className="text-2xl font-black">次は、あなたの番です。</h2>
        <p className="mt-2 text-white/90">先輩たちも、はじめは同じ気持ちでした。まずは小さな一歩から🌱</p>
        <Link href="/register" className="btn-primary mt-5 !w-auto bg-white !text-brand-600 hover:bg-brand-50">
          無料で会員登録する
        </Link>
      </div>
    </div>
  );
}
