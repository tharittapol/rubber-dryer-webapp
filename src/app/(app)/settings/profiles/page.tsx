"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { TempProfile } from "@/types/profile";
import { deleteProfile, listProfiles } from "@/lib/profileStore";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function fmtThaiDate(dIso: string) {
  const d = new Date(dIso);
  return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function ProfileChartMini({ p }: { p: TempProfile }) {
  const points = React.useMemo(() => {
    // ทำให้เหมือนในดีไซน์: chart preview บนการ์ด
    const step = Math.max(1, Math.floor(p.hours / 12));
    const arr: { h: number; t: number }[] = [];
    for (let i = 0; i < p.hours; i += step) {
      arr.push({ h: i + 1, t: p.tempsC[i] ?? 0 });
      if (arr.length >= 12) break;
    }
    return arr;
  }, [p.hours, p.tempsC]);

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 10, right: 14, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="h" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="t" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<TempProfile[]>([]);

  const reload = React.useCallback(() => setItems(listProfiles()), []);
  React.useEffect(() => reload(), [reload]);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((p) => p.name.toLowerCase().includes(qq));
  }, [items, q]);

  return (
    <div className="space-y-5">
      {/* Header (match design) */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[32px] font-semibold leading-[120%]">โปรไฟล์อุณหภูมิ</div>
          <div className="text-muted mt-2">จัดการโปรไฟล์การอบ (Admin only)</div>
        </div>

        <Button
          onClick={() => router.push("/settings/profiles/new")}
          className="h-11 px-5 rounded-md bg-[color:#14AE5C] hover:bg-[color:#109A51] text-white"
        >
          + สร้างโปรไฟล์ใหม่
        </Button>
      </div>

      {/* Search (match design top-right feeling) */}
      <div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหา..."
          className="h-11 w-full rounded-full border border-border bg-bg px-5 text-[14px] outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
        />
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((p) => (
          <Card key={p.id} className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[20px] font-semibold truncate">{p.name}</div>

                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-muted">
                  <span className="inline-flex items-center gap-2">⏱ {p.hours} ชั่วโมง</span>
                  <span className="inline-flex items-center gap-2">
                    🌡 อุณหภูมิสูงสุด {Math.max(...p.tempsC)}°C
                  </span>
                </div>

                <div className="mt-3 text-[12px] text-muted">อัปเดตล่าสุด {fmtThaiDate(p.updatedAt)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/settings/profiles/${p.id}`)}
                  className="h-9 w-9 rounded-md border border-border bg-bg hover:bg-surface grid place-items-center"
                  aria-label="edit"
                >
                  <IconEdit />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("ลบโปรไฟล์นี้?")) return;
                    deleteProfile(p.id);
                    reload();
                  }}
                  className="h-9 w-9 rounded-md border border-border bg-bg hover:bg-surface grid place-items-center text-red"
                  aria-label="delete"
                >
                  <IconTrash />
                </button>
              </div>
            </div>

            <div className="mt-4 text-[12px] text-muted">อุณหภูมิต่อชั่วโมง</div>
            <div className="mt-2">
              <ProfileChartMini p={p} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}