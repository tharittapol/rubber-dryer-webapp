"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { RoomState } from "@/types/room";
import type { ControlActionId, ControlMockData, ControlProfile, ControlRoom } from "./types";

type StepId = 1 | 2 | 3;

function stateLabel(st: RoomState) {
  switch (st) {
    case "RUNNING":
      return "กำลังทำงาน";
    case "WARM_HOLD":
      return "รักษาอุณหภูมิ";
    case "READY":
      return "พร้อมทำงาน";
    case "WAITING":
      return "รอดำเนินการ";
    case "STOPPED":
      return "หยุดทำงาน";
    case "FAULT":
      return "ขัดข้อง";
    default:
      return "ไม่ทราบสถานะ";
  }
}

function canStart(st: RoomState) {
  return st === "READY" || st === "STOPPED" || st === "WAITING";
}
function canStop(st: RoomState) {
  return st === "RUNNING" || st === "WARM_HOLD" || st === "WAITING";
}
function canReset(st: RoomState) {
  return st === "FAULT";
}

function actionEnabled(action: ControlActionId, room: ControlRoom | null) {
  if (!room) return false;
  if (action === "START") return canStart(room.state);
  if (action === "STOP") return canStop(room.state);
  return canReset(room.state);
}

/** ====== Time helpers (no date UI; schedule uses HH:MM 24h) ====== */
function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function nowHHMM() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function hhmmToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map((x) => Number(x));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}
function minutesToHHMM(mins: number) {
  const m = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad2(h)}:${pad2(mm)}`;
}
function hhmmDot(hhmm: string) {
  return hhmm.replace(":", ".");
}
function diffTextFromNowToHHMM(targetHHMM: string) {
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  let tgtM = hhmmToMinutes(targetHHMM);
  let diff = tgtM - nowM;
  if (diff < 0) diff += 24 * 60; // if earlier -> tomorrow
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (diff === 0) return "จะเริ่มในตอนนี้";
  return `จะเริ่มในอีก ${h} ชั่วโมง ${m} นาที`;
}
function endsInText(totalHours: number, startMode: "NOW" | "SCHEDULE", scheduleHHMM: string) {
  const base =
    startMode === "NOW"
      ? 0
      : (() => {
          const now = new Date();
          const nowM = now.getHours() * 60 + now.getMinutes();
          let tgtM = hhmmToMinutes(scheduleHHMM);
          let diff = tgtM - nowM;
          if (diff < 0) diff += 24 * 60;
          return diff;
        })();

  const totalM = base + Math.max(0, Math.round(totalHours * 60));
  const h = Math.floor(totalM / 60);
  const m = totalM % 60;
  return `จะสิ้นสุดในอีก ${h} ชั่วโมง ${m} นาที`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function hhmmToParts(v: string) {
  const [hRaw, mRaw] = v.split(":");
  const h = clamp(Number(hRaw ?? 0) || 0, 0, 23);
  const m = clamp(Number(mRaw ?? 0) || 0, 0, 59);
  return { h, m };
}
function partsToHHMM(h: number, m: number) {
  return `${pad2(h)}:${pad2(m)}`;
}

/** =================== TimeWheelPicker =================== */
function TimeWheelPicker({
  open,
  value,
  minuteStep = 1,
  title = "เวลาเริ่ม",
  onClose,
  onConfirm,
}: {
  open: boolean;
  value: string; // "HH:MM"
  minuteStep?: 1 | 5 | 10 | 15;
  title?: string;
  onClose: () => void;
  onConfirm: (hhmm: string) => void;
}) {
  const minutes = React.useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) arr.push(i);
    return arr;
  }, [minuteStep]);

  const [h, setH] = React.useState(0);
  const [m, setM] = React.useState(0);

  // ✅ force remount Wheels every time open becomes true
  const [openKey, setOpenKey] = React.useState(0);
  React.useEffect(() => {
    if (open) setOpenKey((k) => k + 1);
  }, [open]);

  // ✅ sync state from value every time opening (and if value changes while open)
  React.useEffect(() => {
    if (!open) return;
    const p = hhmmToParts(value);
    setH(p.h);
    setM(p.m - (p.m % minuteStep));
  }, [open, value, minuteStep]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-end sm:place-items-center p-0 sm:p-4">
        <div className="w-full sm:max-w-[520px]">
          <div className="rounded-t-2xl sm:rounded-2xl border border-border bg-bg shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <button type="button" className="text-[14px] text-[color:#6B6B6B] hover:underline" onClick={onClose}>
                ยกเลิก
              </button>
              <div className="text-[14px] font-semibold">{title}</div>
              <button
                type="button"
                className="text-[14px] font-semibold text-[color:#14AE5C] hover:underline"
                onClick={() => onConfirm(partsToHHMM(h, m))}
              >
                ตกลง
              </button>
            </div>

            <div className="relative px-6 py-5">
              {/* highlight bar */}
              <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 border-y border-[color:rgba(0,0,0,0.10)] bg-[color:rgba(0,0,0,0.03)]" />

              <div className="grid grid-cols-2 gap-6">
                <WheelColumn
                  key={`h:${openKey}`}
                  ariaLabel="hour"
                  items={Array.from({ length: 24 }, (_, i) => i)}
                  value={h}
                  format={(x) => pad2(x)}
                  onChange={(x) => setH(x)}
                />
                <WheelColumn
                  key={`m:${openKey}:${minuteStep}`}
                  ariaLabel="minute"
                  items={minutes}
                  value={m}
                  format={(x) => pad2(x)}
                  onChange={(x) => setM(x)}
                />
              </div>

              {/* fade top/bottom */}
              <div className="pointer-events-none absolute left-0 right-0 top-0 h-10 bg-gradient-to-b from-bg to-transparent" />
              <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** =================== WheelColumn =================== */
function WheelColumn<T extends number>({
  items,
  value,
  format,
  onChange,
  ariaLabel,
}: {
  items: T[];
  value: T;
  format: (v: T) => string;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  const rowH = 48;
  const padRows = 3;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const programmaticScroll = React.useRef(false);

  const padded = React.useMemo(() => {
    const pad = Array.from({ length: padRows }, () => null as any);
    return [...pad, ...items, ...pad];
  }, [items]);

  const indexOfValue = React.useMemo(() => items.indexOf(value), [items, value]);

  const scrollToDataIndex = React.useCallback(
    (dataIdx: number, behavior: ScrollBehavior = "auto") => {
      const el = containerRef.current;
      if (!el) return;

      const centerOffset = el.clientHeight / 2 - rowH / 2;
      const paddedIdx = dataIdx + padRows;
      const top = paddedIdx * rowH - centerOffset;

      programmaticScroll.current = true;
      el.scrollTo({ top, behavior });
      window.setTimeout(() => {
        programmaticScroll.current = false;
      }, behavior === "smooth" ? 220 : 50);
    },
    [rowH, padRows]
  );

  React.useEffect(() => {
    if (indexOfValue < 0) return;
    scrollToDataIndex(indexOfValue, "auto");
  }, [indexOfValue, scrollToDataIndex]);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (programmaticScroll.current) return;

    const centerOffset = el.clientHeight / 2 - rowH / 2;
    const rawIndex = Math.round((el.scrollTop + centerOffset) / rowH);
    const dataIndex = rawIndex - padRows;
    const idx = clamp(dataIndex, 0, items.length - 1);
    const next = items[idx];
    if (next !== value) onChange(next);

    window.clearTimeout((onScroll as any)._t);
    (onScroll as any)._t = window.setTimeout(() => {
      scrollToDataIndex(idx, "smooth");
    }, 80);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className={cn("h-[240px] overflow-y-auto scroll-smooth overscroll-contain", "hide-scrollbar")}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        role="listbox"
        aria-label={ariaLabel}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; }
          .hide-scrollbar::-webkit-scrollbar-thumb { background: transparent; }
          .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        `}</style>

        {padded.map((it, i) => {
          const isPad = it === null;
          const realIndex = i - padRows;
          const isActive = !isPad && realIndex === indexOfValue;

          return (
            <div
              key={i}
              className={cn(
                "h-12 flex items-center justify-center text-[22px] font-semibold",
                isPad && "text-transparent",
                !isPad && (isActive ? "text-[color:#1F1F1F]" : "text-[color:#9A9A9A]")
              )}
              aria-selected={isActive}
            >
              {!isPad ? format(it as any) : "00"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** ====== Stepper ====== */
function Stepper({ step }: { step: StepId }) {
  const doneCls = "bg-[color:#14AE5C] text-white border-[color:#14AE5C]";
  const activeCls = "bg-[color:#14AE5C] text-white border-[color:#14AE5C]";
  const idleCls = "bg-[#E9E9E9] text-[color:#6B6B6B] border-[#E9E9E9]";
  const lineActive = "bg-[color:#14AE5C]";
  const lineIdle = "bg-[#D5D5D5]";

  const Node = ({ n }: { n: 1 | 2 | 3 }) => {
    const isDone = step > n;
    const isActive = step === n;
    const cls = isDone ? doneCls : isActive ? activeCls : idleCls;
    return (
      <div className={cn("h-11 w-11 rounded-full grid place-items-center border text-[16px] font-semibold", cls)}>
        {isDone ? "✓" : n}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Node n={1} />
      <div className={cn("h-[3px] w-24 rounded-full", step >= 2 ? lineActive : lineIdle)} />
      <Node n={2} />
      <div className={cn("h-[3px] w-24 rounded-full", step >= 3 ? lineActive : lineIdle)} />
      <Node n={3} />
    </div>
  );
}

/** ====== Step1 Room card ====== */
function RoomPickCard({
  room,
  selected,
  onClick,
}: {
  room: ControlRoom;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left w-full rounded-xl border bg-bg px-6 py-5 transition",
        selected
          ? "border-[color:#14AE5C] bg-[color:rgba(20,174,92,0.10)] ring-2 ring-[color:rgba(20,174,92,0.20)]"
          : "border-border hover:bg-surface"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[18px] font-semibold leading-[120%] truncate">{room.roomName}</div>
          <div className="mt-1 text-[14px] text-muted leading-[140%] truncate">
            ห้อง {room.roomNo} | โรงงาน {room.factoryName}
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 text-[13px] rounded-full border px-4 py-1.5 font-semibold",
            room.state === "READY" && "bg-[color:rgba(43,127,255,0.18)] text-[color:#2B7FFF] border-[color:#2B7FFF]",
            room.state === "RUNNING" && "bg-[color:rgba(20,174,92,0.18)] text-[color:#0F8A4A] border-[color:#14AE5C]",
            (room.state === "WAITING" || room.state === "WARM_HOLD") &&
              "bg-[color:rgba(255,105,0,0.14)] text-[color:#B14B00] border-[color:#FF6900]",
            room.state === "STOPPED" && "bg-[#F5F5F5] text-[color:#4B4B4B] border-[#CFCFCF]",
            room.state === "FAULT" && "bg-[color:rgba(224,80,80,0.16)] text-[color:#B22A2A] border-[color:#E05050]"
          )}
        >
          {stateLabel(room.state)}
        </div>
      </div>

      <div className="mt-4 text-[12px] text-muted">อัปเดตล่าสุด {room.lastUpdateText ?? "-"}</div>
    </button>
  );
}

/** ====== Step2 Action tiles (match screenshot) ====== */
function ActionTile({
  title,
  icon,
  selected,
  disabled,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-6 sm:p-7 transition grid place-items-center text-center",
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "hover:bg-surface",
        selected ? "border-[color:#14AE5C] bg-[color:rgba(20,174,92,0.12)]" : "border-border bg-bg"
      )}
    >
      <div className={cn("h-14 w-14 rounded-full grid place-items-center", selected ? "text-[color:#14AE5C]" : "text-[color:#A8A8A8]")} aria-hidden>
        {icon}
      </div>
      <div className={cn("mt-3 text-[16px] font-semibold", selected ? "text-[color:#14AE5C]" : "text-[color:#9A9A9A]")}>
        {title}
      </div>
    </button>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconStop() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconReset() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 15.5-6.5" />
      <path d="M18.5 5.5V3" />
      <path d="M18.5 5.5H16" />
      <path d="M21 12a9 9 0 0 1-15.5 6.5" />
    </svg>
  );
}

/** ====== Step3 Profile cards + time section (match screenshot) ====== */
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}
function IconThermo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 14.5a3 3 0 1 0 4 0V6a2 2 0 0 0-4 0v8.5z" />
      <path d="M12 6v8" />
    </svg>
  );
}

