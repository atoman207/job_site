'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { PREFECTURES, CITIES, REGIONS } from '@/lib/areas';
import { Category } from '@/lib/types';

const EMPLOYMENT = ['正社員', '契約社員', 'アルバイト・パート', '派遣社員'];

export default function JobFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const pref = sp.get('pref') ?? '';
  const cities = pref ? CITIES[pref] ?? [] : [];

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '') params.delete(k);
        else params.set(k, v);
      }
      params.delete('page'); // 条件変更で1ページ目へ
      router.push(`/jobs?${params.toString()}`);
    },
    [router, sp],
  );

  const toggle = (key: string) => update({ [key]: sp.get(key) ? null : '1' });

  const activeCount =
    ['q', 'pref', 'city', 'category', 'employment', 'inexperienced', 'weekendOff', 'dormitory'].filter(
      (k) => sp.get(k),
    ).length;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-ink">🔧 条件でしぼる</h2>
        {activeCount > 0 && (
          <button
            onClick={() => router.push('/jobs')}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            クリア（{activeCount}）
          </button>
        )}
      </div>

      {/* 都道府県 */}
      <div className="mt-4">
        <label className="field-label">📍 都道府県</label>
        <select
          value={pref}
          onChange={(e) => update({ pref: e.target.value || null, city: null })}
          className="field appearance-none"
        >
          <option value="">すべての地域</option>
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
      <div className="mt-3">
        <label className="field-label">🏙️ 市区町村</label>
        <select
          value={sp.get('city') ?? ''}
          onChange={(e) => update({ city: e.target.value || null })}
          disabled={!pref}
          className="field appearance-none disabled:bg-brand-50/50 disabled:text-ink-soft/50"
        >
          <option value="">{pref ? 'すべての市区町村' : '← まず都道府県を選択'}</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 職種 */}
      <div className="mt-3">
        <label className="field-label">🧩 職種</label>
        <select
          value={sp.get('category') ?? ''}
          onChange={(e) => update({ category: e.target.value || null })}
          className="field appearance-none"
        >
          <option value="">すべての職種</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
          ))}
        </select>
      </div>

      {/* 雇用形態 */}
      <div className="mt-3">
        <label className="field-label">📝 雇用形態</label>
        <select
          value={sp.get('employment') ?? ''}
          onChange={(e) => update({ employment: e.target.value || null })}
          className="field appearance-none"
        >
          <option value="">すべての雇用形態</option>
          {EMPLOYMENT.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* こだわり条件 */}
      <div className="mt-4">
        <p className="field-label">💛 こだわり条件</p>
        <div className="space-y-2">
          {[
            ['inexperienced', '未経験歓迎'],
            ['weekendOff', '土日祝休み'],
            ['dormitory', '寮・社宅あり'],
          ].map(([key, label]) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-3 py-2.5 transition ${
                sp.get(key)
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-brand-100 bg-white hover:bg-brand-50/40'
              }`}
            >
              <input
                type="checkbox"
                checked={!!sp.get(key)}
                onChange={() => toggle(key)}
                className="h-5 w-5 accent-brand-500"
              />
              <span className="text-sm font-bold text-ink">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
