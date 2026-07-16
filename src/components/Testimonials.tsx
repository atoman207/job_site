import { TESTIMONIALS } from '@/lib/content';
import Reveal from './Reveal';

export default function Testimonials() {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {TESTIMONIALS.map((t, i) => (
        <Reveal
          key={t.name}
          delay={i * 80}
          className="w-[82%] shrink-0 snap-start sm:w-auto"
        >
          <figure className={`card flex h-full flex-col p-5 ring-2 ${t.accent}`}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-2xl shadow-inner">
                {t.emoji}
              </span>
              <div>
                <figcaption className="font-black text-ink">{t.name}</figcaption>
                <p className="text-xs text-ink-soft">{t.age}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className="chip bg-line text-ink-soft">{t.before}</span>
              <span className="text-brand-500">➜</span>
              <span className="chip bg-brand-100 text-brand-700">{t.after}</span>
            </div>

            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">
              「{t.quote}」
            </blockquote>

            <p className="mt-3 text-xs font-bold text-ink-faint">📍 {t.area}</p>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
