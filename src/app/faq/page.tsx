import Link from 'next/link';
import type { Metadata } from 'next';
import FaqAccordion from '@/components/FaqAccordion';
import { FAQS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'よくある質問',
  description: 'シゴトナビについてのよくあるご質問。未経験でも大丈夫？費用は？しつこい連絡は来ない？などにお答えします。',
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">よくある質問</span>
      </nav>

      <div className="text-center">
        <span className="eyebrow">❓ FAQ</span>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">よくある質問</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          小さな不安も、先に解消しておきましょう。ここにない質問は、登録後に気軽にご相談ください。
        </p>
      </div>

      <div className="mt-8">
        <FaqAccordion items={FAQS} />
      </div>

      <div className="mt-10 rounded-[2rem] bg-white p-8 text-center shadow-card ring-1 ring-black/[0.04]">
        <div className="text-4xl">💬</div>
        <h2 className="mt-3 text-xl font-black text-ink">解決しないことがあれば、遠慮なく。</h2>
        <p className="mt-2 text-ink-soft">「こんなこと聞いていいのかな」も大歓迎。やさしくお答えします。</p>
        <Link href="/register" className="btn-primary mt-5 !w-auto">無料で相談する</Link>
      </div>
    </div>
  );
}
