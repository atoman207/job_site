import Link from 'next/link';
import type { Metadata } from 'next';
import JobCardItem from '@/components/JobCardItem';
import JobFilters from '@/components/JobFilters';
import Pagination from '@/components/Pagination';
import SearchBox from '@/components/SearchBox';
import { searchJobs, getCategories } from '@/lib/queries';
import { prefByCode } from '@/lib/areas';
import { CATEGORY_INFO } from '@/lib/content';

export const revalidate = 60;

type SP = Record<string, string | string[] | undefined>;

function s(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const p = await searchParams;
  const pref = prefByCode(s(p.pref) ?? '');
  const city = s(p.city);
  const parts = [pref?.name, city].filter(Boolean).join(' ');
  const title = parts ? `${parts}の求人一覧` : 'お仕事をさがす';
  return { title };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const p = await searchParams;
  const page = parseInt(s(p.page) ?? '1', 10) || 1;
  const sort = (s(p.sort) as 'new' | 'salary') ?? 'new';

  const [result, categories] = await Promise.all([
    searchJobs({
      q: s(p.q),
      pref: s(p.pref),
      city: s(p.city),
      category: s(p.category) ? parseInt(s(p.category)!, 10) : undefined,
      employment: s(p.employment),
      inexperienced: !!s(p.inexperienced),
      weekendOff: !!s(p.weekendOff),
      dormitory: !!s(p.dormitory),
      sort,
      page,
    }),
    getCategories(),
  ]);

  const pref = prefByCode(s(p.pref) ?? '');
  const city = s(p.city);
  const heading = [pref?.name, city].filter(Boolean).join(' ') || 'すべてのお仕事';

  const selectedCategory = s(p.category)
    ? categories.find((c) => c.id === parseInt(s(p.category)!, 10))
    : undefined;
  const categoryInfo = selectedCategory ? CATEGORY_INFO[selectedCategory.slug] : undefined;

  const makeHref = (nextPage: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(p)) {
      const val = s(v);
      if (val && k !== 'page') params.set(k, val);
    }
    params.set('page', String(nextPage));
    return `/jobs?${params.toString()}`;
  };

  const sortHref = (nextSort: string) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(p)) {
      const val = s(v);
      if (val && k !== 'sort' && k !== 'page') params.set(k, val);
    }
    params.set('sort', nextSort);
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* パンくず */}
      <nav className="mb-3 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">求人検索</span>
      </nav>

      {/* エリア検索（スマホでも上部で切り替えやすく） */}
      <div className="mb-5 lg:hidden">
        <SearchBox variant="compact" defaultPref={s(p.pref) ?? ''} defaultCity={city ?? ''} defaultQ={s(p.q) ?? ''} />
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">
            {selectedCategory && <span className="mr-1">{selectedCategory.emoji}</span>}
            {selectedCategory ? selectedCategory.name : `${heading}`}の求人
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            全 <span className="font-black text-brand-500">{result.total.toLocaleString('ja-JP')}</span> 件が見つかりました
          </p>
        </div>
        {/* 並び替え */}
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-card">
          <Link
            href={sortHref('new')}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              sort !== 'salary' ? 'bg-brand-500 text-white' : 'text-ink-soft'
            }`}
          >
            新着順
          </Link>
          <Link
            href={sortHref('salary')}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              sort === 'salary' ? 'bg-brand-500 text-white' : 'text-ink-soft'
            }`}
          >
            給与が高い順
          </Link>
        </div>
      </div>

      {categoryInfo && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl bg-gradient-to-br from-brand-50 to-pop-mint/10 p-4 ring-1 ring-brand-100">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-card">
            {selectedCategory?.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-black text-ink">{categoryInfo.lead}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {categoryInfo.points.map((pt) => (
                <span key={pt} className="chip bg-white text-brand-600 ring-1 ring-brand-100">◎ {pt}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* フィルタ（PCは左サイド、スマホは上に折りたたみ的に表示） */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <JobFilters categories={categories} />
        </aside>

        {/* 結果 */}
        <section>
          {result.jobs.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-5xl">🔍</div>
              <h2 className="mt-3 text-xl font-black text-ink">条件に合う求人が見つかりませんでした</h2>
              <p className="mt-2 text-ink-soft">
                条件をすこしゆるめると、ピッタリのお仕事に出会えるかも。
              </p>
              <Link href="/jobs" className="btn-primary mt-5 !w-auto">条件をリセットする</Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.jobs.map((job) => (
                  <JobCardItem key={job.id} job={job} />
                ))}
              </div>
              <Pagination
                page={result.page}
                total={result.total}
                perPage={result.perPage}
                makeHref={makeHref}
              />
            </>
          )}

          {/* 会員登録のうながし */}
          <div className="mt-8 rounded-blob bg-gradient-to-br from-pop-mint/20 to-brand-100 p-6 text-center">
            <p className="font-black text-ink">気になる求人はありましたか？🌟</p>
            <p className="mt-1 text-sm text-ink-soft">
              会員登録すると、あなたに合ったお仕事のご提案や、応募がもっとカンタンに。
            </p>
            <Link href="/register" className="btn-primary mt-4 !w-auto">無料で会員登録する</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
