import type { Metadata } from 'next';
import RegisterForm from '@/components/RegisterForm';
import { getCategories } from '@/lib/queries';

export const metadata: Metadata = {
  title: '無料会員登録・お仕事相談',
  description: '30秒でかんたん登録。未経験・フリーターさんも大歓迎。あなたに合ったお仕事を、やさしくご提案します。',
};

export const revalidate = 300;

export default async function RegisterPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="text-center">
        <span className="chip animate-bounce-slow bg-white text-brand-600 shadow-card">
          🌱 無料・60秒・経歴不問
        </span>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
          いっしょに、はじめの一歩を。
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          「正社員になれるかな…」そんな不安も、まずは話してみることから。
          むずかしいことは聞きません。あなたのことを、少しだけ教えてください😊
        </p>
      </div>

      {/* 安心ポイント */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {[
          ['💰', '登録は無料'],
          ['📝', '経歴に自信なくてOK'],
          ['🤝', 'しつこい連絡なし'],
        ].map(([e, t]) => (
          <div key={t} className="rounded-2xl bg-white p-3 shadow-card">
            <div className="text-2xl">{e}</div>
            <p className="mt-1 text-xs font-bold text-ink">{t}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <RegisterForm categories={categories} />
      </div>
    </div>
  );
}
