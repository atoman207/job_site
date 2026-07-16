import Link from 'next/link';
import type { Metadata } from 'next';
import AdminJobActions from '@/components/AdminJobActions';
import { getAdminJobs, getAdminStats } from '@/lib/admin';
import { formatLocation } from '@/lib/format';
import { logout } from '@/app/admin/login/actions';

export const metadata: Metadata = { title: '求人管理｜企業さま用' };
export const dynamic = 'force-dynamic';

const statusLabel: Record<string, { t: string; c: string }> = {
  published: { t: '公開中', c: 'bg-pop-mint/20 text-teal-700' },
  draft: { t: '下書き', c: 'bg-gray-100 text-ink-soft' },
  closed: { t: '募集終了', c: 'bg-pop-rose/15 text-rose-600' },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const sp = await searchParams;
  const [jobs, stats] = await Promise.all([getAdminJobs(), getAdminStats()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">🏢 求人管理ダッシュボード</h1>
          <p className="mt-1 text-sm text-ink-soft">
            はじめての方でもかんたん。ボタンをおすだけで求人を追加・編集できます。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form action={logout}>
            <button type="submit" className="btn-ghost !w-auto text-sm">ログアウト</button>
          </form>
          <Link href="/admin/new" className="btn-primary !w-auto">＋ 新しい求人をつくる</Link>
        </div>
      </div>

      {(sp.created || sp.updated) && (
        <div className="mt-4 animate-pop-in rounded-2xl bg-pop-mint/20 px-4 py-3 font-bold text-teal-700">
          ✅ {sp.created ? '求人を公開しました！' : '変更を保存しました！'}お疲れさまでした😊
        </div>
      )}

      {/* サマリー */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ['📢', '公開中の求人', stats.jobs],
          ['📨', 'これまでの応募', stats.applications],
          ['🙋', '会員登録者', stats.seekers],
        ].map(([e, t, v]) => (
          <div key={t as string} className="card p-4 text-center sm:p-5">
            <div className="text-2xl">{e}</div>
            <p className="mt-1 text-xs font-bold text-ink-soft sm:text-sm">{t}</p>
            <p className="text-2xl font-black text-brand-500 sm:text-3xl">{(v as number).toLocaleString('ja-JP')}</p>
          </div>
        ))}
      </div>

      {/* かんたんガイド */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-200 bg-white/60 p-4 text-sm text-ink-soft">
        <p className="font-black text-ink">📖 はじめての方へ</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>右上の「＋ 新しい求人をつくる」を押します。</li>
          <li>上から順番に、わかるところを入力していきます（むずかしい項目は空欄でもOK）。</li>
          <li>いちばん下の「公開する」ボタンを押せば、すぐにサイトに載ります！</li>
        </ol>
      </div>

      {/* 求人一覧 */}
      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-brand-100 px-5 py-3">
          <h2 className="font-black text-ink">掲載中の求人（{jobs.length}件）</h2>
        </div>

        {jobs.length === 0 ? (
          <div className="p-10 text-center text-ink-soft">
            まだ求人がありません。「＋ 新しい求人をつくる」から始めましょう！
          </div>
        ) : (
          <ul className="divide-y divide-brand-50">
            {jobs.map((j) => {
              const st = statusLabel[j.status] ?? statusLabel.draft;
              return (
                <li key={j.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`chip ${st.c}`}>{st.t}</span>
                      {j.is_featured && <span className="chip bg-pop-lemon text-yellow-900">⭐ 注目</span>}
                      <span className="chip bg-brand-50 text-brand-600">{j.employment_type}</span>
                    </div>
                    <p className="mt-1 truncate font-black text-ink">{j.title}</p>
                    <p className="text-xs text-ink-soft">
                      {j.company_name}｜{formatLocation(j.pref_code, j.city)}｜
                      👀 {j.view_count}回閲覧・📨 応募 {j.application_count}件
                    </p>
                  </div>
                  <AdminJobActions id={j.id} status={j.status} isFeatured={j.is_featured} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
