import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JobForm from '@/components/JobForm';
import { getCompanies, getCategories } from '@/lib/queries';
import { getJobForEdit } from '@/lib/admin';

export const metadata: Metadata = { title: '求人を編集する' };
export const dynamic = 'force-dynamic';

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job, companies, categories] = await Promise.all([
    getJobForEdit(id),
    getCompanies(),
    getCategories(),
  ]);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-3 text-sm text-ink-soft">
        <Link href="/admin" className="hover:text-brand-600">求人管理</Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">編集</span>
      </nav>

      <h1 className="text-2xl font-black text-ink sm:text-3xl">✏️ 求人を編集する</h1>
      <p className="mt-1 text-sm text-ink-soft">内容を変えたら、いちばん下の「変更を保存する」を押してください。</p>

      <div className="mt-6">
        <JobForm mode="edit" companies={companies} categories={categories} job={job} />
      </div>
    </div>
  );
}
