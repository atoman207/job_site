import Link from 'next/link';

export default function SectionHeading({
  eyebrow,
  title,
  desc,
  moreHref,
  moreLabel = 'すべて見る',
  center = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  moreHref?: string;
  moreLabel?: string;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-3 ${center ? 'flex-col text-center sm:items-center' : ''}`}>
      <div className={center ? 'mx-auto max-w-2xl' : ''}>
        {eyebrow && <span className="mb-2 inline-block text-sm font-black tracking-wide text-brand-500">{eyebrow}</span>}
        <h2 className="section-title text-balance">{title}</h2>
        {desc && <p className="mt-2 text-ink-soft">{desc}</p>}
      </div>
      {moreHref && (
        <Link href={moreHref} className="hidden shrink-0 text-sm font-black text-brand-600 hover:underline sm:inline-block">
          {moreLabel} →
        </Link>
      )}
    </div>
  );
}
