'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { setJobStatus, toggleFeatured } from '@/app/admin/actions';

export default function AdminJobActions({
  id,
  status,
  isFeatured,
}: {
  id: string;
  status: string;
  isFeatured: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link
        href={`/admin/${id}/edit`}
        className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-100"
      >
        ✏️ 編集
      </Link>

      <button
        disabled={pending}
        onClick={() => start(() => toggleFeatured(id, !isFeatured))}
        className={`rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
          isFeatured ? 'bg-pop-lemon text-yellow-900' : 'bg-gray-100 text-ink-soft hover:bg-pop-lemon/40'
        }`}
      >
        {isFeatured ? '⭐ 注目中' : '☆ 注目にする'}
      </button>

      {status === 'published' ? (
        <button
          disabled={pending}
          onClick={() => start(() => setJobStatus(id, 'closed'))}
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-gray-200 disabled:opacity-50"
        >
          募集終了にする
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() => start(() => setJobStatus(id, 'published'))}
          className="rounded-full bg-pop-mint/20 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-pop-mint/40 disabled:opacity-50"
        >
          公開する
        </button>
      )}

      <Link
        href={`/jobs/${id}`}
        target="_blank"
        className="rounded-full px-3 py-1.5 text-xs font-bold text-ink-soft hover:text-brand-600"
      >
        表示 ↗
      </Link>
    </div>
  );
}
