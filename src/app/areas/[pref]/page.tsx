import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JobCardItem from '@/components/JobCardItem';
import SearchBox from '@/components/SearchBox';
import { prefByCode, citiesOf, regionById } from '@/lib/areas';
import { getJobCountsByCity, searchJobs } from '@/lib/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string }>;
}): Promise<Metadata> {
  const { pref } = await params;
  const p = prefByCode(pref);
  if (!p) return { title: 'エリアが見つかりません' };
  return {
    title: `${p.name}の求人一覧`,
    description: `${p.name}の未経験歓迎・正社員のお仕事を市区町村からさがせます。`,
  };
}

export const revalidate = 120;

export default async function PrefAreaPage({
  params,
}: {
  params: Promise<{ pref: string }>;
}) {
  const { pref } = await params;
  const prefecture = prefByCode(pref);
  if (!prefecture) notFound();

  const region = regionById(prefecture.regionId);
  const cities = citiesOf(pref);

  const [cityCounts, jobs] = await Promise.all([
    getJobCountsByCity(pref),
    searchJobs({ pref, perPage: 9, sort: 'new' }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span>›</span>
        <Link href="/areas" className="hover:text-brand-600">エリア</Link>
        <span>›</span>
        <span className="font-bold text-ink">{prefecture.name}</span>
      </nav>

      <div className="rounded-blob bg-gradient-to-br from-brand-100 to-pop-mint/20 p-6 sm:p-8">
        <p className="text-sm font-bold text-brand-600">{region?.emoji} {region?.name}</p>
        <h1 className="mt-1 text-3xl font-black text-ink sm:text-4xl">
          {prefecture.name}のお仕事
        </h1>
        <p className="mt-2 text-ink-soft">
          全 <span className="font-black text-brand-500">{jobs.total.toLocaleString('ja-JP')}</span> 件。
          市区町村をえらんで、通いやすいお仕事を見つけよう。
        </p>
        <div className="mt-4">
          <SearchBox variant="compact" defaultPref={pref} />
        </div>
      </div>

      {/* 市区町村 */}
      <section className="mt-8">
        <h2 className="section-title">🏙️ 市区町村からさがす</h2>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((c) => {
            const count = cityCounts[c] ?? 0;
            return (
              <Link
                key={c}
                href={`/jobs?pref=${pref}&city=${encodeURIComponent(c)}`}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="font-bold text-ink">{c}</span>
                <span className={`chip ${count > 0 ? 'bg-brand-50 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                  {count}件
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 新着求人 */}
      {jobs.jobs.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="section-title">🆕 {prefecture.name}の新着求人</h2>
            <Link href={`/jobs?pref=${pref}`} className="text-sm font-bold text-brand-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.jobs.map((job) => (
              <JobCardItem key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
