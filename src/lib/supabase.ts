import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * サーバー専用クライアント（service_role）。
 * RLS をバイパスして読み書きできます。クライアントには絶対に渡さないこと。
 */
let _admin: SupabaseClient | null = null;
export function supabaseAdmin(): SupabaseClient {
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  if (!_admin) {
    _admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

/**
 * 公開クライアント（publishable / anon）。クライアントコンポーネント用。
 */
export function supabasePublic(): SupabaseClient {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
