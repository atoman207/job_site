import 'server-only';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'admin_session';

/** ログイン画面に表示するためのスタッフ用ログイン情報（.env.local 由来） */
export function adminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? 'admin',
    password: process.env.ADMIN_PASSWORD ?? 'shigoto2026',
  };
}

/**
 * ログイン画面に認証情報のヒントを表示するかどうか。
 * SHOW_ADMIN_LOGIN_HINT=true のときだけ表示します（既定は非表示＝安全側）。
 * ⚠️ 有効化すると未ログインの訪問者にもID/パスワードが見えます。
 *    社内限定・デモ環境でのみ true にしてください。本番公開時は false（未設定）に。
 */
export function showLoginHint(): boolean {
  return process.env.SHOW_ADMIN_LOGIN_HINT === 'true';
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? 'change-me-session-secret';
}

export function verifyCredentials(username: string, password: string): boolean {
  const c = adminCredentials();
  return username === c.username && password === c.password;
}

/** ログイン成功時に発行するセッション値 */
export function sessionToken(): string {
  return sessionSecret();
}

/** サーバーコンポーネントからログイン状態を確認 */
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === sessionSecret();
}
