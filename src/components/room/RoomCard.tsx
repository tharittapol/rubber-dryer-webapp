import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { RoomState, RoomSummary } from "@/types/room";

const TXT20 = "text-base lg:text-[20px]";
const LEAD20 = "leading-[130%] lg:leading-[120%]";

function fmt1(v: unknown): string {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return "--";
  return n.toFixed(1);
}

const STATE_UI: Record<RoomState, { label: string; cls: string }> = {
  RUNNING: {
    label: "กำลังทำงาน",
    cls: "bg-[rgba(20,174,92,0.2)] text-[#009951] border-[#14AE5C]",
  },
  FAULT: {
    label: "ขัดข้อง",
    cls: "bg-[rgba(192,15,12,0.2)] text-[#EC221F] border-[#EC221F]",
  },
  WARM_HOLD: {
    label: "รักษาอุณหภูมิ",
    cls: "bg-[rgba(255,105,0,0.2)] text-[#FF6900] border-[#FF6900]",
  },
  WAITING: {
    label: "รอดำเนินการ",
    cls: "bg-[rgba(232,185,49,0.2)] text-[#BF6A02] border-[#975102]",
  },
  READY: {
    label: "พร้อมทำงาน",
    cls: "bg-[rgba(43,127,255,0.2)] text-[#2B7FFF] border-[#2B7FFF]",
  },
  STOPPED: {
    label: "หยุดทำงาน",
    cls: "bg-[#F5F5F5] text-[#2C2C2C] border-[#767676]",
  },
};

function normalizeState(input: unknown): string {
  return String(input ?? "").trim().toUpperCase().replace(/\s+/g, "_");
}

function getRoomStateUI(input: unknown) {
  const key = normalizeState(input) as RoomState;
  return STATE_UI[key] ?? { label: "ไม่ทราบสถานะ", cls: "bg-[#F5F5F5] text-muted border-border" };
}

function ClockIcon() {
  return (
    <img src="/icons/clock.svg" alt="" className="w-4 h-4 lg:w-4 lg:h-4 object-contain" />
  );
}

type MetricKind = "temp" | "hum" | "furnance";

function Metric({
  kind,
  value,
  unit,
  active,
}: {
  kind: MetricKind;
  value: string;
  unit: string;
  active?: boolean;
}) {
  const iconWrapCls =
    kind === "temp"
      ? "bg-[color:rgba(255,105,0,0.2)]"
      : kind === "hum"
        ? "bg-[color:rgba(43,127,255,0.2)]"
        : active
          ? "bg-[color:rgba(20,174,92,0.2)]"
          : "bg-[#F5F5F5]";

  const iconSrc =
    kind === "temp"
      ? "/icons/temp.svg"
      : kind === "hum"
        ? "/icons/humid.svg"
        : active
          ? "/icons/furnaceOn.svg"
          : "/icons/furnaceOff.svg";

  const valueCls = kind === "furnance" && active ? "text-[#009951]" : "text-ink";

  return (
    <div className="flex items-center gap-2">
      <div className={"h-10 w-10 lg:h-[46px] lg:w-[46px] rounded-[8px] grid place-items-center " + iconWrapCls}>
        <img src={iconSrc} alt="" className="w-5 h-5 lg:w-6 lg:h-6 object-contain" />
      </div>

      <div className="flex flex-col items-start">
        <div className={"font-semibold " + LEAD20 + " " + TXT20 + " " + valueCls}>{value}</div>
        <div className={"text-sm lg:text-[16px] font-normal leading-[140%] text-muted"}>{unit}</div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueCls = "text-ink",
}: {
  label: string;
  value: React.ReactNode;
  valueCls?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-2 min-w-0">
      {/* Left: Do not shrink */}
      <div className="shrink-0 text-base lg:text-[20px] font-normal leading-[130%] lg:leading-[120%] text-muted">
        {label}
      </div>

      {/* Right: Keep to the right + Allow wrapping + No cutting… */}
      <div
        className={
          "min-w-0 flex-1 text-right text-base lg:text-[20px] font-normal leading-[130%] lg:leading-[120%] break-words whitespace-normal " +
          valueCls
        }
      >
        {value}
      </div>
    </div>
  );
}

export function RoomCard(room: RoomSummary) {
  const st = getRoomStateUI(room.state);

  const etaRaw = typeof room.etaText === "string" ? room.etaText.trim() : "";
  const etaHas = etaRaw.length > 0;
  const etaText = etaHas ? etaRaw : "-";
  const etaCls = etaHas ? "text-[#009951]" : "text-ink";

  const showWaiting = normalizeState(room.state) === "WAITING";
  const startInRaw = typeof room.startInText === "string" ? room.startInText.trim() : "";
  const startInHas = startInRaw.length > 0;

  return (
    <Link href={`/dashboard/rooms/${encodeURIComponent(room.roomId)}`} className="block">
      <Card className="shadow-none flex flex-col gap-4 h-full">
        {/* Header */}
        <div className="w-full min-w-0">
          {/* Row 1: title + badge (same row) */}
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="min-w-0 text-lg lg:text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-ink truncate">
              {room.roomName}
            </div>

            <Badge className={"h-7 lg:h-8 px-2.5 lg:px-3 py-1 lg:py-1.5 shrink-0 " + st.cls}>
              <span className="text-[14px] leading-none font-normal">{st.label}</span>
            </Badge>
          </div>

          {/* Row 2: room no + factory name (for long name) */}
          <div className="mt-1 text-base lg:text-[20px] font-normal leading-[130%] text-muted break-words">
            ห้อง {room.roomNo} | โรงงาน {room.factoryName}
          </div>
        </div>

        {/* Metrics */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 lg:gap-4">
          <Metric kind="temp" value={fmt1(room.tempC)} unit="°C" />
          <Metric kind="hum" value={fmt1(room.humRH)} unit="%RH" />
          <Metric kind="furnance" value={room.furnanceOn ? "เปิด" : "ปิด"} unit="เตา" active={room.furnanceOn} />
        </div>

        {/* Details */}
        <div className="w-full rounded-[8px] bg-[#F5F5F5] p-2.5 lg:p-3">
          {normalizeState(room.state) === "FAULT" && room.alarmText ? (
            <div className="rounded-[8px] bg-redBg p-3 text-red font-semibold text-[20px] leading-[120%]">
              <div className="flex items-center gap-3 text-red">
                <img
                  src="/icons/alarm.svg"
                  alt=""
                  className="w-6 h-6 shrink-0"
                />
                <span className="text-[20px] font-semibold leading-[120%]">
                  {room.alarmText}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <DetailRow label="โปรไฟล์:" value={room.profileName ?? "-"} />

              <DetailRow
                label="ชั่วโมงที่:"
                value={room.hourNow != null && room.hourTotal != null ? `${room.hourNow} / ${room.hourTotal}` : "-"}
              />

              {showWaiting && (
                <DetailRow
                  label="จะเริ่มในอีก:"
                  value={startInHas ? startInRaw : "-"}
                  valueCls="text-[#009951]"
                />
              )}

              <DetailRow
                label="คาดว่าเสร็จ:"
                value={etaText}
                valueCls={etaHas ? "text-[#009951]" : "text-ink"}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 text-sm lg:text-[16px] font-normal leading-[140%] text-muted">
          <span className="text-muted">
            <ClockIcon />
          </span>
          <span>อัปเดตล่าสุด {room.lastUpdateText}</span>
        </div>
      </Card>
    </Link>
  );
}