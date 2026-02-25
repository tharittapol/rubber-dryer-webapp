type Province = { id: number; name_th: string; name_en?: string };
type District = { id: number; province_id: number; name_th: string; name_en?: string };
type SubDistrict = { id: number; district_id: number; name_th: string; name_en?: string; zip_code: string };

const URL_PROVINCE =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json";
const URL_DISTRICT =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json";
const URL_SUBDISTRICT =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json";

type Cache = {
  ts: number;
  provinces: Province[];
  districts: District[];
  subdistricts: SubDistrict[];
};

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

function now() {
  return Date.now();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return (await res.json()) as T;
}

export async function getThaiAddressCache(): Promise<Cache> {
  const g = globalThis as any;
  const current: Cache | undefined = g.__TH_ADDR_CACHE__;

  if (current && now() - current.ts < CACHE_TTL_MS) return current;

  const [provinces, districts, subdistricts] = await Promise.all([
    fetchJson<Province[]>(URL_PROVINCE),
    fetchJson<District[]>(URL_DISTRICT),
    fetchJson<SubDistrict[]>(URL_SUBDISTRICT),
  ]);

  const next: Cache = { ts: now(), provinces, districts, subdistricts };
  g.__TH_ADDR_CACHE__ = next;
  return next;
}

export function uniqSortedTH(xs: string[]) {
  return Array.from(new Set(xs)).sort((a, b) => a.localeCompare(b, "th"));
}