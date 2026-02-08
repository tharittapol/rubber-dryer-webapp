import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { RoomState, RoomSummary } from "@/types/room";

const stateStyle: Record<RoomState, { label: string; cls: string }> = {
  RUNNING: { label: "กำลังทำงาน", cls: "border-green bg-greenBg text-greenInk" },
  WARM_HOLD: { label: "รักษาอุณหภูมิ", cls: "border-orange bg-orangeBg text-orangeInk" },
  READY: { label: "พร้อมทำงาน", cls: "border-blue bg-[color:rgba(43,127,255,0.15)] text-blue" },
  WAITING: { label: "รอดำเนินการ", cls: "border-orange bg-[color:rgba(255,105,0,0.12)] text-orangeInk" },
  STOPPED: { label: "หยุดทำงาน", cls: "border-border bg-surface text-muted" },
  FAULT: { label: "ขัดข้อง", cls: "border-red bg-redBg text-red" },
};

function Metric({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[46px] w-[46px] rounded-sm bg-surface grid place-items-center text-muted">◎</div>
      <div>
        <div className="text-[20px] font-semibold leading-[120%]">{value}</div>
        <div className="text-[16px] text-muted leading-[140%]">{unit}</div>
      </div>
    </div>
  );
}

export function RoomCard(room: RoomSummary) {
  const st = stateStyle[room.state];

  return (
    <Card className="shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[24px] font-semibold leading-[120%] truncate">{room.roomName}</div>
          <div className="text-[18px] text-muted leading-[120%] truncate">
            ห้อง {room.roomNo} | โรงงาน {room.factoryName}
          </div>
        </div>

        <Badge className={st.cls}>{st.label}</Badge>
      </div>

      <div className="mt-5 flex flex-wrap gap-6">
        <Metric value={room.tempC.toFixed(1)} unit="°C" />
        <Metric value={room.humRH.toFixed(1)} unit="%RH" />
        <Metric value={room.kilnOn ? "เปิด" : "ปิด"} unit="เตา" />
      </div>

      <div className="mt-5 rounded-md bg-surface p-4">
        {room.state === "FAULT" && room.alarmText ? (
          <div className="text-red font-semibold">⚠ {room.alarmText}</div>
        ) : (
          <div className="grid grid-cols-2 gap-y-2 text-[16px] leading-[140%]">
            <div className="text-muted">โปรไฟล์:</div>
            <div className="font-semibold text-right">{room.profileName ?? "-"}</div>

            <div className="text-muted">ชั่วโมงที่:</div>
            <div className="font-semibold text-right">
              {room.hourNow && room.hourTotal ? `${room.hourNow} / ${room.hourTotal}` : "-"}
            </div>

            <div className="text-muted">คาดว่าเสร็จ:</div>
            <div className="font-semibold text-right text-greenInk">{room.etaText ?? "-"}</div>
          </div>
        )}
      </div>

      <div className="mt-4 text-[14px] text-muted">⏱ อัปเดตล่าสุด {room.lastUpdateText}</div>
    </Card>
  );
}
