'use client';

import { useActionState } from 'react';
import { submitApplication, ApplyState } from '@/app/jobs/[id]/actions';

const initial: ApplyState = { ok: false };

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, action, pending] = useActionState(submitApplication, initial);

  if (state.ok) {
    return (
      <div className="card animate-pop-in p-6 text-center">
        <div className="text-5xl">🎉</div>
        <h3 className="mt-3 text-xl font-black text-ink">応募を受け付けました！</h3>
        <p className="mt-2 text-ink-soft">
          担当者よりご連絡いたします。緊張しなくて大丈夫、まずはお話ししましょう😊
          <br />
          あなたの一歩を応援しています！
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="card p-5">
      <input type="hidden" name="job_id" value={jobId} />
      <h3 className="text-lg font-black text-ink">このお仕事に応募する</h3>
      <p className="mt-1 text-sm text-ink-soft">「{jobTitle}」に応募します。むずかしい書類はいりません✍️</p>

      <div className="mt-4 space-y-3">
        <div>
          <label className="field-label" htmlFor="name">お名前 <span className="text-brand-500">*</span></label>
          <input id="name" name="name" required placeholder="例：山田 太郎" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="email">メールアドレス <span className="text-brand-500">*</span></label>
          <input id="email" name="email" type="email" required placeholder="例：you@example.com" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">電話番号（任意）</label>
          <input id="phone" name="phone" type="tel" placeholder="例：090-1234-5678" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="message">ひとこと（任意）</label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="気になっていること、聞いてみたいことがあれば気軽にどうぞ！"
            className="field resize-none"
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-3 rounded-2xl bg-pop-rose/15 px-4 py-2 text-sm font-bold text-rose-600">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-4 w-full disabled:opacity-60">
        {pending ? '送信中…' : 'この内容で応募する 🚀'}
      </button>
      <p className="mt-2 text-center text-xs text-ink-soft">
        送信することで、しつこい勧誘はいたしません。安心してご応募ください。
      </p>
    </form>
  );
}
