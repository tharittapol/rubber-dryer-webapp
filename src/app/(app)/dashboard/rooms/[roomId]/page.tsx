import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { notFound } from "next/navigation";
import { getRoomDetailData } from "@/lib/mockRepo.server";
import type { RoomState } from "@/types/room";

type Params = { roomId: string };

function RoomMetricSvg({ kind, active }: { kind: "temp" | "hum" | "furnance"; active?: boolean }) {
  const src =
    kind === "temp"
      ? "/icons/temp.svg"
      : kind === "hum"
        ? "/icons/humid.svg"
        : active
          ? "/icons/furnaceOn.svg"
          : "/icons/furnaceOff.svg";

  return (
    <img
      src={src}
      alt=""
      // mobile: 24, desktop: 40
      className="w-6 h-6 sm:w-10 sm:h-10 object-contain"
    />
  );
}

function RoomBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <Badge
      className={cn(
        // Figma tag: h32, px12, py8, gap8, line-height 100%, radius 9999
        "h-8 px-3 py-2 text-[16px] leading-[100%] rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function RoomCard({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "rounded24" | "table" }) {
  const v =
    variant === "rounded24"
      ? "rounded-3xl" // 24px
      : "rounded-2xl"; // 16px (table/history)
  return <Card className={cn("shadow-none bg-white", v, className)} {...props} />;
}

const stateStyle: Record<RoomState, { label: string; cls: string }> = {
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

function CircleIconWrap({
  kind,
  active = true,
  children,
}: {
  kind: "temp" | "hum" | "furnance";
  active?: boolean;
  children: ReactNode;
}) {
  const cls =
    kind === "temp"
      ? "bg-[color:rgba(255,105,0,0.2)]"
      : kind === "hum"
        ? "bg-[color:rgba(43,127,255,0.2)]"
        : active
          ? "bg-[color:rgba(20,174,92,0.2)]"
          : "bg-[#F5F5F5]";

  return (
    <div
      className={
        // mobile: 48x48, desktop: 64x64
        "grid place-items-center rounded-full " +
        "h-12 w-12 sm:h-16 sm:w-16 " +
        cls
      }
    >
      {children}
    </div>
  );
}

function ActivityIcon() {
  return (
    <img src="/icons/state.svg" alt="" className="w-6 h-6 lg:w-6 lg:h-6 object-contain" />
  );
}

function ClockIcon() {
  return (
    <img src="/icons/clock.svg" alt="" className="w-4 h-4 lg:w-4 lg:h-4 object-contain" />
  );
}

const HISTORY_COLS = "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(72px,0.6fr)]";

function InfoPair({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0">
      {/* Figma label: 20px / mobile ลดเหลือ 16 */}
      <div className="text-[16px] sm:text-[20px] leading-[120%] text-muted">{label}</div>

      {/* Figma value: 28px / mobile ลด */}
      <div className={"mt-2 text-[20px] sm:text-[28px] font-semibold leading-[120%] " + valueClassName}>
        {value}
      </div>
    </div>
  );
}

export default async function RoomDetailPage({ params }: { params: Promise<Params> }) {
  const { roomId } = await params;

  const room = await getRoomDetailData(roomId);
  if (!room) notFound();

  const roomName = room.roomName;
  const roomNo = room.roomNo;
  const factoryName = room.factoryName;
  const state: RoomState = room.state;

  // realtime
  const tempC = room.tempC;
  const humRH = room.humRH;
  const furnanceOn = room.furnanceOn;
  const lastUpdateText = room.lastUpdateText;

  const stateText = stateStyle[state].label;
  const hourNow = room.hourNow ?? "-";
  const hourTotal = room.hourTotal ?? "-";
  const etaText = room.etaText ?? "-";
  const alarmText = room.alarmText ?? "ปกติ";

  const st = stateStyle[state];

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Back button (Frame 52) */}
        <div className="pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[16px] leading-[100%] text-[#303030]"
          >
            <span aria-hidden><img src="/icons/leftArrow.svg" alt="" className="w-3 h-3 lg:w-3 lg:h-3 object-contain" /></span>
            <span>ย้อนกลับ</span>
          </Link>
        </div>

        {/* Header: left text + right tag, align bottom */}
        <div className="mt-6 flex items-end justify-between gap-6">
          <div className="min-w-0">
            {/* Heading 24 */}
            <div className="text-[20px] sm:text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-text">
              {roomName}
            </div>

            {/* Subheading 20 */}
            <div className="mt-2 text-[16px] sm:text-[20px] leading-[120%] text-muted">
              ห้อง {roomNo} | {factoryName}
            </div>
          </div>

          {/* Tag Status: h32, px12, font16 line-height 100% */}
          <RoomBadge className={st.cls}>{st.label}</RoomBadge>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current status (Frame 43) */}
          <RoomCard variant="rounded24" className="w-full">
            {/* Title row (Frame 47) */}
            <div className="flex items-center gap-2">
              <span className="text-text">
                <ActivityIcon />
              </span>
              <div className="text-[20px] sm:text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-text">
                สถานะปัจจุบัน
              </div>
            </div>

            {/* Content blocks */}
            <div className="mt-6 grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6">
              <InfoPair label="สถานะ" value={stateText} valueClassName={state === "RUNNING" ? "text-greenInk" : ""} />
              <InfoPair label="สถานะแจ้งเตือน" value={alarmText} valueClassName={state === "FAULT" ? "text-red" : ""} />

              <InfoPair label="ชั่วโมงที่" value={hourNow === "-" ? "-" : `${hourNow}/${hourTotal}`} valueClassName="text-blue" />
              <InfoPair label="อุณหภูมิเป้าหมาย" value="60.0°C" valueClassName="text-orange" />

              <div className="col-span-2">
                <InfoPair label="คาดว่าเสร็จ" value={etaText} />
              </div>
            </div>
          </RoomCard>

          {/* Latest (Realtime) */}
          <RoomCard variant="rounded24" className="w-full">
            <div className="text-[20px] sm:text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-text">
              ค่าล่าสุด (Realtime)
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {/* temp */}
              <div className="flex items-center gap-6">
                <CircleIconWrap kind="temp">
                  <RoomMetricSvg kind="temp" />
                </CircleIconWrap>
                <div className="min-w-0">
                  <div className="text-[16px] leading-[140%] text-muted">อุณหภูมิ</div>
                  <div className="mt-2 text-[20px] sm:text-[28px] font-semibold leading-[120%] text-orange">
                    {tempC.toFixed(1)}°C
                  </div>
                </div>
              </div>

              {/* hum */}
              <div className="flex items-center gap-6">
                <CircleIconWrap kind="hum">
                  <RoomMetricSvg kind="hum" />
                </CircleIconWrap>
                <div className="min-w-0">
                  <div className="text-[16px] leading-[140%] text-muted">ความชื้นสัมพัทธ์</div>
                  <div className="mt-2 text-[20px] sm:text-[28px] font-semibold leading-[120%] text-blue">
                    {humRH.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* furnace */}
              <div className="flex items-center gap-6">
                <CircleIconWrap kind="furnance">
                  <RoomMetricSvg kind="furnance" active={furnanceOn} />
                </CircleIconWrap>
                <div className="min-w-0">
                  <div className="text-[16px] leading-[140%] text-muted">สถานะเตาอบ</div>
                  <div className={cn(
                    "mt-2 text-[20px] sm:text-[28px] font-semibold leading-[120%]",
                    furnanceOn ? "text-greenInk" : "text-muted"
                  )}>
                    {furnanceOn ? "เปิด" : "ปิด"}
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-border my-1" />

              <div className="flex items-center gap-2 text-[16px] leading-[140%] text-muted">
                <span className="text-muted">
                  <ClockIcon />
                </span>
                <span>อัปเดตล่าสุด {lastUpdateText}</span>
              </div>
            </div>
          </RoomCard>
        </div>

        {/* History title*/}
        <div className="mt-8 text-[20px] sm:text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-text">
          ประวัติรายการห้องอบ A1
        </div>

        {/* History table */}
        <RoomCard variant="table" className="mt-4 p-0 overflow-hidden">
          {/* Header row */}
          <div className={cn("grid", HISTORY_COLS, "bg-[#F5F5F5] px-4 sm:px-6 py-4 border-b border-border gap-3 sm:gap-6")}>
            <div className="text-[16px] sm:text-[20px] leading-[120%] text-muted">เวลาเริ่ม</div>
            <div className="text-[16px] sm:text-[20px] leading-[120%] text-muted">เวลาจบ</div>
            <div className="text-[16px] sm:text-[20px] leading-[120%] text-muted">ระยะเวลาการอบ</div>
          </div>

          {[
            { s: "01/02/2026 09.00", e: "03/02/2026 08.59", d: "48 ชั่วโมง" },
            { s: "01/02/2026 09.00", e: "03/02/2026 08.59", d: "48 ชั่วโมง" },
            { s: "01/02/2026 09.00", e: "03/02/2026 08.59", d: "48 ชั่วโมง" },
          ].map((row, idx) => (
            <div
              key={idx}
              className={cn(
                "grid items-start",
                HISTORY_COLS,
                "px-4 sm:px-6 py-4 border-b border-border last:border-b-0 gap-3 sm:gap-6",
                "text-[16px] sm:text-[20px] leading-[120%] text-text tabular-nums"
              )}
            >
              <div className="min-w-0">
                <span className="block sm:inline">{row.s.split(" ")[0]}</span>{" "}
                <span className="block sm:inline">{row.s.split(" ")[1]}</span>
              </div>

              <div className="min-w-0">
                <span className="block sm:inline">{row.e.split(" ")[0]}</span>{" "}
                <span className="block sm:inline">{row.e.split(" ")[1]}</span>
              </div>

              <div className="min-w-0 text-center whitespace-nowrap">{row.d}</div>
            </div>
          ))}
        </RoomCard>

        {/* Hidden debug */}
        <div className="sr-only">roomId: {roomId}</div>
      </div>
    </div>
  );
}