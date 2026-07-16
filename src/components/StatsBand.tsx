import Reveal from './Reveal';

export default function StatsBand({
  jobs,
  prefectures,
  categories,
  members,
}: {
  jobs: number;
  prefectures: number;
  categories: number;
  members: number;
}) {
  const stats = [
    { label: '掲載中のお仕事', value: jobs.toLocaleString('ja-JP'), suffix: '件', emoji: '💼' },
    { label: '対応エリア', value: String(prefectures), suffix: '都道府県', emoji: '🗾' },
    { label: '職種カテゴリ', value: String(categories), suffix: '種類', emoji: '🧩' },
    { label: '登録メンバー', value: members.toLocaleString('ja-JP'), suffix: '名', emoji: '🙌' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 70}>
          <div className="card relative overflow-hidden p-4 text-center sm:p-5">
            <div className="pointer-events-none absolute -right-3 -top-3 text-5xl opacity-10">{s.emoji}</div>
            <p className="text-3xl font-black tracking-tight sm:text-4xl">
              <span className="gradient-text">{s.value}</span>
              <span className="ml-0.5 text-sm font-black text-ink-soft">{s.suffix}</span>
            </p>
            <p className="mt-1 text-xs font-bold text-ink-soft sm:text-sm">{s.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
