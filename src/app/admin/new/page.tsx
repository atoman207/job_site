import Link from 'next/link';
import type { Metadata } from 'next';
import JobForm from '@/components/JobForm';
import { getCompanies, getCategories } from '@/lib/queries';

export const metadata: Metadata = { title: '新しい求人をつくる' };
export const dynamic = 'force-dynamic';

export default async function NewJobPage() {
  const [companies, categories] = await Promise.all([getCompanies(), getCategories()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-3 text-sm text-ink-soft">
        <Link href="/admin" className="hover:text-brand-600">求人管理</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">新しい求人</span>
      </nav>

      <h1 className="text-2xl font-black text-ink sm:text-3xl">✍️ 新しい求人をつくる</h1>
      <p className="mt-1 text-sm text-ink-soft">
        上から順に入力するだけ。<b>*</b> の項目だけ必須です。あとは空欄でも大丈夫！
      </p>

      <div className="mt-6">
        <JobForm mode="create" companies={companies} categories={categories} />
      </div>
    </div>
  );
}
