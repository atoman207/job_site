import 'server-only';
import { supabaseAdmin } from './supabase';
import { Job } from './types';

export interface AdminJobRow {
  id: string;
  title: string;
  status: string;
  pref_code: string;
  city: string;
  employment_type: string;
  is_featured: boolean;
  view_count: number;
  published_at: string;
  company_name: string;
  application_count: number;
}

export async function getAdminJobs(): Promise<AdminJobRow[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('jobs')
    .select('id, title, status, pref_code, city, employment_type, is_featured, view_count, published_at, companies(name), applications(count)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;

  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    title: r.title as string,
    status: r.status as string,
    pref_code: r.pref_code as string,
    city: r.city as string,
    employment_type: r.employment_type as string,
    is_featured: r.is_featured as boolean,
    view_count: r.view_count as number,
    published_at: r.published_at as string,
    company_name: ((r.companies as { name?: string } | null)?.name) ?? '—',
    application_count:
      Array.isArray(r.applications) && r.applications.length > 0
        ? ((r.applications[0] as { count?: number }).count ?? 0)
        : 0,
  }));
}

export async function getAdminStats() {
  const sb = supabaseAdmin();
  const [{ count: jobCount }, { count: appCount }, { count: seekerCount }] = await Promise.all([
    sb.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    sb.from('applications').select('*', { count: 'exact', head: true }),
    sb.from('seekers').select('*', { count: 'exact', head: true }),
  ]);
  return {
    jobs: jobCount ?? 0,
    applications: appCount ?? 0,
    seekers: seekerCount ?? 0,
  };
}

export async function getJobForEdit(id: string): Promise<Job | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('jobs').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as Job) ?? null;
}
