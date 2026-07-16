import Link from 'next/link';
import { REGIONS } from '@/lib/areas';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="mt-16 border-t border-brand-100 bg-white/70">
      {/* 求職者への最後のひと押し */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-blob bg-gradient-to-br from-brand-500 to-pop-rose px-6 py-10 text-center text-white shadow-soft sm:px-12">
          <p className="text-sm font-bold opacity-90">まだ迷っていてもOK！</p>
          <h2 className="mt-1 text-2xl font-black sm:text-3xl">
            まずは「話を聞いてみる」から始めよう🌱
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-95">
            登録は<b>60秒</b>、もちろん<b>無料</b>。むずかしい経歴はいりません。
            あなたのペースで、いっしょにお仕事さがしをお手伝いします。
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-primary bg-white !text-brand-600 hover:bg-brand-50">
              無料で会員登録する
            </Link>
            <Link href="/jobs" className="btn-ghost bg-white/15 text-white hover:bg-white/25 hover:text-white">
              求人を見てみる →
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-2xl bg-brand-500 text-base">🧭</span>
            <span className="font-black text-ink">シゴトナビ</span>
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            未経験から正社員デビューを応援する、やさしい求人サイト。
            関東甲信越・関西・東海エリアを中心にお仕事を掲載しています。
          </p>
        </div>

        <div>
          <h3 className="font-bold text-ink">お仕事をさがす</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/jobs" className="hover:text-brand-600">すべての求人</Link></li>
            <li><Link href="/jobs?inexperienced=1" className="hover:text-brand-600">未経験歓迎の求人</Link></li>
            <li><Link href="/jobs?weekendOff=1" className="hover:text-brand-600">土日祝休みの求人</Link></li>
            <li><Link href="/jobs?dormitory=1" className="hover:text-brand-600">寮・社宅ありの求人</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-ink">エリアからさがす</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {REGIONS.filter((r) => r.target).map((r) => (
              <li key={r.id}>
                <Link href={`/areas#${r.id}`} className="hover:text-brand-600">
                  {r.emoji} {r.name}のお仕事
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-ink">はじめての方へ</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/guide" className="hover:text-brand-600">はじめての転職ガイド</Link></li>
            <li><Link href="/voice" className="hover:text-brand-600">先輩の声・体験談</Link></li>
            <li><Link href="/faq" className="hover:text-brand-600">よくある質問</Link></li>
            <li><Link href="/register" className="hover:text-brand-600">無料会員登録・相談</Link></li>
          </ul>
          <h3 className="mt-5 font-bold text-ink">企業の方へ</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/admin" className="hover:text-brand-600">求人管理ダッシュボード</Link></li>
            <li><Link href="/admin/new" className="hover:text-brand-600">求人を掲載する</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-100 py-5 text-center text-xs text-ink-soft">
        © {year} シゴトナビ  ｜  未経験さん・フリーターさんを応援する求人サイト
      </div>
    </footer>
  );
}
