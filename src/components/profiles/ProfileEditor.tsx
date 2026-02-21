"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TempProfile } from "@/types/profile";
import { getProfile, upsertProfile } from "@/lib/profileStore";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function uid() {
  return `p_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function buildChartData(hours: number, tempsC: number[]) {
  return Array.from({ length: hours }, (_, i) => ({ h: i + 1, t: tempsC[i] ?? 0 }));
}

export default function ProfileEditor({ mode, id }: { mode: "create" | "edit"; id?: string }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [loaded, setLoaded] = React.useState(false);

  const [profileId, setProfileId] = React.useState<string>(id ?? uid());
  const [name, setName] = React.useState("");
  const [holdTempC, setHoldTempC] = React.useState<number>(60);
  const [hours, setHours] = React.useState<number>(48);
  const [tempsC, setTempsC] = React.useState<number[]>(Array.from({ length: 48 }, () => 60));

  React.useEffect(() => {
    if (!isEdit) {
      setLoaded(true);
      return;
    }
    const p = id ? getProfile(id) : null;
    if (p) {
      setProfileId(p.id);
      setName(p.name);
      setHoldTempC(p.holdTempC);
      setHours(p.hours);
      setTempsC(p.tempsC.slice());
    }
    setLoaded(true);
  }, [isEdit, id]);

  // keep temps length = hours
  React.useEffect(() => {
    setTempsC((prev) => {
      const next = prev.slice(0, hours);
      while (next.length < hours) next.push(next[next.length - 1] ?? holdTempC ?? 60);
      return next;
    });
  }, [hours, holdTempC]);

  const chartData = React.useMemo(() => buildChartData(hours, tempsC), [hours, tempsC]);

  const resetDefault = () => {
    setName("");
    setHoldTempC(60);
    setHours(48);
    setTempsC(Array.from({ length: 48 }, () => 60));
  };

  const save = () => {
    if (!name.trim()) {
      alert("กรุณากรอกชื่อโปรไฟล์");
      return;
    }
    const payload: Omit<TempProfile, "updatedAt"> = {
      id: profileId,
      name: name.trim(),
      holdTempC: clamp(Number(holdTempC) || 0, 0, 200),
      hours: clamp(Number(hours) || 1, 1, 240),
      tempsC: tempsC.map((t) => clamp(Number(t) || 0, 0, 200)),
    };
    upsertProfile(payload);
    router.push("/profiles");
  };

  if (!loaded) {
    return (
      <div className="mx-auto w-full max-w-[1120px]">
        <Card>กำลังโหลด...</Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1120px]">
        <button type="button" onClick={() => router.back()} className="text-[14px] text-muted hover:underline">
          ← ย้อนกลับ
        </button>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <div className="text-[34px] font-semibold leading-[120%]">
              {isEdit ? "แก้ไขโปรไฟล์" : "สร้างโปรไฟล์ใหม่"}
            </div>
            <div className="mt-2 text-[16px] text-muted">กำหนดการตั้งค่าโปรไฟล์อุณหภูมิ</div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={resetDefault}
              className="h-11 px-5 rounded-md border border-[color:rgba(0,0,0,0.25)] bg-[color:rgba(0,0,0,0.06)] hover:bg-[color:rgba(0,0,0,0.10)]"
            >
              รีเซ็ตค่า
            </Button>
            <Button onClick={save} className="h-11 px-6 rounded-md bg-[color:#1F1F1F] hover:bg-[color:#111] text-white">
              บันทึก
            </Button>
          </div>
        </div>

        {/* Basic info */}
        <div className="mt-6 space-y-6">
          <Card className="rounded-2xl">
            <div className="text-[20px] font-semibold">ข้อมูลพื้นฐาน</div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <div className="text-[14px] font-semibold">ชื่อโปรไฟล์</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น โปรไฟล์มาตรฐาน 8 ชม."
                  className="mt-2 h-11 w-full rounded-md border border-border bg-bg px-4 text-[14px] outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
                />
              </div>

              <div>
                <div className="text-[14px] font-semibold">อุณหภูมิรักษา (°C)</div>
                <input
                  value={holdTempC}
                  onChange={(e) => setHoldTempC(Number(e.target.value))}
                  placeholder="กรอกอุณหภูมิรักษา"
                  className="mt-2 h-11 w-full rounded-md border border-border bg-bg px-4 text-[14px] outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
                />
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card className="rounded-2xl">
            <div className="text-[20px] font-semibold">กราฟอุณหภูมิ</div>

            <div className="mt-4 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="h" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="t" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Hourly temps */}
          <Card className="rounded-2xl">
            <div className="text-[20px] font-semibold">อุณหภูมิแต่ละชั่วโมง (°C)</div>

            <div className="mt-5">
              <div className="text-[14px] font-semibold">จำนวนชั่วโมง</div>
              <div className="mt-2 inline-flex items-center rounded-md border border-border overflow-hidden">
                <button
                  type="button"
                  className="h-10 w-10 grid place-items-center bg-surface hover:bg-surface/70"
                  onClick={() => setHours((h) => clamp(h - 1, 1, 240))}
                >
                  −
                </button>
                <div className="h-10 w-[120px] grid place-items-center bg-bg font-semibold">{hours}</div>
                <button
                  type="button"
                  className="h-10 w-10 grid place-items-center bg-surface hover:bg-surface/70"
                  onClick={() => setHours((h) => clamp(h + 1, 1, 240))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
              {Array.from({ length: hours }, (_, i) => (
                <input
                  key={i}
                  value={tempsC[i] ?? ""}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setTempsC((prev) => {
                      const next = prev.slice();
                      next[i] = Number.isFinite(v) ? v : 0;
                      return next;
                    });
                  }}
                  className={cn(
                    "h-10 rounded-md border border-border bg-[color:rgba(0,0,0,0.03)] px-3 text-center text-[14px] outline-none",
                    "focus:bg-bg focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
                  )}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}