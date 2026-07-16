-- ============================================================================
--  シゴトナビ  求人ポータル  スキーマ定義
--  PostgreSQL / Supabase
-- ============================================================================

-- 拡張（UUID生成 / 全文検索用の日本語 trigram）
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------------
--  企業（求人掲載元）
-- ---------------------------------------------------------------------------
create table if not exists companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  catch_copy    text,                       -- 会社のひとことアピール
  description   text,
  logo_url      text,
  website_url   text,
  founded_year  int,
  employee_count text,                       -- 例: 50〜100名
  pref_code     text not null,               -- 本社所在地
  city          text not null,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
--  求人カテゴリ（職種）
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id       serial primary key,
  slug     text unique not null,
  name     text not null,                    -- 例: 販売・接客
  emoji    text,
  sort     int not null default 0
);

-- ---------------------------------------------------------------------------
--  求人
-- ---------------------------------------------------------------------------
create table if not exists jobs (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references companies(id) on delete cascade,
  category_id      int  not null references categories(id),
  title            text not null,
  catch_copy       text,                     -- 求職者の背中を押すキャッチ
  description      text not null,
  -- 勤務地
  pref_code        text not null,
  city             text not null,
  address_detail   text,
  station          text,                     -- 最寄駅
  -- 雇用条件
  employment_type  text not null default '正社員',  -- 正社員/契約社員/アルバイト/派遣
  salary_type      text not null default 'monthly', -- monthly/hourly/annual
  salary_min       int,
  salary_max       int,
  work_hours       text,
  holidays         text,
  -- 未経験ターゲット向けフラグ
  is_inexperienced_ok boolean not null default true,   -- 未経験歓迎
  is_no_academic_req  boolean not null default true,   -- 学歴不問
  is_first_job_ok     boolean not null default false,  -- 第二新卒歓迎
  has_dormitory       boolean not null default false,  -- 寮・社宅あり
  is_weekend_off      boolean not null default false,  -- 土日祝休み
  features         text[] not null default '{}',       -- タグ（自由入力の魅力ポイント）
  benefits         text,                     -- 福利厚生
  image_url        text,
  -- 掲載管理
  status           text not null default 'published',  -- published/draft/closed
  is_featured      boolean not null default false,     -- 注目求人
  view_count       int not null default 0,
  published_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_jobs_pref      on jobs(pref_code);
create index if not exists idx_jobs_city      on jobs(pref_code, city);
create index if not exists idx_jobs_category  on jobs(category_id);
create index if not exists idx_jobs_status    on jobs(status);
create index if not exists idx_jobs_featured  on jobs(is_featured) where is_featured;
create index if not exists idx_jobs_published on jobs(published_at desc);
create index if not exists idx_jobs_title_trgm on jobs using gin (title gin_trgm_ops);

-- ---------------------------------------------------------------------------
--  求職者（会員登録）
-- ---------------------------------------------------------------------------
create table if not exists seekers (
  id               uuid primary key default gen_random_uuid(),
  nickname         text,
  email            text unique not null,
  phone            text,
  age_range        text,                     -- 例: 20代前半
  gender           text,
  pref_code        text,                     -- 希望勤務地
  desired_city     text,
  desired_category_id int references categories(id),
  desired_employment  text,                  -- 希望雇用形態
  experience_note  text,                     -- ざっくり経歴（アルバイト等）
  message          text,                     -- 相談したいこと
  source           text default 'web',       -- 流入経路
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
--  応募
-- ---------------------------------------------------------------------------
create table if not exists applications (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs(id) on delete cascade,
  seeker_id   uuid references seekers(id) on delete set null,
  -- 会員登録なしでも応募できる導線のための任意項目
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  status      text not null default 'new',   -- new/reviewing/contacted/hired/declined
  created_at  timestamptz not null default now()
);

create index if not exists idx_applications_job on applications(job_id);

-- ---------------------------------------------------------------------------
--  updated_at 自動更新トリガ
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_jobs_updated on jobs;
create trigger trg_jobs_updated
  before update on jobs
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
--  一覧表示用ビュー（企業・カテゴリを結合）
-- ---------------------------------------------------------------------------
create or replace view job_cards as
select
  j.id, j.title, j.catch_copy, j.pref_code, j.city, j.station,
  j.employment_type, j.salary_type, j.salary_min, j.salary_max,
  j.is_inexperienced_ok, j.is_no_academic_req, j.is_first_job_ok,
  j.has_dormitory, j.is_weekend_off, j.features, j.image_url,
  j.is_featured, j.status, j.published_at, j.view_count,
  c.id   as company_id,
  c.name as company_name,
  c.logo_url as company_logo,
  cat.id   as category_id,
  cat.name as category_name,
  cat.slug as category_slug,
  cat.emoji as category_emoji
from jobs j
join companies c   on c.id = j.company_id
join categories cat on cat.id = j.category_id;

-- ---------------------------------------------------------------------------
--  RLS（Row Level Security）
--  公開データ（求人・企業・カテゴリ）は誰でも読み取り可。
--  書き込み（応募・会員登録）は anon でも INSERT のみ許可。
--  管理操作はサーバー側の service_role キーで行う（RLSをバイパス）。
-- ---------------------------------------------------------------------------
alter table companies    enable row level security;
alter table categories   enable row level security;
alter table jobs         enable row level security;
alter table seekers      enable row level security;
alter table applications enable row level security;

drop policy if exists "public read companies"  on companies;
drop policy if exists "public read categories" on categories;
drop policy if exists "public read jobs"       on jobs;
drop policy if exists "anon insert seekers"    on seekers;
drop policy if exists "anon insert applications" on applications;

create policy "public read companies"  on companies  for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read jobs"       on jobs       for select using (status = 'published');
create policy "anon insert seekers"    on seekers    for insert with check (true);
create policy "anon insert applications" on applications for insert with check (true);
