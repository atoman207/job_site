'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PREFECTURES, CITIES, REGIONS } from '@/lib/areas';

interface Props {
  variant?: 'hero' | 'compact';
  defaultPref?: string;
  defaultCity?: string;
  defaultQ?: string;
}

export default function SearchBox({
  variant = 'hero',
  defaultPref = '',
  defaultCity = '',
  defaultQ = '',
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [pref, setPref] = useState(defaultPref);
  const [city, setCity] = useState(defaultCity);

  const cities = useMemo(() => (pref ? CITIES[pref] ?? [] : []), [pref]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (pref) params.set('pref', pref);
    if (city) params.set('city', city);
    router.push(`/jobs?${params.toString()}`);
  }

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={submit}
      className={
        isHero
          ? 'mx-auto w-full max-w-3xl rounded-[1.75rem] bg-white/80 p-3 shadow-float ring-1 ring-white/60 backdrop-blur-md sm:p-4'
          : 'card w-full p-3'
      }
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* キーワード */}
        <div className="lg:col-span-2">
          <label className="field-label sr-only" htmlFor="q">キーワード</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="職種・キーワード（例：販売、工場、ドライバー）"
              className="field pl-10"
            />
          </div>
        </div>

        {/* 都道府県 */}
        <div>
          <label className="field-label sr-only" htmlFor="pref">都道府県</label>
          <select
            id="pref"
            value={pref}
            onChange={(e) => {
              setPref(e.target.value);
              setCity('');
            }}
            className="field appearance-none"
          >
            <option value="">📍 都道府県</option>
            {REGIONS.map((r) => (
              <optgroup key={r.id} label={`${r.emoji} ${r.name}`}>
                {PREFECTURES.filter((p) => p.regionId === r.id).map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* 市区町村 */}
        <div>
          <label className="field-label sr-only" htmlFor="city">市区町村</label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!pref}
            className="field appearance-none disabled:cursor-not-allowed disabled:bg-brand-50/50 disabled:text-ink-soft/50"
          >
            <option value="">{pref ? '🏙️ 市区町村（すべて）' : '← まず都道府県'}</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary mt-3 w-full text-base">
        この条件でお仕事をさがす 🚀
      </button>
    </form>
  );
}
