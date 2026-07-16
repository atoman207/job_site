'use client';

import { useActionState, useMemo, useState } from 'react';
import { createJob, updateJob, JobFormState } from '@/app/admin/actions';
import { PREFECTURES, CITIES, REGIONS } from '@/lib/areas';
import { Category, Job } from '@/lib/types';

const initial: JobFormState = { ok: false };
const EMPLOYMENT = ['正社員', '契約社員', 'アルバイト・パート', '派遣社員', '業務委託'];

interface Company {
  id: string;
  name: string;
  pref_code: string;
  city: string;
}

interface Props {
  mode: 'create' | 'edit';
  companies: Company[];
  categories: Category[];
  job?: Job;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-ink-soft">💡 {children}</p>;
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-500 text-sm font-black text-white">
          {step}
        </span>
        <h2 className="text-lg font-black text-ink">{title}</h2>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function JobForm({ mode, companies, categories, job }: Props) {
  const [state, action, pending] = useActionState(
    mode === 'create' ? createJob : updateJob,
    initial,
  );

  const [companyId, setCompanyId] = useState(job?.company_id ?? (companies[0]?.id ?? '__new__'));
  const [pref, setPref] = useState(job?.pref_code ?? '13');
  const cities = useMemo(() => CITIES[pref] ?? [], [pref]);
  const [salaryType, setSalaryType] = useState(job?.salary_type ?? 'monthly');

  return (
    <form action={action} className="space-y-5">
      {mode === 'edit' && <input type="hidden" name="id" value={job!.id} />}

      <Section step={1} title="どの会社の求人ですか？">
        <div>
          <label className="field-label">会社を選ぶ</label>
          <select
            name="company_id"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="field appearance-none"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="__new__">＋ 新しい会社を登録する</option>
          </select>
          <Hint>いつもの会社ならリストから選ぶだけ。はじめての会社なら「新しい会社を登録する」を選んでください。</Hint>
        </div>

        {companyId === '__new__' && (
          <div className="grid gap-3 rounded-2xl bg-brand-50 p-4 sm:grid-cols-2">
            <div>
              <label className="field-label">会社名 <span className="text-brand-500">*</span></label>
              <input name="new_company_name" placeholder="例：株式会社サンプル" className="field" />
            </div>
            <div>
              <label className="field-label">会社のひとことPR</label>
              <input name="new_company_catch" placeholder="例：あたたかい職場です" className="field" />
            </div>
          </div>
        )}
      </Section>

      <Section step={2} title="お仕事のタイトルとPR">
        <div>
          <label className="field-label">求人タイトル <span className="text-brand-500">*</span></label>
          <input
            name="title"
            required
            defaultValue={job?.title}
            placeholder="例：未経験OK！かんたん軽作業スタッフ"
            className="field"
          />
          <Hint>「未経験OK」「土日休み」など、求職者がうれしい言葉を入れると読まれやすいです。</Hint>
        </div>
        <div>
          <label className="field-label">キャッチコピー</label>
          <input
            name="catch_copy"
            defaultValue={job?.catch_copy ?? ''}
            placeholder="例：先輩の8割が未経験スタート！やさしく教えます😊"
            className="field"
          />
        </div>
        <div>
          <label className="field-label">職種 <span className="text-brand-500">*</span></label>
          <select name="category_id" defaultValue={job?.category_id ?? categories[0]?.id} className="field appearance-none">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>
      </Section>

      <Section step={3} title="仕事内容をくわしく">
        <div>
          <label className="field-label">仕事内容 <span className="text-brand-500">*</span></label>
          <textarea
            name="description"
            required
            rows={6}
            defaultValue={job?.description}
            placeholder={'例：\n倉庫内での商品のピッキングや梱包のお仕事です。\n難しい作業はありません。まずは先輩と一緒に、ゆっくり覚えていきましょう！'}
            className="field resize-y"
          />
          <Hint>むずかしい言葉は避けて、話しかけるように書くと未経験の方に伝わりやすいです。</Hint>
        </div>
        <div>
          <label className="field-label">アピールポイント（改行で複数OK）</label>
          <textarea
            name="features"
            rows={3}
            defaultValue={job?.features?.join('\n') ?? ''}
            placeholder={'研修が充実\n20代の先輩が多数\n私服OK'}
            className="field resize-y"
          />
          <Hint>1行に1つずつ書いてください。タグとして表示されます。</Hint>
        </div>
      </Section>

      <Section step={4} title="勤務地">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">都道府県 <span className="text-brand-500">*</span></label>
            <select
              name="pref_code"
              value={pref}
              onChange={(e) => setPref(e.target.value)}
              className="field appearance-none"
            >
              {REGIONS.map((r) => (
                <optgroup key={r.id} label={`${r.emoji} ${r.name}`}>
                  {PREFECTURES.filter((p) => p.regionId === r.id).map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">市区町村 <span className="text-brand-500">*</span></label>
            <input
              name="city"
              required
              list="city-options"
              defaultValue={job?.city}
              placeholder="例：渋谷区"
              className="field"
            />
            <datalist id="city-options">
              {cities.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">住所（番地など）</label>
            <input name="address_detail" defaultValue={job?.address_detail ?? ''} placeholder="例：道玄坂1-2-3" className="field" />
          </div>
          <div>
            <label className="field-label">最寄駅</label>
            <input name="station" defaultValue={job?.station ?? ''} placeholder="例：渋谷駅 徒歩5分" className="field" />
          </div>
        </div>
      </Section>

      <Section step={5} title="給与・待遇">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="field-label">給与タイプ</label>
            <select
              name="salary_type"
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value as Job['salary_type'])}
              className="field appearance-none"
            >
              <option value="monthly">月給（万円）</option>
              <option value="hourly">時給（円）</option>
              <option value="annual">年収（万円）</option>
            </select>
          </div>
          <div>
            <label className="field-label">下限</label>
            <input name="salary_min" type="number" defaultValue={job?.salary_min ?? ''} placeholder={salaryType === 'hourly' ? '1100' : '22'} className="field" />
          </div>
          <div>
            <label className="field-label">上限</label>
            <input name="salary_max" type="number" defaultValue={job?.salary_max ?? ''} placeholder={salaryType === 'hourly' ? '1400' : '30'} className="field" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">雇用形態</label>
            <select name="employment_type" defaultValue={job?.employment_type ?? '正社員'} className="field appearance-none">
              {EMPLOYMENT.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">勤務時間</label>
            <input name="work_hours" defaultValue={job?.work_hours ?? ''} placeholder="例：9:00〜18:00（休憩60分）" className="field" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">休日・休暇</label>
            <input name="holidays" defaultValue={job?.holidays ?? ''} placeholder="例：土日祝休み・年間休日120日" className="field" />
          </div>
          <div>
            <label className="field-label">福利厚生</label>
            <input name="benefits" defaultValue={job?.benefits ?? ''} placeholder="例：社会保険完備・交通費支給・寮あり" className="field" />
          </div>
        </div>
      </Section>

      <Section step={6} title="こだわり条件（当てはまるものにチェック）">
        <div className="grid gap-2 sm:grid-cols-2">
          {([
            ['is_inexperienced_ok', '未経験歓迎', job?.is_inexperienced_ok ?? true],
            ['is_no_academic_req', '学歴不問', job?.is_no_academic_req ?? true],
            ['is_first_job_ok', '第二新卒歓迎', job?.is_first_job_ok ?? false],
            ['is_weekend_off', '土日祝休み', job?.is_weekend_off ?? false],
            ['has_dormitory', '寮・社宅あり', job?.has_dormitory ?? false],
          ] as [string, string, boolean][]).map(([name, label, def]) => (
            <label key={name} className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-brand-100 px-4 py-3 hover:bg-brand-50">
              <input type="checkbox" name={name} defaultChecked={def} className="h-5 w-5 accent-brand-500" />
              <span className="font-bold text-ink">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section step={7} title="画像・公開設定">
        <div>
          <label className="field-label">画像URL（任意）</label>
          <input name="image_url" defaultValue={job?.image_url ?? ''} placeholder="https://images.unsplash.com/..." className="field" />
          <Hint>お仕事の雰囲気が伝わる写真URL。空欄でもOK（自動でイラストを表示します）。</Hint>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-pop-lemon/60 bg-pop-lemon/10 px-4 py-3">
            <input type="checkbox" name="is_featured" defaultChecked={job?.is_featured ?? false} className="h-5 w-5 accent-brand-500" />
            <span className="font-bold text-ink">⭐ 注目求人にする（トップに載ります）</span>
          </label>
          <div>
            <label className="field-label">公開状態</label>
            <select name="status" defaultValue={job?.status ?? 'published'} className="field appearance-none">
              <option value="published">公開する</option>
              <option value="draft">下書き（非公開）</option>
              <option value="closed">募集終了</option>
            </select>
          </div>
        </div>
      </Section>

      {state.error && (
        <p className="rounded-2xl bg-pop-rose/15 px-4 py-3 font-bold text-rose-600">⚠️ {state.error}</p>
      )}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-brand-100 bg-cream/95 px-4 py-3 backdrop-blur">
        <button type="submit" disabled={pending} className="btn-primary text-base disabled:opacity-60">
          {pending ? '保存中…' : mode === 'create' ? 'この内容で求人を公開する 🚀' : '変更を保存する 💾'}
        </button>
      </div>
    </form>
  );
}
