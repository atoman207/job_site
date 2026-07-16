import 'server-only';
import { supabaseAdmin } from './supabase';
import { Category, JobCard, JobDetail } from './types';

/**
 * Supabase 呼び出しの薄いリトライ。
 * まれに発生する時刻ズレ由来の一時エラー（PGRST303 "JWT issued at future" など）や
 * ネットワークの瞬断を吸収し、ユーザーに 500 を見せないようにします。
 */
async function withRetry<T extends { error: { code?: string } | null }>(
  thunk: () => PromiseLike<T>,
  tries = 3,
): Promise<T> {
  let last!: T;
  for (let i = 0; i < tries; i++) {
    last = await thunk();
    const code = last.error?.code;
    if (!last.error) return last;
    if (code !== 'PGRST303' && code !== '08006' && code !== '57014') return last; // 再試行対象外
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  return last;
}

export interface JobSearchParams {
  q?: string;
  pref?: string;
  city?: string;
  category?: number;
  employment?: string;
  inexperienced?: boolean;
  weekendOff?: boolean;
  dormitory?: boolean;
  sort?: 'new' | 'salary';
  page?: number;
  perPage?: number;
}

export interface JobSearchResult {
  jobs: JobCard[];
  total: number;
  page: number;
  perPage: number;
}

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
  const sb = supabaseAdmin();
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? 12;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const build = () => {
    let query = sb.from('job_cards').select('*', { count: 'exact' }).eq('status', 'published');
    if (params.pref) query = query.eq('pref_code', params.pref);
    if (params.city) query = query.eq('city', params.city);
    if (params.category) query = query.eq('category_id', params.category);
    if (params.employment) query = query.eq('employment_type', params.employment);
    if (params.inexperienced) query = query.eq('is_inexperienced_ok', true);
    if (params.weekendOff) query = query.eq('is_weekend_off', true);
    if (params.dormitory) query = query.eq('has_dormitory', true);
    if (params.q) query = query.ilike('title', `%${params.q}%`);
    if (params.sort === 'salary') {
      query = query.order('salary_max', { ascending: false, nullsFirst: false });
    } else {
      query = query.order('is_featured', { ascending: false }).order('published_at', { ascending: false });
    }
    return query.range(from, to);
  };

  const { data, count, error } = await withRetry(build);
  if (error) throw error;

  return { jobs: (data ?? []) as JobCard[], total: count ?? 0, page, perPage };
}

export async function getFeaturedJobs(limit = 6): Promise<JobCard[]> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb
      .from('job_cards')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit),
  );
  if (error) throw error;
  return (data ?? []) as JobCard[];
}

export async function getLatestJobs(limit = 8): Promise<JobCard[]> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb.from('job_cards').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(limit),
  );
  if (error) throw error;
  return (data ?? []) as JobCard[];
}

export async function getCompanies(): Promise<{ id: string; name: string; pref_code: string; city: string }[]> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb.from('companies').select('id, name, pref_code, city').order('name'),
  );
  if (error) throw error;
  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() => sb.from('categories').select('*').order('sort'));
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getJobDetail(id: string): Promise<JobDetail | null> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb
      .from('jobs')
      .select('*, company:companies(*), category:categories(*)')
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle(),
  );
  if (error) throw error;
  return (data as JobDetail) ?? null;
}

export async function getRelatedJobs(
  categoryId: number,
  prefCode: string,
  excludeId: string,
  limit = 4,
): Promise<JobCard[]> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb
      .from('job_cards')
      .select('*')
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .order('published_at', { ascending: false })
      .limit(limit),
  );
  if (error) throw error;
  return (data ?? []) as JobCard[];
}

/** 都道府県ごとの公開求人数（エリア導線の件数バッジ用） */
export async function getJobCountsByPref(): Promise<Record<string, number>> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb.from('jobs').select('pref_code').eq('status', 'published'),
  );
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const code = (row as { pref_code: string }).pref_code;
    counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}

/** 市区町村ごとの求人数（エリア詳細用） */
export async function getJobCountsByCity(prefCode: string): Promise<Record<string, number>> {
  const sb = supabaseAdmin();
  const { data, error } = await withRetry(() =>
    sb.from('jobs').select('city').eq('status', 'published').eq('pref_code', prefCode),
  );
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const city = (row as { city: string }).city;
    counts[city] = (counts[city] ?? 0) + 1;
  }
  return counts;
}

export async function getTotalJobCount(): Promise<number> {
  const sb = supabaseAdmin();
  const { count, error } = await withRetry(() =>
    sb.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  );
  if (error) throw error;
  return count ?? 0;
}

export async function incrementJobView(id: string): Promise<void> {
  const sb = supabaseAdmin();
  // ビューカウントは軽く（失敗しても致命的でないので握りつぶす）
  const { data } = await sb.from('jobs').select('view_count').eq('id', id).maybeSingle();
  const current = (data as { view_count: number } | null)?.view_count ?? 0;
  await sb.from('jobs').update({ view_count: current + 1 }).eq('id', id);
}
