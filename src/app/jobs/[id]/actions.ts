'use server';

import { supabaseAdmin } from '@/lib/supabase';

export interface ApplyState {
  ok: boolean;
  error?: string;
}

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const jobId = String(formData.get('job_id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!jobId) return { ok: false, error: '求人情報が見つかりませんでした。' };
  if (!name) return { ok: false, error: 'お名前を入力してください。' };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'メールアドレスの形式をご確認ください。' };
  }

  const sb = supabaseAdmin();
  const { error } = await sb.from('applications').insert({
    job_id: jobId,
    name,
    email,
    phone: phone || null,
    message: message || null,
    status: 'new',
  });

  if (error) {
    return { ok: false, error: '送信に失敗しました。時間をおいて再度お試しください。' };
  }
  return { ok: true };
}
