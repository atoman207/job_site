# シゴトナビ 🧭 — 未経験さん応援の求人ポータル

20代・30代の未経験／フリーター／派遣経験者に向けた、やさしくPOPな求人転職サイトです。
**Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (PostgreSQL)** で構築しています。

## 主な特長

- 📱 **スマホファースト**：片手でサクサク操作。スマホをメインに設計。
- 📍 **都道府県 → 市区町村** まで絞り込める求人検索（実在の地名を収録）。
- 🌱 **未経験に寄り添う導線**：やさしい文言・POPなデザインで応募のハードルを下げる。
- 🎯 **求職登録への導線**：60秒の無料登録・応募フォーム。
- 🏢 **かんたん求人管理**：未経験の担当者でも迷わず求人を追加・編集できる管理画面。
- ⚡ **軽さ重視**：Server Components + ISRキャッシュでサクサク表示。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数（`.env.local`）

Supabase の URL / キーは設定済みです。**データベースのパスワード**だけ追記してください：

```
DATABASE_URL=postgresql://postgres.gclxshtnxanslibvyunk:【DBパスワード】@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

> DBパスワードは Supabase ダッシュボード → Project Settings → Database → Connection string で確認できます。

### 3. テーブル作成 & サンプルデータ投入

```bash
npm run db:setup      # = db:migrate（テーブル作成） + db:seed（サンプル投入）
```

- `npm run db:migrate` … `db/schema.sql` を適用（テーブル作成）。※DATABASE_URL が必要
- `npm run db:seed` … 会社85社・求人600件などの大量サンプルを投入。※service_role キーで動作（パスワード不要）

### 4. 開発サーバー起動

```bash
npm run dev
# http://localhost:3000
```

## ページ構成

| URL | 内容 |
| --- | --- |
| `/` | トップ（ヒーロー検索・注目/新着求人・エリア・職種） |
| `/jobs` | 求人検索（都道府県・市区町村・職種・こだわり条件で絞込） |
| `/jobs/[id]` | 求人詳細＋応募フォーム |
| `/areas` | エリア一覧（地方 → 都道府県） |
| `/areas/[pref]` | 都道府県ページ（市区町村へ） |
| `/register` | 無料会員登録・お仕事相談 |
| `/admin` | 求人管理ダッシュボード（企業・自社用） |
| `/admin/new` | 求人の新規作成（ステップ式・初心者向け） |
| `/admin/[id]/edit` | 求人の編集 |

## データベース

`db/schema.sql` 参照。主なテーブル：

- `companies` … 求人掲載企業
- `categories` … 職種カテゴリ
- `jobs` … 求人（勤務地は都道府県コード＋市区町村で保持）
- `seekers` … 求職者（会員登録）
- `applications` … 応募

RLS を有効化し、公開データは読み取り可、書き込み（応募・登録）は anon で INSERT 可。
管理系の操作はサーバー側の `service_role` キーで実行します。

## 技術メモ

- 画像は「空欄」を基本とし、カテゴリ絵文字＋グラデーションのPOPなプレースホルダーを自動表示します。
  管理画面から任意で画像URL（Unsplash 等の無料画像）を設定できます。
- 地名データは `src/lib/areas.ts`。関東甲信越・関西・東海（太平洋ベルト）を手厚く収録。
