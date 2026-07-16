import Link from 'next/link';
import type { Metadata } from 'next';
import { REGIONS, PREFECTURES } from '@/lib/areas';
import { getJobCountsByPref } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'エリアからお仕事をさがす',
  description: '全国の都道府県・市区町村から、あなたの街のお仕事をさがせます。関東甲信越・関西・東海エリアを中心に多数掲載中。',
};

export const revalidate = 300;

export default async function AreasPage() {
  const counts = await getJobCountsByPref();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-3 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">エリアから探す</span>
      </nav>

      <h1 className="text-3xl font-black text-ink sm:text-4xl">📍 エリアからお仕事をさがす</h1>
      <p className="mt-2 text-ink-soft">
        住んでいる街、通いやすい場所から。都道府県を選ぶと、市区町村までしぼり込めます。
      </p>

      <div className="mt-8 space-y-8">
        {REGIONS.map((region) => {
          const prefs = PREFECTURES.filter((p) => p.regionId === region.id);
          const regionTotal = prefs.reduce((sum, p) => sum + (counts[p.code] ?? 0), 0);
          return (
            <section key={region.id} id={region.id} className="scroll-mt-20">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-ink">
                  {region.emoji} {region.name}
                </h2>
                {region.target && (
                  <span className="chip bg-brand-100 text-brand-700">おすすめ</span>
                )}
                <span className="ml-auto text-sm font-bold text-ink-soft">{regionTotal}件</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {prefs.map((p) => {
                  const c = counts[p.code] ?? 0;
                  return (
                    <Link
                      key={p.code}
                      href={`/areas/${p.code}`}
                      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <span className="font-bold text-ink">{p.name}</span>
                      <span className={`chip ${c > 0 ? 'bg-brand-50 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                        {c}件
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
