import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

/**
 * /admin 配下をログインで保護します（/admin/login は除く）。
 * 未ログインの場合はログイン画面へリダイレクトします。
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ログイン画面と、その関連は常に許可
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const session = req.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET ?? 'change-me-session-secret';

  if (session && session === secret) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
