'use client';

import { useActionState, useState } from 'react';
import { login, LoginState } from '@/app/admin/login/actions';

const initial: LoginState = {};

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="card p-6 sm:p-8">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-4">
        <div>
          <label className="field-label" htmlFor="username">ユーザーID</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            placeholder="admin"
            className="field"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">パスワード</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="field pr-16"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold text-ink-soft hover:bg-brand-50"
            >
              {show ? '隠す' : '表示'}
            </button>
          </div>
        </div>
      </div>

      {state.error && (
        <p className="mt-4 rounded-2xl bg-pop-rose/15 px-4 py-2.5 text-sm font-bold text-rose-600">
          ⚠️ {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full text-base disabled:opacity-60">
        {pending ? 'ログイン中…' : 'ログインする 🔑'}
      </button>
    </form>
  );
}
