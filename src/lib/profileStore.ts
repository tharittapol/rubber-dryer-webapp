import type { TempProfile } from "@/types/profile";

const LS_KEY = "rds.tempProfiles.v1";

function uid() {
  return `p_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function seed(): TempProfile[] {
  const now = new Date().toISOString();
  const hours = 48;
  const base12 = [55,60,70,80,90,100,105,105,95,85,75,65]; // ให้คล้ายกราฟตัวอย่าง
  const temps: number[] = Array.from({ length: hours }, (_, i) => base12[i % base12.length]);
  return [
    { id: uid(), name: "โปรไฟล์มาตรฐาน 48 ชม.", holdTempC: 60, hours, tempsC: temps, updatedAt: now },
    { id: uid(), name: "โปรไฟล์มาตรฐาน 48 ชม.", holdTempC: 60, hours, tempsC: temps, updatedAt: now },
  ];
}

export function listProfiles(): TempProfile[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LS_KEY);
  if (!raw) {
    const s = seed();
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
    return s;
  }
  try {
    const parsed = JSON.parse(raw) as TempProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getProfile(id: string): TempProfile | null {
  const all = listProfiles();
  return all.find((p) => p.id === id) ?? null;
}

export function upsertProfile(input: Omit<TempProfile, "updatedAt">): TempProfile {
  const all = listProfiles();
  const now = new Date().toISOString();
  const next: TempProfile = { ...input, updatedAt: now };

  const idx = all.findIndex((p) => p.id === input.id);
  if (idx >= 0) all[idx] = next;
  else all.unshift(next);

  window.localStorage.setItem(LS_KEY, JSON.stringify(all));
  return next;
}

export function deleteProfile(id: string) {
  const all = listProfiles().filter((p) => p.id !== id);
  window.localStorage.setItem(LS_KEY, JSON.stringify(all));
}