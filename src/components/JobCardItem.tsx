import Link from 'next/link';
import { JobCard } from '@/lib/types';
import { formatSalary, formatLocation, jobBadges, relativeDate } from '@/lib/format';

const badgeColor: Record<string, string> = {
  未経験歓迎: 'bg-brand-100 text-brand-700',
  学歴不問: 'bg-pop-sky/15 text-sky-700',
  第二新卒OK: 'bg-pop-grape/20 text-purple-700',
  土日祝休み: 'bg-pop-mint/20 text-teal-700',
  '寮・社宅あり': 'bg-pop-lemon/25 text-yellow-800',
};

export default function JobCardItem({ job }: { job: JobCard }) {
  const badges = jobBadges(job);
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float"
    >
      {job.is_featured && (
        <span className="absolute left-3 top-3 z-10 chip bg-pop-lemon text-yellow-900 shadow">
          ⭐ 注目
        </span>
      )}

      {/* 画像（なければやさしいグラデーション） */}
      <div className="sheen relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-pop-mint/25">
        {job.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={job.image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="text-5xl drop-shadow-sm transition duration-500 group-hover:scale-110 group-hover:-rotate-6">
              {job.category_emoji ?? '💼'}
            </span>
          </div>
        )}
        <span className="absolute bottom-2 left-2 chip glass text-ink shadow-sm">
          {job.category_emoji} {job.category_name}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {badges.slice(0, 3).map((b) => (
            <span key={b} className={`chip ${badgeColor[b] ?? 'bg-brand-50 text-brand-600'}`}>
              {b}
            </span>
          ))}
        </div>

        <h3 className="mt-2 line-clamp-2 font-black leading-snug text-ink transition group-hover:text-brand-600">
          {job.title}
        </h3>

        {job.catch_copy && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{job.catch_copy}</p>
        )}

        <div className="mt-auto space-y-1.5 pt-3">
          <p className="rounded-xl bg-brand-50/70 px-2.5 py-1.5 text-sm font-black text-brand-600">
            💰 {formatSalary(job.salary_type, job.salary_min, job.salary_max)}
          </p>
          <p className="flex items-center gap-1 text-sm text-ink-soft">
            <span className="shrink-0">📍</span>
            <span className="truncate">
              {formatLocation(job.pref_code, job.city)}
              {job.station && <span className="text-xs text-ink-faint">／{job.station}</span>}
            </span>
          </p>
          <p className="flex items-center justify-between gap-2 text-xs text-ink-faint">
            <span className="truncate">🏢 {job.company_name}</span>
            <span className="shrink-0">{relativeDate(job.published_at)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
