'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export interface JobFormState {
  ok: boolean;
  error?: string;
}

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s.replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function bool(v: FormDataEntryValue | null): boolean {
  return v === 'on' || v === 'true' || v === '1';
}

async function resolveCompanyId(sb: ReturnType<typeof supabaseAdmin>, formData: FormData): Promise<string> {
  const existing = String(formData.get('company_id') ?? '').trim();
  if (existing && existing !== '__new__') return existing;

  // 新しい会社をその場で登録
  const name = String(formData.get('new_company_name') ?? '').trim();
  if (!name) throw new Error('会社を選ぶか、新しい会社名を入力してください。');
  const { data, error } = await sb
    .from('companies')
    .insert({
      name,
      catch_copy: String(formData.get('new_company_catch') ?? '').trim() || null,
      pref_code: String(formData.get('pref_code') ?? '13'),
      city: String(formData.get('city') ?? '').trim() || '—',
    })
    .select('id')
    .single();
  if (error || !data) throw new Error('会社の登録に失敗しました。');
  return data.id;
}

function buildJobPayload(formData: FormData, companyId: string) {
  const featuresRaw = String(formData.get('features') ?? '');
  const features = featuresRaw
    .split(/[\n,、]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    company_id: companyId,
    category_id: Number(formData.get('category_id') ?? 1),
    title: String(formData.get('title') ?? '').trim(),
    catch_copy: String(formData.get('catch_copy') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim(),
    pref_code: String(formData.get('pref_code') ?? '13'),
    city: String(formData.get('city') ?? '').trim(),
    address_detail: String(formData.get('address_detail') ?? '').trim() || null,
    station: String(formData.get('station') ?? '').trim() || null,
    employment_type: String(formData.get('employment_type') ?? '正社員'),
    salary_type: String(formData.get('salary_type') ?? 'monthly'),
    salary_min: num(formData.get('salary_min')),
    salary_max: num(formData.get('salary_max')),
    work_hours: String(formData.get('work_hours') ?? '').trim() || null,
    holidays: String(formData.get('holidays') ?? '').trim() || null,
    is_inexperienced_ok: bool(formData.get('is_inexperienced_ok')),
    is_no_academic_req: bool(formData.get('is_no_academic_req')),
    is_first_job_ok: bool(formData.get('is_first_job_ok')),
    has_dormitory: bool(formData.get('has_dormitory')),
    is_weekend_off: bool(formData.get('is_weekend_off')),
    features,
    benefits: String(formData.get('benefits') ?? '').trim() || null,
    image_url: String(formData.get('image_url') ?? '').trim() || null,
    is_featured: bool(formData.get('is_featured')),
    status: String(formData.get('status') ?? 'published'),
  };
}

export async function createJob(_prev: JobFormState, formData: FormData): Promise<JobFormState> {
  const sb = supabaseAdmin();
  let companyId: string;
  try {
    companyId = await resolveCompanyId(sb, formData);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const payload = buildJobPayload(formData, companyId);
  if (!payload.title) return { ok: false, error: '求人タイトルを入力してください。' };
  if (!payload.description) return { ok: false, error: '仕事内容を入力してください。' };
  if (!payload.city) return { ok: false, error: '勤務地（市区町村）を入力してください。' };

  const { error } = await sb.from('jobs').insert(payload);
  if (error) return { ok: false, error: '保存に失敗しました：' + error.message };

  revalidatePath('/admin');
  revalidatePath('/jobs');
  redirect('/admin?created=1');
}

export async function updateJob(_prev: JobFormState, formData: FormData): Promise<JobFormState> {
  const sb = supabaseAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, error: '対象の求人が見つかりません。' };

  let companyId: string;
  try {
    companyId = await resolveCompanyId(sb, formData);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const payload = buildJobPayload(formData, companyId);
  const { error } = await sb.from('jobs').update(payload).eq('id', id);
  if (error) return { ok: false, error: '更新に失敗しました：' + error.message };

  revalidatePath('/admin');
  revalidatePath('/jobs');
  revalidatePath(`/jobs/${id}`);
  redirect('/admin?updated=1');
}

export async function setJobStatus(id: string, status: 'published' | 'closed' | 'draft') {
  const sb = supabaseAdmin();
  await sb.from('jobs').update({ status }).eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/jobs');
}

export async function toggleFeatured(id: string, next: boolean) {
  const sb = supabaseAdmin();
  await sb.from('jobs').update({ is_featured: next }).eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/');
}
