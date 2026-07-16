import Link from 'next/link';

interface Props {
  page: number;
  total: number;
  perPage: number;
  makeHref: (page: number) => string;
}

export default function Pagination({ page, total, perPage, makeHref }: Props) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  const window = 2;
  const nums: number[] = [];
  for (let i = Math.max(1, page - window); i <= Math.min(pages, page + window); i++) {
    nums.push(i);
  }

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="ページ送り">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className="btn-ghost !w-auto shadow-card">
          ← 前へ
        </Link>
      )}
      {nums[0] > 1 && <span className="px-1 text-ink-soft">…</span>}
      {nums.map((n) => (
        <Link
          key={n}
          href={makeHref(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`grid h-10 min-w-10 place-items-center rounded-full px-3 font-bold transition ${
            n === page
              ? 'bg-brand-500 text-white shadow-soft'
              : 'bg-white text-ink-soft shadow-card hover:text-brand-600'
          }`}
        >
          {n}
        </Link>
      ))}
      {nums[nums.length - 1] < pages && <span className="px-1 text-ink-soft">…</span>}
      {page < pages && (
        <Link href={makeHref(page + 1)} className="btn-ghost !w-auto shadow-card">
          次へ →
        </Link>
      )}
    </nav>
  );
}
