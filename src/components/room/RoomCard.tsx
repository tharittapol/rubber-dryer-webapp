import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { RoomState, RoomSummary } from "@/types/room";

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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
      <div className={"h-[46px] w-[46px] rounded-[8px] grid place-items-center " + iconWrapCls}>
        <img
          src={iconSrc}
          alt=""
          className="w-6 h-6 object-contain"
        />
      </div>

      <div className="flex flex-col items-start">
        <div className={"text-[20px] font-semibold leading-[120%] " + valueCls}>{value}</div>
        <div className="text-[16px] font-normal leading-[140%] text-muted">{unit}</div>
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
        <div className="flex items-start justify-between gap-6 w-full">
          <div className="min-w-0 flex flex-col gap-2">
            <div className="text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-ink truncate">
              {room.roomName}
            </div>

            <div className="text-[20px] font-normal leading-[120%] text-muted truncate">
              ห้อง {room.roomNo} | โรงงาน {room.factoryName}
            </div>
          </div>

          <Badge className={"h-8 px-3 py-2 " + st.cls}>
            <span className="text-[16px] leading-[100%] font-normal">{st.label}</span>
          </Badge>
        </div>

        {/* Metrics */}
        <div className="w-full flex items-center justify-between gap-4">
          <Metric kind="temp" value={fmt1(room.tempC)} unit="°C" />
          <Metric kind="hum" value={fmt1(room.humRH)} unit="%RH" />
          <Metric kind="furnance" value={room.furnanceOn ? "เปิด" : "ปิด"} unit="เตา" active={room.furnanceOn} />
        </div>

        {/* Details */}
        <div className="w-full rounded-[8px] bg-[#F5F5F5] p-3">
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
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-6">
                <div className="text-[20px] font-normal leading-[120%] text-muted">โปรไฟล์:</div>
                <div className="text-[20px] font-normal leading-[120%] text-ink text-right truncate">
                  {room.profileName ?? "-"}
                </div>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="text-[20px] font-normal leading-[120%] text-muted">ชั่วโมงที่:</div>
                <div className="text-[20px] font-normal leading-[120%] text-ink text-right">
                  {room.hourNow != null && room.hourTotal != null ? `${room.hourNow} / ${room.hourTotal}` : "-"}
                </div>
              </div>

              {showWaiting && (
                <div className="flex items-center justify-between gap-6">
                  <div className="text-[20px] font-normal leading-[120%] text-muted">จะเริ่มในอีก:</div>
                  <div className="text-[20px] font-normal leading-[120%] text-[#009951] text-right">
                    {startInHas ? startInRaw : "-"}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-6">
                <div className="text-[20px] font-normal leading-[120%] text-muted">คาดว่าเสร็จ:</div>
                <div className={"text-[20px] font-normal leading-[120%] text-right " + etaCls}>
                  {etaText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 text-[16px] font-normal leading-[140%] text-muted">
          <span className="text-muted">
            <ClockIcon />
          </span>
          <span>อัปเดตล่าสุด {room.lastUpdateText}</span>
        </div>
      </Card>
    </Link>
  );
}