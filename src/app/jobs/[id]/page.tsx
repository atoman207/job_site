import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ApplyForm from '@/components/ApplyForm';
import JobCardItem from '@/components/JobCardItem';
import { getJobDetail, getRelatedJobs, incrementJobView } from '@/lib/queries';
import { formatSalary, formatLocation, relativeDate } from '@/lib/format';
import { prefByCode } from '@/lib/areas';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobDetail(id);
  if (!job) return { title: '求人が見つかりません' };
  return {
    title: `${job.title}｜${job.company.name}`,
    description: job.catch_copy ?? job.description.slice(0, 100),
  };
}

const employmentColor: Record<string, string> = {
  正社員: 'bg-brand-500 text-white',
  契約社員: 'bg-pop-sky text-white',
  'アルバイト・パート': 'bg-pop-mint text-white',
  派遣社員: 'bg-pop-grape text-white',
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobDetail(id);
  if (!job) notFound();

  // 閲覧数カウント（失敗しても致命的でない）
  incrementJobView(id).catch(() => {});

  const related = await getRelatedJobs(job.category_id, job.pref_code, job.id, 4);
  const pref = prefByCode(job.pref_code);

  const badges = [
    job.is_inexperienced_ok && '未経験歓迎',
    job.is_no_academic_req && '学歴不問',
    job.is_first_job_ok && '第二新卒歓迎',
    job.is_weekend_off && '土日祝休み',
    job.has_dormitory && '寮・社宅あり',
  ].filter(Boolean) as string[];

  const conditions: [string, string | null][] = [
    ['雇用形態', job.employment_type],
    ['給与', formatSalary(job.salary_type, job.salary_min, job.salary_max)],
    ['勤務地', `${formatLocation(job.pref_code, job.city)}${job.address_detail ? ' ' + job.address_detail : ''}`],
    ['最寄駅', job.station],
    ['勤務時間', job.work_hours],
    ['休日・休暇', job.holidays],
    ['福利厚生', job.benefits],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* パンくず */}
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">ホーム</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">求人検索</Link>
        {pref && (
          <>
            <span>›</span>
            <Link href={`/jobs?pref=${pref.code}`} className="hover:text-brand-600">{pref.name}</Link>
          </>
        )}
        <span>›</span>
        <span className="font-bold text-ink line-clamp-1">{job.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ===== メイン ===== */}
        <article>
          {/* ヘッダーカード */}
          <div className="card overflow-hidden">
            <div className="relative aspect-[21/9] w-full bg-gradient-to-br from-brand-200 to-pop-mint/40">
              {job.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-7xl opacity-70">
                  {job.category.emoji ?? '💼'}
                </div>
              )}
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`chip ${employmentColor[job.employment_type] ?? 'bg-ink text-white'}`}>
                  {job.employment_type}
                </span>
                <span className="chip bg-brand-50 text-brand-600">
                  {job.category.emoji} {job.category.name}
                </span>
                {job.is_featured && <span className="chip bg-pop-lemon text-yellow-900">⭐ 注目</span>}
                <span className="ml-auto text-xs text-ink-soft">{relativeDate(job.published_at)}</span>
              </div>

              <h1 className="mt-3 text-2xl font-black leading-snug text-ink sm:text-3xl">{job.title}</h1>
              {job.catch_copy && <p className="mt-2 text-lg font-bold text-brand-600">{job.catch_copy}</p>}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <span key={b} className="chip bg-brand-100 text-brand-700">{b}</span>
                ))}
              </div>

              <div className="mt-4 grid gap-2 rounded-2xl bg-cream p-4 sm:grid-cols-2">
                <p className="font-black text-brand-600">
                  💰 {formatSalary(job.salary_type, job.salary_min, job.salary_max)}
                </p>
                <p className="font-bold text-ink">📍 {formatLocation(job.pref_code, job.city)}</p>
              </div>
            </div>
          </div>

          {/* こんなお仕事です */}
          <section className="card mt-5 p-5 sm:p-6">
            <h2 className="section-title">💡 こんなお仕事です</h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">{job.description}</p>

            {job.features.length > 0 && (
              <div className="mt-5">
                <h3 className="font-black text-ink">✨ ここが魅力！</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {job.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 rounded-2xl bg-brand-50 p-3">
                      <span className="text-brand-500">◎</span>
                      <span className="text-sm font-bold text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* 募集要項 */}
          <section className="card mt-5 p-5 sm:p-6">
            <h2 className="section-title">📋 募集要項</h2>
            <dl className="mt-3 divide-y divide-brand-100">
              {conditions
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[140px_1fr]">
                    <dt className="text-sm font-black text-ink-soft">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>

          {/* 会社紹介 */}
          <section className="card mt-5 p-5 sm:p-6">
            <h2 className="section-title">🏢 会社について</h2>
            <div className="mt-3 flex items-center gap-3">
              {job.company.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.company.logo_url} alt="" className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-2xl">🏢</span>
              )}
              <div>
                <p className="font-black text-ink">{job.company.name}</p>
                {job.company.catch_copy && (
                  <p className="text-sm text-ink-soft">{job.company.catch_copy}</p>
                )}
              </div>
            </div>
            {job.company.description && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                {job.company.description}
              </p>
            )}
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {job.company.employee_count && (
                <div className="flex gap-2"><dt className="font-bold text-ink-soft">従業員数</dt><dd>{job.company.employee_count}</dd></div>
              )}
              {job.company.founded_year && (
                <div className="flex gap-2"><dt className="font-bold text-ink-soft">設立</dt><dd>{job.company.founded_year}年</dd></div>
              )}
              <div className="flex gap-2"><dt className="font-bold text-ink-soft">所在地</dt><dd>{formatLocation(job.company.pref_code, job.company.city)}</dd></div>
            </dl>
          </section>

          {/* 応募の流れ */}
          <section className="card mt-5 p-5 sm:p-6">
            <h2 className="section-title">🚶 応募のあとの流れ</h2>
            <p className="mt-2 text-sm text-ink-soft">むずかしいことはありません。あなたのペースで進められます。</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['①', '応募する', 'このページの応募フォームから、かんたんに送信。書類はいりません。'],
                ['②', '連絡がくる', '担当から日程のご連絡。気になることは何でも聞けます。'],
                ['③', '顔合わせ', '面接というより顔合わせ。緊張しなくて大丈夫です😊'],
              ].map(([n, t, d]) => (
                <li key={t} className="rounded-2xl bg-cream p-4 ring-1 ring-line">
                  <span className="text-2xl font-black text-brand-300">{n}</span>
                  <p className="mt-1 font-black text-ink">{t}</p>
                  <p className="mt-1 text-sm text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
          </section>
        </article>

        {/* ===== サイド（応募） ===== */}
        <aside id="apply" className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
          <ApplyForm jobId={job.id} jobTitle={job.title} />
          <div className="mt-4 rounded-3xl bg-pop-mint/15 p-4 text-center text-sm text-ink-soft">
            <p className="font-black text-ink">まだ応募か迷う…💭</p>
            <p className="mt-1">そんなときは、まず無料相談から。あなたに合うお仕事を一緒に考えます。</p>
            <Link href="/register" className="btn-secondary mt-3 !w-auto">無料で相談する</Link>
          </div>
        </aside>
      </div>

      {/* 関連求人 */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="section-title">🔎 似ているお仕事</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <JobCardItem key={r.id} job={r} />
            ))}
          </div>
        </section>
      )}

      {/* スマホ用 追従CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100 bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href="#apply" className="btn-primary">このお仕事に応募する 🚀</a>
      </div>
    </div>
  );
}
