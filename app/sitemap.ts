// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 3600;

type Changefreq = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Xác định BASE tại runtime: ưu tiên env, sau đó lấy từ headers (dev/prod đều đúng)
function resolveBase(): string {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (host) return `${proto}://${host}`;
  return 'http://localhost:3000';
}

// Chỉ giữ các listing chính bạn yêu cầu
const LISTING_MAIN = [
  '/signals',
  '/altcoins',
  '/crypto-exchanges',
  '/best-crypto-apps',
  '/insurance',
  '/crypto-market',
  '/guides',
] as const;

// Seeds (không push trực tiếp – chỉ để loại khỏi index nếu cần)
const SEEDS = [
  '/',
  '/signals', '/altcoins', '/crypto-exchanges', '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
];

// Những path loại thẳng (dù bắt gặp)
const EXCLUDE_EXACT_BASE = [
  '/404', '/500',
  '/robots.txt', '/sitemap.xml',
  '/api', '/admin',
  '/market', '/crypto', // listing cũ cần loại khỏi sitemap
];

const EXCLUDE_PREFIX = ['/api/', '/admin/', '/_next/', '/static/', '/assets/'];
const EXCLUDE_SEGMENT = ['/page/']; // phân trang kiểu /.../page/2

// Nhận dạng bài viết theo tiền tố (chỉ 7 nhóm)
const ARTICLE_PREFIXES = [
  '/signals/',
  '/altcoins/',
  '/crypto-exchanges/',
  '/best-crypto-apps/',
  '/insurance/',
  '/crypto-market/',
  '/guides/',
] as const;

// Fallback: mọi link dạng 2 tầng /group/slug (tránh /about một tầng)
const FALLBACK_TWO_LEVEL = /^\/[a-z0-9-]+\/[a-z0-9-]+\/?$/i;

function makeExcludeExact(): Set<string> {
  // loại toàn bộ seed (trừ '/' và listing chính) để không đẩy seed vào sitemap
  const lm = LISTING_MAIN as readonly string[];
  const extra = SEEDS.filter((p) => p !== '/' && lm.indexOf(p) === -1);
  return new Set<string>([...EXCLUDE_EXACT_BASE, ...extra]);
}

function isInternal(u: URL, baseHost: string) {
  return u.host === baseHost;
}

function looksLikeArticlePath(pathname: string) {
  for (let i = 0; i < EXCLUDE_SEGMENT.length; i++) {
    if (pathname.indexOf(EXCLUDE_SEGMENT[i]) !== -1) return false;
  }
  for (let i = 0; i < EXCLUDE_PREFIX.length; i++) {
    if (pathname.startsWith(EXCLUDE_PREFIX[i])) return false;
  }
  // là bài theo prefix
  for (let i = 0; i < ARTICLE_PREFIXES.length; i++) {
    const p = ARTICLE_PREFIXES[i];
    if (pathname.startsWith(p)) {
      // loại listing root của chuyên mục (không có slug)
      for (let j = 0; j < ARTICLE_PREFIXES.length; j++) {
        const q = ARTICLE_PREFIXES[j];
        if (pathname === q.slice(0, -1)) return false;
      }
      return true;
    }
  }
  // nếu không match prefix, thử fallback 2-level
  return FALLBACK_TWO_LEVEL.test(pathname);
}

function toAbs(u: string, BASE: string) {
  if (/^https?:\/\//i.test(u)) return u;
  return `${BASE}${u.startsWith('/') ? '' : '/'}${u}`;
}

// Rút link từ HTML (giữ lại để dùng nếu cần crawl)
function extractLinks(html: string): string[] {
  const hrefs: string[] = [];
  const re = /href\s*=\s*"(.*?)"|href\s*=\s*'(.*?)'/gim;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = (m[1] ?? m[2] ?? '').trim();
    if (!raw) continue;
    if (raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    hrefs.push(raw);
  }
  return hrefs;
}

async function fetchText(path: string, BASE: string): Promise<string | null> {
  try {
    const res = await fetch(toAbs(path, BASE), { method: 'GET', cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = resolveBase();
  const baseHost = new URL(BASE).host;
  const EXCLUDE_EXACT = makeExcludeExact();

  const out: MetadataRoute.Sitemap = [];
  const nowISO = new Date().toISOString();

  const push = (
    url: string,
    lastModified?: string,
    changeFrequency: Changefreq = 'daily',
    priority = 0.7
  ) => {
    out.push({ url, lastModified, changeFrequency, priority });
  };

  // 1) Trang cố định + listing chính
  push(toAbs('/', BASE), nowISO, 'daily', 1);
  push(toAbs('/about',   BASE), undefined, 'weekly', 0.7);
  push(toAbs('/contact', BASE), undefined, 'weekly', 0.7);
  push(toAbs('/privacy', BASE), undefined, 'yearly', 0.7);
  push(toAbs('/terms',   BASE), undefined, 'yearly', 0.7);
  (LISTING_MAIN as readonly string[]).forEach((l) => push(toAbs(l, BASE), undefined, 'daily', 0.7));

  // 2) Gom bài viết trực tiếp từ data (ổn định hơn crawl HTML)
  try {
    const { readCat } = await import('../lib/serverCat');
    type Post = { slug?: string; id?: string; date?: string; updatedAt?: string };

    const CAT_KEYS = [
      'altcoins',
      'crypto-exchanges',
      'best-crypto-apps',
      'insurance',
      'crypto-market',
      'guides',
    ] as const;

    const buildHref = (cat: string, p: Post): string | null => {
      const s = String(p?.slug || '').replace(/^\//, '');
      if (!s) return null;
      if (cat === 'crypto-market')      return `/crypto-market/${s}`;
      if (cat === 'altcoins')           return `/altcoins/${s}`;
      if (cat === 'crypto-exchanges')   return `/crypto-exchanges/${s}`;
      if (cat === 'best-crypto-apps')   return `/best-crypto-apps/${s}`;
      if (cat === 'insurance')          return `/insurance/${s}`;
      if (cat === 'guides')             return `/guides/${s}`;
      return null;
    };

    (CAT_KEYS as readonly string[]).forEach((cat) => {
      const arr = (readCat(cat as any) || []) as Post[];
      for (let i = 0; i < arr.length; i++) {
        const href = buildHref(cat, arr[i]);
        if (href) push(toAbs(href, BASE), undefined, 'daily', 0.7);
      }
    });

    // Signals từ /data/signals.json (id là slug bài)
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const f = await fs.readFile(path.join(process.cwd(), 'data', 'signals.json'), 'utf-8');
      const signals = JSON.parse(f) as Post[];
      for (let i = 0; i < signals.length; i++) {
        const id = String(signals[i]?.id || '').replace(/^\//, '');
        if (id) push(toAbs(`/signals/${id}`, BASE), undefined, 'daily', 0.7);
      }
    } catch {}
  } catch {}

  // 4) Khử trùng lặp
  const seen = new Set<string>();
  return out.filter((it) => {
    if (!it.url || seen.has(it.url)) return false;
    seen.add(it.url);
    return true;
  });
}
