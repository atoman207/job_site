import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { PREFECTURES } from '@/lib/areas';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/jobs', '/areas', '/register', '/guide', '/faq', '/voice', '/admin'].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const areaRoutes = PREFECTURES.map((p) => ({
    url: `${BASE}/areas/${p.code}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from('jobs')
      .select('id, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(2000);
    jobRoutes = (data ?? []).map((j: { id: string; updated_at: string }) => ({
      url: `${BASE}/jobs/${j.id}`,
      lastModified: new Date(j.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB未接続時でも静的ルートは返す
  }

  return [...staticRoutes, ...areaRoutes, ...jobRoutes];
}
