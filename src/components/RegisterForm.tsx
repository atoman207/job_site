'use client';

import { useActionState, useMemo, useState } from 'react';
import { submitRegistration, RegisterState } from '@/app/register/actions';
import { PREFECTURES, CITIES, REGIONS } from '@/lib/areas';
import { Category } from '@/lib/types';

const initial: RegisterState = { ok: false };

const AGE_RANGES = ['10代', '20代前半', '20代後半', '30代前半', '30代後半', '40代以上'];
const EMPLOYMENT = ['正社員', '契約社員', 'アルバイト・パート', '派遣社員', 'まだ決めていない'];

export default function RegisterForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(submitRegistration, initial);
  const [pref, setPref] = useState('');
  const cities = useMemo(() => (pref ? CITIES[pref] ?? [] : []), [pref]);

  if (state.ok) {
    return (
      <div className="card animate-pop-in p-8 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 text-2xl font-black text-ink">登録ありがとうございます！</h2>
        <p className="mt-3 text-ink-soft">
          さっそくあなたにピッタリのお仕事をおさがしします。
          <br />
          担当者よりご連絡しますので、どうぞリラックスして待っていてくださいね😊
        </p>
        <a href="/jobs" className="btn-primary mt-6 !w-auto">求人を見てみる</a>
      </div>
    );
  }

  return (
    <form action={action} className="card p-5 sm:p-7">
      {/* STEP 1 これだけ必須 */}
      <div className="rounded-2xl bg-brand-50 p-4">
        <p className="chip bg-brand-500 text-white">STEP 1／かんたん</p>
        <p className="mt-2 text-sm font-bold text-ink">まずはこれだけ！30秒で完了します✨</p>
        <div className="mt-3">
          <label className="field-label" htmlFor="email">メールアドレス <span className="text-brand-500">*</span></label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" className="field" />
        </div>
      </div>

      {/* STEP 2 任意 */}
      <p className="mt-6 chip bg-pop-mint/20 text-teal-700">STEP 2／もっとピッタリに（任意）</p>
      <p className="mt-1 text-sm text-ink-soft">
        答えられるところだけでOK！わかる範囲で教えてくれると、ご提案の精度が上がります。
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="nickname">ニックネーム</label>
          <input id="nickname" name="nickname" placeholder="例：たろう" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">電話番号</label>
          <input id="phone" name="phone" type="tel" placeholder="090-1234-5678" className="field" />
        </div>

        <div>
          <label className="field-label" htmlFor="age_range">年代</label>
          <select id="age_range" name="age_range" className="field appearance-none">
            <option value="">選択してください</option>
            {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="desired_employment">希望の働き方</label>
          <select id="desired_employment" name="desired_employment" className="field appearance-none">
            <option value="">選択してください</option>
            {EMPLOYMENT.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="pref_code">希望エリア（都道府県）</label>
          <select
            id="pref_code"
            name="pref_code"
            value={pref}
            onChange={(e) => setPref(e.target.value)}
            className="field appearance-none"
          >
            <option value="">選択してください</option>
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
          <label className="field-label" htmlFor="desired_city">希望エリア（市区町村）</label>
          <select id="desired_city" name="desired_city" disabled={!pref} className="field appearance-none disabled:bg-brand-50/50">
            <option value="">{pref ? 'こだわらない' : '← まず都道府県'}</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="desired_category_id">興味のある職種</label>
          <select id="desired_category_id" name="desired_category_id" className="field appearance-none">
            <option value="">選択してください</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="experience_note">これまでの経験（ざっくりでOK）</label>
          <input
            id="experience_note"
            name="experience_note"
            placeholder="例：コンビニのバイトを2年、派遣で軽作業など"
            className="field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="message">相談したいこと・不安なこと</label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="「正社員になれるか不安」「土日休みがいい」など、なんでも気軽にどうぞ🍀"
            className="field resize-none"
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-4 rounded-2xl bg-pop-rose/15 px-4 py-2 text-sm font-bold text-rose-600">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full text-base disabled:opacity-60">
        {pending ? '送信中…' : '無料で登録して相談する 🌱'}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        登録は無料です。しつこい勧誘はいたしません。あなたのペースを大切にします。
      </p>
    </form>
  );
}
