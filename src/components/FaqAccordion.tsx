import { Faq } from '@/lib/content';

/**
 * ネイティブ <details> を使った軽量アコーディオン（JS不要・アクセシブル）。
 */
export default function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details
          key={i}
          className="group card overflow-hidden p-0 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-black text-ink transition hover:bg-brand-50/40">
            <span className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm text-brand-600">
                Q
              </span>
              <span className="pt-0.5 text-balance">{f.q}</span>
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-brand-500 transition group-open:rotate-45">
              ＋
            </span>
          </summary>
          <div className="px-5 pb-5">
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pop-mint/20 text-sm font-black text-teal-700">
                A
              </span>
              <p className="pt-0.5 leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