function ProfileCard({
  p,
  selected,
  onClick,
}: {
  p: ControlProfile;
  selected: boolean;
  onClick: () => void;
}) {
  const maxTempC = (p as any).maxTempC ?? 60;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-5 sm:p-6 text-left transition",
        selected ? "border-[color:#14AE5C] bg-[color:rgba(20,174,92,0.12)]" : "border-border bg-bg hover:bg-surface"
      )}
    >
      <div className="text-[18px] font-semibold leading-[120%] truncate">{p.profileName}</div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-[color:#6B6B6B]">
        <span className="inline-flex items-center gap-2">
          <IconClock />
          {p.totalHours} ชั่วโมง
        </span>
        <span className="inline-flex items-center gap-2">
          <IconThermo />
          อุณหภูมิสูงสุด {maxTempC}°C
        </span>
      </div>
    </button>
  );
}

function TimeField({
  label,
  valueHHMM,
  disabled,
  onChange,
}: {
  label: string;
  valueHHMM: string;
  disabled?: boolean;
  onChange?: (hhmm: string) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[14px] font-semibold text-[color:#3B3B3B]">{label}</div>

      {disabled ? (
        <input
          className="mt-2 h-11 w-full rounded-md border border-border bg-[#EFEFEF] px-4 text-[14px] text-[color:#7A7A7A]"
          value={hhmmDot(valueHHMM)}
          readOnly
        />
      ) : (
        <input
          className="mt-2 h-11 w-full rounded-md border border-border bg-bg px-4 text-[14px]"
          type="time"
          value={valueHHMM}
          onChange={(e) => onChange?.(e.target.value)}
          step={60}
        />
      )}
    </div>
  );
}

function ShiftHours({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="min-w-0">
      <div className="text-[14px] font-semibold text-[color:#3B3B3B]">เลื่อนชั่วโมงอุณหภูมิ</div>
      <div className="mt-2 flex items-center">
        <button
          type="button"
          className="h-11 w-11 rounded-l-md border border-border bg-bg hover:bg-surface grid place-items-center text-[18px]"
          onClick={() => onChange(Math.max(-24, value - 1))}
        >
          −
        </button>
        <div className="h-11 min-w-[84px] border-y border-border bg-bg grid place-items-center text-[16px] font-semibold">
          {value}
        </div>
        <button
          type="button"
          className="h-11 w-11 rounded-r-md border border-border bg-bg hover:bg-surface grid place-items-center text-[18px]"
          onClick={() => onChange(Math.min(24, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

/** ====== Modal (kept for STOP/RESET confirm + success) ====== */
function ModalShell({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[640px]">
          <Card className="shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[18px] font-semibold">{title}</div>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-sm border border-border bg-bg hover:bg-surface grid place-items-center"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** =================== ControlWizard =================== */
export function ControlWizard() {
  const [data, setData] = React.useState<ControlMockData | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<StepId>(1);

  const [factoryId, setFactoryId] = React.useState<string>("all");
  const [roomQuery, setRoomQuery] = React.useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(null);
  const selectedRoom = React.useMemo(() => data?.rooms.find((r) => r.roomId === selectedRoomId) ?? null, [data, selectedRoomId]);

  const [selectedAction, setSelectedAction] = React.useState<ControlActionId | null>(null);

  // ✅ picker state (single source for picker initial value)
  const [pickerValue, setPickerValue] = React.useState<string>(nowHHMM());
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);

  const openTimePickerNow = React.useCallback(() => {
    const now = nowHHMM();
    setPickerValue(now); // ✅ always start at now
    setTimePickerOpen(true);
  }, []);

  // Step3 form
  const [startForm, setStartForm] = React.useState<{
    profileId: string | null;
    startMode: "NOW" | "SCHEDULE";
    scheduleHHMM: string;
    shiftHours: number;
  }>({
    profileId: null,
    startMode: "NOW",
    scheduleHHMM: nowHHMM(),
    shiftHours: 0,
  });

  const selectedProfile = React.useMemo(() => {
    if (!data || !startForm.profileId) return null;
    return data.profiles.find((p) => p.profileId === startForm.profileId) ?? null;
  }, [data, startForm.profileId]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch("/mock/control.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        setData(json as ControlMockData);
      })
      .catch((e) => {
        if (!alive) return;
        setLoadError(String(e?.message ?? e));
      });
    return () => {
      alive = false;
    };
  }, []);

  // keep NOW time fresh
  React.useEffect(() => {
    if (step !== 3) return;
    if (startForm.startMode !== "NOW") return;
    const t = setInterval(() => {
      setStartForm((prev) => ({ ...prev, scheduleHHMM: nowHHMM() }));
    }, 20_000);
    return () => clearInterval(t);
  }, [step, startForm.startMode]);

  const rooms = React.useMemo(() => {
    if (!data) return [] as ControlRoom[];
    return data.rooms
      .filter((r) => (factoryId === "all" ? true : r.factoryId === factoryId))
      .filter((r) => {
        const q = roomQuery.trim().toLowerCase();
        if (!q) return true;
        const hay = `${r.roomName} ${r.roomNo} ${r.factoryName}`.toLowerCase();
        return hay.includes(q);
      });
  }, [data, factoryId, roomQuery]);

  const closeAll = () => {
    setModalOpen(false);
    setSuccessOpen(false);
    setSubmitting(false);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedAction(null);
    setSelectedRoomId(null);
    setFactoryId("all");
    setRoomQuery("");
    setStartForm({ profileId: null, startMode: "NOW", scheduleHHMM: nowHHMM(), shiftHours: 0 });
    setPickerValue(nowHHMM());
    setTimePickerOpen(false);
  };

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setModalOpen(false);
    setSuccessOpen(true);
  };

  const goNext = () => {
    if (step === 1) {
      if (!selectedRoomId) return;
      setStep(2);
      setSelectedAction(null);
      return;
    }

    if (step === 2) {
      if (!selectedRoom || !selectedAction) return;

      if (selectedAction === "START") {
        setStep(3);
        setStartForm((prev) => ({ ...prev, startMode: "NOW", scheduleHHMM: nowHHMM() }));
        setTimePickerOpen(false);
        return;
      }

      setModalOpen(true);
      return;
    }

    if (!selectedRoom || selectedAction !== "START") return;
    if (!startForm.profileId) return;
    if (startForm.startMode === "SCHEDULE" && !startForm.scheduleHHMM) return;
    submit();
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedAction(null);
      return;
    }
    if (step === 3) {
      setStep(2);
      setTimePickerOpen(false);
      return;
    }
  };

  const modalTitle =
    selectedAction === "STOP" ? "ยืนยันการหยุดทำงาน" : selectedAction === "RESET" ? "ยืนยันการรีเซ็ต" : "ยืนยัน";

  const modalPrimaryDisabled = submitting || !selectedRoom || !selectedAction;

  const step3StartHHMM = startForm.startMode === "NOW" ? nowHHMM() : startForm.scheduleHHMM;
  const step3StartM = hhmmToMinutes(step3StartHHMM);
  const totalHours = selectedProfile?.totalHours ?? 0;
  const endHHMM = minutesToHHMM(step3StartM + Math.round(totalHours * 60));

  const step3LeftInfo = startForm.startMode === "NOW" ? "จะเริ่มในตอนนี้" : diffTextFromNowToHHMM(startForm.scheduleHHMM);
  const step3RightInfo = endsInText(totalHours, startForm.startMode, startForm.scheduleHHMM);

  const step3NextDisabled =
    !selectedRoom ||
    selectedAction !== "START" ||
    !actionEnabled("START", selectedRoom) ||
    !startForm.profileId ||
    (startForm.startMode === "SCHEDULE" && !startForm.scheduleHHMM);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <div className="relative">
          <div className={cn(step === 1 ? "mt-6" : "mt-2", "flex justify-center")}>
            <Stepper step={step} />
          </div>
        </div>

        {loadError ? (
          <Card>
            <div className="text-red font-semibold">โหลดข้อมูลไม่สำเร็จ</div>
            <div className="mt-2 text-muted text-[14px]">{loadError}</div>
          </Card>
        ) : !data ? (
          <Card>
            <div className="text-muted">กำลังโหลดข้อมูล...</div>
          </Card>
        ) : (
          <>
            {(step === 2 || step === 3) && (
              <div className="mx-auto w-full max-w-[980px]">
                <div className="mb-8">
                  <div className="text-[28px] font-semibold leading-[120%]">{selectedRoom?.roomName ?? "ห้องอบ"}</div>
                  <div className="mt-2 text-[16px] text-muted">
                    ห้อง {selectedRoom?.roomNo ?? "-"} | โรงงาน {selectedRoom?.factoryName ?? "-"}
                  </div>
                </div>
              </div>
            )}

            {/* =================== Step 1 =================== */}
            {step === 1 && (
              <div className="mx-auto w-full max-w-[920px] rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[24px] font-semibold leading-[120%]">เลือกห้องอบ</div>
                    <div className="mt-2 text-[16px] text-muted leading-[140%]">เลือกห้องที่ต้องการ เริ่มงาน</div>
                  </div>

                  <div className="w-full sm:w-[360px]">
                    <div className="relative">
                      <select
                        className="h-12 w-full appearance-none rounded-md border border-border bg-bg px-4 pr-10 rd-sub16 outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
                        value={factoryId}
                        onChange={(e) => {
                          setFactoryId(e.target.value);
                          setSelectedRoomId(null);
                        }}
                        aria-label="Factory"
                      >
                        <option value="all">ทุกโรงงาน</option>
                        {data.factories.map((f) => (
                          <option key={f.factoryId} value={f.factoryId}>
                            {f.factoryName}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {rooms.map((r) => (
                    <RoomPickCard key={r.roomId} room={r} selected={r.roomId === selectedRoomId} onClick={() => setSelectedRoomId(r.roomId)} />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <Button
                    onClick={goNext}
                    disabled={!selectedRoomId}
                    className={cn(
                      "h-12 px-8 rounded-md border",
                      selectedRoomId ? "border-[color:#14AE5C] bg-[color:#14AE5C] text-white hover:bg-[color:#109A51]" : "border-[#E9E9E9] bg-[#E9E9E9] text-[color:#6B6B6B]"
                    )}
                  >
                    ถัดไป <span aria-hidden className="ml-2">›</span>
                  </Button>
                </div>
              </div>
            )}

            {/* =================== Step 2 =================== */}
            {step === 2 && (
              <div className="mx-auto w-full max-w-[980px]">
                <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <div className="text-[22px] font-semibold">เลือก Action</div>
                  <div className="mt-1 text-[16px] text-muted">เลือกการดำเนินการที่ต้องการ</div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <ActionTile
                      title="เริ่มอบ"
                      icon={<IconPlay />}
                      selected={selectedAction === "START"}
                      disabled={!actionEnabled("START", selectedRoom)}
                      onClick={() => setSelectedAction("START")}
                    />
                    <ActionTile
                      title="หยุดอบ"
                      icon={<IconStop />}
                      selected={selectedAction === "STOP"}
                      disabled={!actionEnabled("STOP", selectedRoom)}
                      onClick={() => setSelectedAction("STOP")}
                    />
                    <ActionTile
                      title="รีเซ็ต"
                      icon={<IconReset />}
                      selected={selectedAction === "RESET"}
                      disabled={!actionEnabled("RESET", selectedRoom)}
                      onClick={() => setSelectedAction("RESET")}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button type="button" className="text-[14px] text-[color:#6B6B6B] hover:underline" onClick={goBack}>
                    ← ย้อนกลับ
                  </button>

                  <Button
                    onClick={goNext}
                    disabled={!selectedAction || !selectedRoom || !actionEnabled(selectedAction, selectedRoom)}
                    className={cn(
                      "h-12 px-8 rounded-md border",
                      selectedAction && selectedRoom && actionEnabled(selectedAction, selectedRoom)
                        ? "border-[color:#14AE5C] bg-[color:#14AE5C] text-white hover:bg-[color:#109A51]"
                        : "border-[#E9E9E9] bg-[#E9E9E9] text-[color:#6B6B6B]"
                    )}
                  >
                    ถัดไป <span aria-hidden className="ml-2">›</span>
                  </Button>
                </div>
              </div>
            )}

            {/* =================== Step 3 =================== */}
            {step === 3 && (
              <div className="mx-auto w-full max-w-[980px]">
                <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <div className="text-[22px] font-semibold">เลือกโปรไฟล์อุณหภูมิ</div>
                  <div className="mt-1 text-[16px] text-muted">เลือกโปรไฟล์ที่ต้องการใช้สำหรับการอบ</div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {data.profiles.map((p) => (
                      <ProfileCard
                        key={p.profileId}
                        p={p}
                        selected={startForm.profileId === p.profileId}
                        onClick={() => setStartForm((prev) => ({ ...prev, profileId: p.profileId }))}
                      />
                    ))}
                  </div>

                  <div className="my-6 h-px w-full bg-border" />

                  <div className="text-[20px] font-semibold">เวลาการอบ</div>
                  <div className="mt-1 text-[16px] text-muted">เลือกเวลาเริ่มการอบ</div>

                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center gap-3 text-[14px]">
                        <input
                          type="radio"
                          name="startMode"
                          checked={startForm.startMode === "NOW"}
                          onChange={() => {
                            setTimePickerOpen(false);
                            setStartForm((prev) => ({ ...prev, startMode: "NOW", scheduleHHMM: nowHHMM() }));
                          }}
                        />
                        เริ่มตอนนี้
                      </label>

                      <label className="flex items-center gap-3 text-[14px] sm:justify-self-start">
                        <input
                          type="radio"
                          name="startMode"
                          checked={startForm.startMode === "SCHEDULE"}
                          onChange={() => {
                            const now = nowHHMM();
                            setPickerValue(now);
                            setStartForm((prev) => ({ ...prev, startMode: "SCHEDULE", scheduleHHMM: now }));
                          }}
                        />
                        กำหนดเวลาเริ่ม
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-[color:#3B3B3B]">เวลาเริ่ม</div>

                        <button
                          type="button"
                          disabled={startForm.startMode === "NOW"}
                          onClick={() => {
                            if (startForm.startMode === "NOW") return;
                            openTimePickerNow();
                          }}
                          className={cn(
                            "mt-2 h-11 w-full rounded-md border px-4 text-[14px] text-left",
                            startForm.startMode === "NOW"
                              ? "border-border bg-[#EFEFEF] text-[color:#7A7A7A] cursor-not-allowed"
                              : "border-border bg-bg hover:bg-surface"
                          )}
                        >
                          {hhmmDot(startForm.startMode === "NOW" ? nowHHMM() : startForm.scheduleHHMM)}
                        </button>
                      </div>

                      <TimeField label="เวลาสิ้นสุด" valueHHMM={endHHMM} disabled />

                      <ShiftHours value={startForm.shiftHours} onChange={(v) => setStartForm((prev) => ({ ...prev, shiftHours: v }))} />
                    </div>

                    <TimeWheelPicker
                      open={timePickerOpen && startForm.startMode === "SCHEDULE"}
                      title="เวลาเริ่ม"
                      value={pickerValue}
                      minuteStep={1}
                      onClose={() => setTimePickerOpen(false)}
                      onConfirm={(hhmm) => {
                        // ✅ sync ทั้งสองที่ (สำคัญมาก)
                        setStartForm((prev) => ({ ...prev, scheduleHHMM: hhmm }));
                        setPickerValue(hhmm);
                        setTimePickerOpen(false);
                      }}
                    />

                    <div className="mt-2 rounded-xl bg-[color:rgba(255,232,160,0.30)] border border-[color:rgba(255,200,70,0.55)] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-[14px] text-[color:#975102]">
                          <div className="h-9 w-9 rounded-full bg-[color:rgba(255,170,0,0.18)] grid place-items-center border border-[color:rgba(255,170,0,0.30)]">
                            !
                          </div>
                          <div className="font-semibold">{step3LeftInfo}</div>
                        </div>
                        <div className="text-[14px] font-semibold text-[color:#975102]">{step3RightInfo}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button type="button" className="text-[14px] text-[color:#6B6B6B] hover:underline" onClick={goBack}>
                    ← ย้อนกลับ
                  </button>

                  <Button
                    onClick={goNext}
                    disabled={step3NextDisabled}
                    className={cn(
                      "h-12 px-8 rounded-md border",
                      !step3NextDisabled
                        ? "border-[color:#14AE5C] bg-[color:#14AE5C] text-white hover:bg-[color:#109A51]"
                        : "border-[#E9E9E9] bg-[#E9E9E9] text-[color:#6B6B6B]"
                    )}
                  >
                    ถัดไป <span aria-hidden className="ml-2">›</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* STOP/RESET confirm modal */}
      <ModalShell
        open={modalOpen}
        title={modalTitle}
        onClose={() => {
          if (submitting) return;
          setModalOpen(false);
        }}
      >
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-surface p-4">
            <div className="text-[12px] text-muted">สรุป</div>
            <div className="mt-1 text-[14px]">
              <span className="font-semibold">ห้อง:</span> {selectedRoom?.roomName ?? "-"}
            </div>
            <div className="mt-1 text-[14px]">
              <span className="font-semibold">คำสั่ง:</span> {selectedAction ?? "-"}
            </div>
          </div>

          <div className="rounded-md border border-border bg-bg p-4 text-[14px]">
            ต้องการ{selectedAction === "STOP" ? "หยุด" : "รีเซ็ต"}ห้องนี้ใช่ไหม?
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button variant="solid" onClick={submit} disabled={modalPrimaryDisabled}>
              {submitting ? "กำลังส่งคำสั่ง..." : "ยืนยัน"}
            </Button>
          </div>
        </div>
      </ModalShell>

      {/* success modal */}
      <ModalShell
        open={successOpen}
        title="ส่งคำสั่งสำเร็จ"
        onClose={() => {
          closeAll();
          resetWizard();
        }}
      >
        <div className="space-y-4">
          <div className="rounded-md bg-[color:rgba(20,174,92,0.12)] border border-[color:rgba(20,174,92,0.25)] p-4">
            <div className="text-[14px] font-semibold text-[color:#0F8A4A]">ระบบได้รับคำสั่งแล้ว</div>
            <div className="mt-1 text-[14px] text-[color:#0F8A4A]">(Mock) จะเชื่อม API จริงภายหลัง</div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              variant="solid"
              onClick={() => {
                closeAll();
                resetWizard();
              }}
            >
              ปิด
            </Button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
