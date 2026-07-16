'use server';

import { supabaseAdmin } from '@/lib/supabase';

export interface RegisterState {
  ok: boolean;
  error?: string;
}

export async function submitRegistration(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = String(formData.get('email') ?? '').trim();
  const nickname = String(formData.get('nickname') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const age_range = String(formData.get('age_range') ?? '').trim();
  const pref_code = String(formData.get('pref_code') ?? '').trim();
  const desired_city = String(formData.get('desired_city') ?? '').trim();
  const desired_category_id = String(formData.get('desired_category_id') ?? '').trim();
  const desired_employment = String(formData.get('desired_employment') ?? '').trim();
  const experience_note = String(formData.get('experience_note') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'メールアドレスの形式をご確認ください。' };
  }

  const sb = supabaseAdmin();
  const { error } = await sb.from('seekers').insert({
    email,
    nickname: nickname || null,
    phone: phone || null,
    age_range: age_range || null,
    pref_code: pref_code || null,
    desired_city: desired_city || null,
    desired_category_id: desired_category_id ? Number(desired_category_id) : null,
    desired_employment: desired_employment || null,
    experience_note: experience_note || null,
    message: message || null,
    source: 'web',
  });

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'このメールアドレスはすでに登録済みです。' };
    }
    return { ok: false, error: '登録に失敗しました。時間をおいて再度お試しください。' };
  }
  return { ok: true };
}
