import { RoomCard } from "@/components/room/RoomCard";
import type { RoomSummary } from "@/types/room";
import { FactorySelect } from "@/components/FactorySelect";

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const qRaw = sp.q;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw ?? "").toLowerCase().trim();

  // rooms: mock
  const rooms: RoomSummary[] = [
    {
      roomId: "room-1",
      roomName: "ห้องอบ A1",
      roomNo: "01",
      factoryName: "กรุงเทพฯ",
      state: "RUNNING",
      tempC: 62.1,
      humRH: 45.3,
      furnanceOn: true,
      profileName: "โปรไฟล์มาตรฐาน 48 ชม.",
      hourNow: 3,
      hourTotal: 48,
      etaText: "12/02/2569 18.40 น.",
      lastUpdateText: "2 นาทีที่แล้ว",
    },
    {
      roomId: "room-2",
      roomName: "ห้องอบ B2",
      roomNo: "02",
      factoryName: "กรุงเทพฯ",
      state: "READY",
      tempC: 29.2,
      humRH: 58.1,
      furnanceOn: false,
      profileName: "-",
      lastUpdateText: "5 นาทีที่แล้ว",
    },
    {
      roomId: "room-3",
      roomName: "ห้องอบ C3",
      roomNo: "03",
      factoryName: "สมุทรปราการ",
      state: "FAULT",
      tempC: 100.1,
      humRH: 5.8,
      furnanceOn: false,
      lastUpdateText: "1 นาทีที่แล้ว",
      alarmText: "อุณหภูมิสูงเกินกำหนด",
    },
    {
      roomId: "room-4",
      roomName: "ห้องอบ D4",
      roomNo: "04",
      factoryName: "กรุงเทพฯ",
      state: "WARM_HOLD",
      tempC: 62.1,
      humRH: 45.3,
      furnanceOn: true,
      profileName: "โปรไฟล์มาตรฐาน 48 ชม.",
      hourNow: 48,
      hourTotal: 48,
      etaText: "การอบเสร็จสิ้น",
      lastUpdateText: "5 นาทีที่แล้ว",
    },
    {
      roomId: "room-5",
      roomName: "ห้องอบ E5",
      roomNo: "05",
      factoryName: "กรุงเทพฯ",
      state: "WAITING",
      tempC: 29.2,
      humRH: 58.1,
      furnanceOn: false,
      profileName: "โปรไฟล์มาตรฐาน 48 ชม.",
      hourNow: 0,
      hourTotal: 48,
      startInText: "1 ชั่วโมง 7 นาที",
      etaText: "12/02/2569 18.40 น.",
      lastUpdateText: "5 นาทีที่แล้ว",
    },
    {
      roomId: "room-6",
      roomName: "ห้องอบ F6",
      roomNo: "06",
      factoryName: "กรุงเทพฯ",
      state: "STOPPED",
      tempC: 29.2,
      humRH: 58.1,
      furnanceOn: false,
      profileName: "-",
      lastUpdateText: "5 นาทีที่แล้ว",
    },
    
  ];

  const factoryRaw = sp.factory;
  const factory = (Array.isArray(factoryRaw) ? factoryRaw[0] : factoryRaw ?? "").trim();

  const filteredRooms = rooms
    .filter((r) => (!q ? true : `${r.roomName ?? ""} ${r.roomNo ?? ""} ${r.factoryName ?? ""}`.toLowerCase().includes(q)))
    .filter((r) => (!factory || factory === "all" ? true : r.factoryName === factory));

  const factories = Array.from(
    new Set(rooms.map((r) => r.factoryName).filter(Boolean))
  ).sort();

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="rd-page-32">แดชบอร์ด</div>
            <div className="mt-2 rd-body20 text-muted">ติดตามสถานะห้องอบทั้งหมด</div>
          </div>

          {/* Factory select */}
          <div className="w-full lg:w-[410.5px]">
            <div className="rd-body16">โรงงาน</div>
            <FactorySelect factories={factories} />
          </div>

        </div>

        <div>
          {/* ...header... */}
          <div className="mt-8 grid items-stretch gap-6 grid-cols-1 min-[980px]:grid-cols-2">
            {filteredRooms.map((r) => (
              <div key={r.roomId} className="min-w-0 h-full">
                <RoomCard {...r} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
