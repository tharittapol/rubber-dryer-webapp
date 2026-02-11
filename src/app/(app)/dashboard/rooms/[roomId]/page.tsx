import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { RoomState } from "@/types/room";

const stateStyle: Record<RoomState, { label: string; cls: string }> = {
  RUNNING: { label: "กำลังทำงาน", cls: "border-green bg-greenBg text-greenInk" },
  WARM_HOLD: { label: "รักษาอุณหภูมิ", cls: "border-orange bg-orangeBg text-orangeInk" },
  READY: { label: "พร้อมทำงาน", cls: "border-blue bg-[color:rgba(43,127,255,0.15)] text-blue" },
  WAITING: { label: "รอดำเนินการ", cls: "border-orange bg-[color:rgba(255,105,0,0.12)] text-orangeInk" },
  STOPPED: { label: "หยุดทำงาน", cls: "border-border bg-surface text-muted" },
  FAULT: { label: "ขัดข้อง", cls: "border-red bg-redBg text-red" },
};

function CircleIconWrap({ kind, children }: { kind: "temp" | "hum" | "furnance"; children: React.ReactNode }) {
  const cls =
    kind === "temp"
      ? "bg-[color:rgba(255,105,0,0.2)] text-orange"
      : kind === "hum"
        ? "bg-[color:rgba(43,127,255,0.2)] text-blue"
        : "bg-[color:rgba(20,174,92,0.2)] text-greenInk";
  return <div className={"h-16 w-16 rounded-full grid place-items-center " + cls}>{children}</div>;
}

function ThermometerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default function RoomDetailPage({ params }: { params: { roomId: string } }) {
  // NOTE: This is mock data for the UI prototype. Replace with API data later.
  const roomName = "ห้องอบ A1";
  const roomNo = "01";
  const factoryName = "โรงงาน A";
  const state: RoomState = "RUNNING";

  const st = stateStyle[state];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1112px]">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-[20px] leading-[120%] text-muted">
              <span aria-hidden>←</span>
              <span>ย้อนกลับ</span>
            </Link>

            <div className="mt-6 text-[24px] font-semibold leading-[120%]">{roomName}</div>
            <div className="mt-2 text-[20px] leading-[120%] text-muted">
              ห้อง {roomNo} | {factoryName}
            </div>
          </div>

          <Badge className={st.cls}>{st.label}</Badge>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          {/* Current status */}
          <Card className="shadow-none w-full lg:w-[544px]">
            <div className="flex items-center gap-3 text-[24px] font-semibold leading-[120%]">
              <span aria-hidden>〰</span>
              <span>สถานะปัจจุบัน</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-6">
              <div>
                <div className="text-[20px] leading-[120%] text-muted">สถานะ</div>
                <div className="mt-2 text-[24px] font-semibold leading-[120%] text-greenInk">กำลังทำงาน</div>
              </div>
              <div>
                <div className="text-[20px] leading-[120%] text-muted">สถานะแจ้งเตือน</div>
                <div className="mt-2 text-[24px] font-semibold leading-[120%]">ปกติ</div>
              </div>
              <div>
                <div className="text-[20px] leading-[120%] text-muted">ชั่วโมงที่</div>
                <div className="mt-2 text-[24px] font-semibold leading-[120%] text-blue">7</div>
              </div>
              <div>
                <div className="text-[20px] leading-[120%] text-muted">อุณหภูมิเป้าหมาย</div>
                <div className="mt-2 text-[24px] font-semibold leading-[120%] text-orange">95.0°C</div>
              </div>
              <div className="col-span-2">
                <div className="text-[20px] leading-[120%] text-muted">คาดว่าเสร็จ</div>
                <div className="mt-2 text-[24px] font-semibold leading-[120%]">12/03/2569 16.00 น.</div>
              </div>
            </div>
          </Card>

          {/* Latest (Realtime) */}
          <Card className="shadow-none w-full lg:w-[544px]">
            <div className="text-[24px] font-semibold leading-[120%]">ค่าสุด (Realtime)</div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <CircleIconWrap kind="temp">
                  <ThermometerIcon />
                </CircleIconWrap>
                <div>
                  <div className="text-[20px] leading-[120%] text-muted">อุณหภูมิ</div>
                  <div className="mt-2 text-[32px] font-semibold leading-[120%] text-orange">93.6°C</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CircleIconWrap kind="hum">
                  <DropIcon />
                </CircleIconWrap>
                <div>
                  <div className="text-[20px] leading-[120%] text-muted">ความชื้นสัมพัทธ์</div>
                  <div className="mt-2 text-[32px] font-semibold leading-[120%] text-blue">93.6%</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CircleIconWrap kind="furnance">
                  <FlameIcon />
                </CircleIconWrap>
                <div>
                  <div className="text-[20px] leading-[120%] text-muted">สถานะเตาอบ</div>
                  <div className="mt-2 text-[32px] font-semibold leading-[120%] text-greenInk">เปิด</div>
                </div>
              </div>

              <div className="h-px w-full bg-border" />

              <div className="text-[20px] leading-[120%] text-muted flex items-center gap-2">
                <span aria-hidden>⏱</span>
                <span>อัปเดตล่าสุด 1 นาที</span>
              </div>
            </div>
          </Card>
        </div>

        {/* History */}
        <div className="mt-8 text-[24px] font-semibold leading-[120%]">ประวัติรายการห้องอบ A1</div>

        <Card className="shadow-none mt-4 p-0 overflow-hidden">
          <div className="grid grid-cols-3 bg-surface px-6 py-4 border-b border-border">
            <div className="text-[20px] leading-[120%] text-muted">เวลาเริ่ม</div>
            <div className="text-[20px] leading-[120%] text-muted">เวลาจบ</div>
            <div className="text-[20px] leading-[120%] text-muted text-center">ระยะเวลาการอบ</div>
          </div>

          {[
            { s: "01/02/2026 09.00", e: "03/02/2026 08.59", d: "48 ชั่วโมง" },
            { s: "01/02/2026 09.00", e: "03/02/2026 08.59", d: "48 ชั่วโมง" },
            { s: "01/02/2026 09.00", e: "03/02/2026 08.59", d: "48 ชั่วโมง" },
          ].map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 px-6 py-5 border-b border-border last:border-b-0">
              <div className="text-[20px] leading-[120%]">{row.s}</div>
              <div className="text-[20px] leading-[120%]">{row.e}</div>
              <div className="text-[20px] leading-[120%] text-center">{row.d}</div>
            </div>
          ))}
        </Card>

        {/* Hidden debug */}
        <div className="sr-only">roomId: {params.roomId}</div>
      </div>
    </div>
  );
}
