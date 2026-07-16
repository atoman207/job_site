import Link from 'next/link';
import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';
import { adminCredentials, showLoginHint } from '@/lib/auth';

export const metadata: Metadata = {
  title: '管理画面ログイン',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? '/admin';
  const hint = showLoginHint();
  const { username, password } = adminCredentials();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="text-center">
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-brand-grad text-2xl shadow-soft">
          🏢
        </span>
        <h1 className="mt-4 text-2xl font-black text-ink sm:text-3xl">企業さま用ログイン</h1>
        <p className="mt-2 text-sm text-ink-soft">
          求人の掲載・管理はこちらから。IDとパスワードを入力してください。
        </p>
      </div>

      {/* ログイン情報のヒント（社内スタッフ向け・SHOW_ADMIN_LOGIN_HINT=true のときのみ） */}
      {hint && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/60 p-4">
          <p className="flex items-center gap-1.5 text-sm font-black text-brand-700">
            🔑 ログイン情報（社内用）
          </p>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <dt className="w-24 shrink-0 font-bold text-ink-soft">ユーザーID</dt>
              <dd className="select-all rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-ink ring-1 ring-line">
                {username}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="w-24 shrink-0 font-bold text-ink-soft">パスワード</dt>
              <dd className="select-all rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-ink ring-1 ring-line">
                {password}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-ink-faint">
            ※ 未経験のスタッフでも迷わずログインできるよう表示しています（社内・デモ環境向け）。
          </p>
        </div>
      )}

      <div className="mt-4">
        <LoginForm next={next} />
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/" className="font-bold text-brand-600 hover:underline">← サイトのトップへ戻る</Link>
      </p>
    </div>
  );
}
