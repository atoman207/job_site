import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'シゴトナビ｜未経験から正社員デビュー！やさしい求人サイト',
    template: '%s｜シゴトナビ',
  },
  description:
    '「自分にもできるかも」がきっと見つかる。20代・30代の未経験・フリーター・派遣経験者を応援する求人サイト。都道府県・市区町村から、あなたにピッタリの正社員のお仕事をサクッと検索。',
  keywords: ['求人', '転職', '正社員', '未経験', 'フリーター', '第二新卒', '関東', '関西'],
  openGraph: {
    title: 'シゴトナビ｜未経験から正社員デビュー！',
    description: '未経験・フリーターさん大歓迎。やさしく寄り添う求人サイト。',
    type: 'website',
    locale: 'ja_JP',
  },
};

export const viewport: Viewport = {
  themeColor: '#ff5a1f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
