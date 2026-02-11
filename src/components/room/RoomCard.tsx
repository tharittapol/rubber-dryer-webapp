import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { RoomState, RoomSummary } from "@/types/room";

function fmt1(v: unknown): string {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return "--";
  return n.toFixed(1);
}

type RoomState =
  | "RUNNING"
  | "WARM_HOLD"
  | "READY"
  | "WAITING"
  | "STOPPED"
  | "FAULT";

const STATE_UI: Record<RoomState, { label: string; cls: string }> = {
  RUNNING:   { label: "กำลังทำงาน",   cls: "bg-greenBg text-greenInk border-greenInk" },
  WARM_HOLD: { label: "รักษาอุณหภูมิ", cls: "bg-orangeBg text-orangeInk border-orangeInk" },
  READY:     { label: "พร้อมทำงาน",   cls: "bg-[color:rgba(43,127,255,0.2)] text-blue border-blue" },
  WAITING:   { label: "รอดำเนินการ",  cls: "bg-[color:rgba(232,185,49,0.2)] text-orangeInk border-[color:#975102]" },
  STOPPED:   { label: "หยุดทำงาน",    cls: "bg-[#F5F5F5] text-ink border-[#767676]" },
  FAULT:     { label: "ขัดข้อง",      cls: "bg-redBg text-red border-red" },
};

function normalizeState(input: unknown): string {
  return String(input ?? "").trim().toUpperCase().replace(/\s+/g, "_");
}

function getRoomStateUI(input: unknown) {
  const key = normalizeState(input) as RoomState;
  return STATE_UI[key] ?? { label: "ไม่ทราบสถานะ", cls: "bg-[#F5F5F5] text-muted border-border" };
}

function ThermometerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c2.5 3 3 5.5 2 8 2-.5 4-2.5 4-5 3 3 4 7 2.5 11A7.5 7.5 0 1 1 6 9c0 3 2 5 4 6-1-3 .5-6 2-13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MetricKind = "temp" | "hum" | "furnance";

function Metric({ kind, value, unit, active }: { kind: MetricKind; value: string; unit: string; active?: boolean;}) {
  const iconWrapCls =
    kind === "temp"
      ? "bg-[color:rgba(255,105,0,0.2)] text-orange"
      : kind === "hum"
        ? "bg-[color:rgba(43,127,255,0.2)] text-blue"
        : active
          ? "bg-[color:rgba(20,174,92,0.2)] text-greenInk" // furnance OFF
          : "bg-[#F5F5F5] text-[#767676]";  //furnance ON

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className={"h-[46px] w-[46px] shrink-0 rounded-sm grid place-items-center " + iconWrapCls}>
        {kind === "temp" ? <ThermometerIcon /> : kind === "hum" ? <DropIcon /> : <FlameIcon />}
      </div>
      <div className="min-w-0">
        <div className="text-[20px] font-semibold leading-[120%] truncate">{value}</div>
        <div className="text-[16px] text-muted leading-[140%] truncate">{unit}</div>
      </div>
    </div>
  );
}

export function RoomCard(room: RoomSummary) {
  const st = getRoomStateUI(room.state);

  return (
    <Link href={`/dashboard/rooms/${encodeURIComponent(room.roomId)}`} className="block h-full">
      <Card className="shadow-none w-full">
        {/* content top */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[24px] font-semibold leading-[120%] truncate">
                {room.roomName}
              </div>
              <div className="mt-1 text-[16px] text-muted leading-[120%] truncate">
                ห้อง {room.roomNo} | โรงงาน {room.factoryName}
              </div>
            </div>
            <div className="shrink-0">
              <Badge className={st.cls}>{st.label}</Badge>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Metric kind="temp" value={fmt1(room.tempC)} unit="°C" />
            <Metric kind="hum" value={fmt1(room.humRH)} unit="%RH" />
            <Metric kind="furnance" value={room.furnanceOn ? "เปิด" : "ปิด"} unit="เตา" active={room.furnanceOn} />
          </div>

          {/* details (auto height) */}
          <div className="mt-4 rounded-md bg-surface p-4">
            {room.state === "FAULT" && room.alarmText ? (
              <div className="rounded-md bg-redBg p-6 text-red font-semibold">
                ⚠ {room.alarmText}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-2 text-[16px] leading-[140%]">
                <div className="text-muted">โปรไฟล์:</div>
                <div className="font-semibold text-right">{room.profileName ?? "-"}</div>

                <div className="text-muted">ชั่วโมงที่:</div>
                <div className="font-semibold text-right">
                  {room.hourNow != null && room.hourTotal != null ? `${room.hourNow} / ${room.hourTotal}` : "-"}
                </div>

                {room.state === "WAITING" && (
                  <>
                    <div className="text-muted">จะเริ่มในอีก:</div>
                    <div className="font-semibold text-right text-greenInk">
                      {room.startInText ?? "-"}
                    </div>
                  </>
                )}

                <div className="text-muted">คาดว่าเสร็จ:</div>
                <div className="font-semibold text-right text-greenInk">{room.etaText ?? "-"}</div>
              </div>
            )}
          </div>
        </div>

        {/* spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* footer pinned to bottom with constant bottom spacing */}
        <div className="pt-4 pb-4 text-[16px] text-muted flex items-center gap-2">
          <span aria-hidden>⏱</span>
          <span>อัปเดตล่าสุด {room.lastUpdateText}</span>
        </div>
      </Card>
    </Link>
  );
}
