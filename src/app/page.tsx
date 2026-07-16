import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import JobCardItem from '@/components/JobCardItem';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import Testimonials from '@/components/Testimonials';
import FaqAccordion from '@/components/FaqAccordion';
import StatsBand from '@/components/StatsBand';
import {
  getFeaturedJobs,
  getLatestJobs,
  getCategories,
  getJobCountsByPref,
  getTotalJobCount,
} from '@/lib/queries';
import { POPULAR_PREF_CODES, prefByCode, PREFECTURES } from '@/lib/areas';
import { JOURNEY, REASONS, FAQS, CATEGORY_INFO } from '@/lib/content';

export const revalidate = 120; // 2分キャッシュで軽さを維持

export default async function HomePage() {
  const [featured, latest, categories, prefCounts, total] = await Promise.all([
    getFeaturedJobs(6),
    getLatestJobs(8),
    getCategories(),
    getJobCountsByPref(),
    getTotalJobCount(),
  ]);

  const totalLabel = total.toLocaleString('ja-JP');
  const activePrefs = Object.keys(prefCounts).length || PREFECTURES.length;

  return (
    <>
      {/* ===================== ヒーロー ===================== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full bg-pop-lemon/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-pop-mint/30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-40 h-40 w-40 -translate-x-1/2 rounded-full bg-pop-grape/20 blur-3xl" />

        {/* 浮かぶPOPなアイコン（装飾） */}
        <span className="pointer-events-none absolute left-[8%] top-24 hidden text-4xl animate-float-slow sm:block">💪</span>
        <span className="pointer-events-none absolute right-[10%] top-16 hidden text-4xl animate-float sm:block">🌱</span>
        <span className="pointer-events-none absolute right-[16%] top-52 hidden text-3xl animate-bounce-slow lg:block">✨</span>

        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow animate-bounce-slow">🌱 未経験・フリーターさん、大かんげい！</span>
            <h1 className="mt-4 text-4xl font-black leading-[1.15] tracking-tight text-ink text-balance sm:text-6xl">
              「自分にもできるかも」
              <br className="hidden sm:block" />
              が見つかる、<span className="gradient-text">やさしい</span>お仕事さがし
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
              むずかしい経歴はいりません。バイトや派遣の経験しかなくても大丈夫。
              あなたのペースで、正社員デビューをいっしょに目指しましょう😊
            </p>
          </div>

          <div className="mt-8">
            <SearchBox variant="hero" />
          </div>

          {/* かんたん絞り込み導線 */}
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm">
            <span className="font-bold text-ink-soft">人気の条件：</span>
            <Link href="/jobs?inexperienced=1" className="btn-ghost">未経験歓迎</Link>
            <Link href="/jobs?weekendOff=1" className="btn-ghost">土日祝休み</Link>
            <Link href="/jobs?dormitory=1" className="btn-ghost">寮・社宅あり</Link>
            <Link href="/jobs?employment=正社員" className="btn-ghost">正社員デビュー</Link>
          </div>

          {/* 信頼バッジ */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="text-pop-mint">●</span> 登録・相談・応募すべて無料</span>
            <span className="flex items-center gap-1.5"><span className="text-pop-mint">●</span> しつこい連絡なし</span>
            <span className="flex items-center gap-1.5"><span className="text-pop-mint">●</span> スマホで60秒</span>
          </div>

          <p className="mt-6 text-center text-sm font-bold text-ink-soft">
            ただいま <span className="gradient-text text-lg font-black">{totalLabel}件</span> のお仕事を掲載中✨
          </p>
        </div>
      </section>

      {/* ===================== 数字で見る ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <StatsBand jobs={total} prefectures={activePrefs} categories={categories.length} members={45} />
      </section>

      {/* ===================== 選ばれる理由 ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading
          eyebrow="WHY シゴトナビ"
          title="はじめての一歩を、いちばん近くで応援。"
          desc="「未経験だから」を理由にあきらめてほしくない。だから、とことん寄り添います。"
          center
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <div className="card h-full p-6 transition hover:-translate-y-1 hover:shadow-float">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream text-3xl shadow-inner">
                  {r.emoji}
                </span>
                <h3 className="mt-4 text-lg font-black text-ink">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== 職種から ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading eyebrow="JOB CATEGORY" title="🧩 やりたいことからさがす" moreHref="/jobs" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const info = CATEGORY_INFO[c.slug];
            return (
              <Reveal key={c.id} delay={i * 40}>
                <Link
                  href={`/jobs?category=${c.id}`}
                  className="group flex h-full flex-col rounded-3xl bg-white p-5 shadow-card ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-float"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-3xl transition group-hover:scale-110">{c.emoji}</span>
                    <span className="font-black text-ink group-hover:text-brand-600">{c.name}</span>
                  </div>
                  {info && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{info.lead}</p>}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===================== 注目求人 ===================== */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionHeading eyebrow="PICK UP" title="⭐ 今おすすめのお仕事" moreHref="/jobs" moreLabel="もっと見る" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job, i) => (
              <Reveal key={job.id} delay={i * 50}>
                <JobCardItem job={job} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===================== 安心の流れ（カスタマージャーニー） ===================== */}
      <section className="relative overflow-hidden py-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-brand-50/60 to-white/0" />
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="EASY 4 STEPS"
            title="はじめてでも、迷わない4ステップ"
            desc="思っているより、ずっとシンプル。まずは見るだけ・話すだけでも大丈夫です。"
            center
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="relative h-full rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/[0.04]">
                  <span className="absolute right-4 top-3 text-4xl font-black text-brand-100">{s.n}</span>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-grad text-3xl shadow-soft">
                    {s.emoji}
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <h3 className="text-lg font-black text-ink">{s.title}</h3>
                    <span className="chip bg-pop-mint/20 text-teal-700">{s.tag}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/guide" className="btn-secondary !w-auto">はじめての転職ガイドを読む 📖</Link>
          </div>
        </div>
      </section>

      {/* ===================== エリアから ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading
          eyebrow="AREA"
          title="📍 お住まいのエリアからさがす"
          desc="都道府県 → 市区町村までしぼり込めるから、通いやすいお仕事がすぐ見つかる。"
          moreHref="/areas"
          moreLabel="全国から探す"
        />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {POPULAR_PREF_CODES.map((code, i) => {
            const pref = prefByCode(code)!;
            const count = prefCounts[code] ?? 0;
            return (
              <Reveal key={code} delay={i * 35}>
                <Link
                  href={`/areas/${code}`}
                  className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-float"
                >
                  <span className="font-black text-ink group-hover:text-brand-600">{pref.name}</span>
                  <span className="chip bg-brand-100 text-brand-700">{count}件</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===================== 新着求人 ===================== */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionHeading eyebrow="NEW" title="🆕 新着のお仕事" moreHref="/jobs?sort=new" moreLabel="もっと見る" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((job, i) => (
              <Reveal key={job.id} delay={i * 40}>
                <JobCardItem job={job} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===================== 先輩の声 ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading
          eyebrow="VOICE"
          title="未経験から始めた先輩の声"
          desc="あなたと同じ場所からスタートした先輩たちの、リアルな体験談。"
          moreHref="/voice"
          moreLabel="もっと読む"
        />
        <div className="mt-8">
          <Testimonials />
        </div>
      </section>

      {/* ===================== 応援メッセージ ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Reveal>
          <div className="grid items-center gap-6 rounded-[2.5rem] bg-white p-6 shadow-float ring-1 ring-black/[0.04] sm:grid-cols-2 sm:p-10">
            <div>
              <span className="chip bg-pop-mint/20 text-teal-700">安心してください🍀</span>
              <h2 className="mt-3 text-2xl font-black leading-snug text-ink text-balance sm:text-3xl">
                「正社員なんてムリかも」
                <br />
                そんなあなたにこそ、来てほしい。
              </h2>
              <p className="mt-3 text-ink-soft">
                私たちが紹介するのは、<b>未経験からスタートした先輩がたくさんいる</b>お仕事ばかり。
                学歴やブランクは気にしなくて大丈夫。まずは気になる求人を1つ、のぞいてみませんか？
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn-primary !w-auto">無料で相談してみる</Link>
                <Link href="/jobs" className="btn-secondary !w-auto">求人を見てみる</Link>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                ['🙆', '経歴に自信がなくてOK', 'バイト・派遣の経験だけでも応募できる求人が中心です。'],
                ['📱', 'スマホでサクサク', '通勤中でもスキマ時間でも、片手でお仕事さがし。'],
                ['🤝', 'しつこい連絡はナシ', 'あなたのペースを大切にします。気軽に登録してね。'],
              ].map(([e, t, d]) => (
                <li key={t} className="flex items-start gap-3 rounded-2xl bg-cream p-4 ring-1 ring-line">
                  <span className="text-2xl">{e}</span>
                  <div>
                    <p className="font-black text-ink">{t}</p>
                    <p className="text-sm text-ink-soft">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ===================== よくある質問 ===================== */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <SectionHeading eyebrow="FAQ" title="よくある質問" desc="不安なことは、先に解消しておきましょう。" center />
        <div className="mt-8">
          <FaqAccordion items={FAQS.slice(0, 5)} />
        </div>
        <div className="mt-6 text-center">
          <Link href="/faq" className="btn-ghost !w-auto">すべての質問を見る →</Link>
        </div>
      </section>
    </>
  );
}
