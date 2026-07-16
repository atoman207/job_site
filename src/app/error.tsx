'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-4 py-20 text-center">
      <div className="text-6xl">🙏</div>
      <h1 className="mt-4 text-2xl font-black text-ink">ちょっとだけ、うまく表示できませんでした</h1>
      <p className="mt-2 text-ink-soft">
        一時的な混雑かもしれません。もう一度ためすと、うまくいくことが多いです。
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button onClick={reset} className="btn-primary !w-auto">もう一度ためす</button>
        <a href="/" className="btn-secondary !w-auto">ホームへ戻る</a>
      </div>
    </div>
  );
}
