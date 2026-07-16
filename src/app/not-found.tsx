import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-4 py-20 text-center">
      <div className="text-7xl">🧭</div>
      <h1 className="mt-4 text-2xl font-black text-ink">ページが見つかりませんでした</h1>
      <p className="mt-2 text-ink-soft">
        お探しのページは、お引っ越ししたか、なくなってしまったようです。
        でも大丈夫、お仕事はたくさんあります！
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary !w-auto">ホームへ戻る</Link>
        <Link href="/jobs" className="btn-secondary !w-auto">お仕事をさがす</Link>
      </div>
    </div>
  );
}
