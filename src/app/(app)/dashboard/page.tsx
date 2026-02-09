import { RoomCard } from "@/components/room/RoomCard";
import type { RoomSummary } from "@/types/room";

const MOCK: RoomSummary[] = [
  {
    roomId: "room-1",
    roomName: "Room A",
    roomNo: "01",
    factoryName: "Factory 1",
    state: "RUNNING",
    tempC: 62.1,
    humRH: 45.3,
    kilnOn: true,
    profileName: "STD-10H",
    hourNow: 3,
    hourTotal: 10,
    etaText: "18:40",
    lastUpdateText: "2 นาทีที่แล้ว",
  },
  {
    roomId: "room-2",
    roomName: "Room B",
    roomNo: "02",
    factoryName: "Factory 1",
    state: "READY",
    tempC: 29.2,
    humRH: 58.1,
    kilnOn: false,
    profileName: "-",
    lastUpdateText: "5 นาทีที่แล้ว",
  },
  {
    roomId: "room-3",
    roomName: "Room C",
    roomNo: "03",
    factoryName: "Factory 2",
    state: "FAULT",
    tempC: 0,
    humRH: 0,
    kilnOn: false,
    lastUpdateText: "1 นาทีที่แล้ว",
    alarmText: "Sensor TEMP ขาดหาย / Communication error",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="rd-h24">Dashboard</div>
          <div className="rd-body16 rd-muted mt-2">Monitor ทุกห้อง (Responsive: มือถือ 1 คอลัมน์ / เดสก์ท็อป 2-3 คอลัมน์)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK.map((r) => (
          <RoomCard key={r.roomId} {...r} />
        ))}
      </div>
    </div>
  );
}
