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

  const filteredRooms = !q
    ? rooms
    : rooms.filter((r) => {
        const hay = `${r.roomName ?? ""} ${r.roomNo ?? ""} ${r.factoryName ?? ""}`.toLowerCase();
        return hay.includes(q);
      });

  return (
    <div className="w-full">
      {/* Content width matches the Figma main frame (1112px) */}
      <div className="mx-auto max-w-[1112px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="text-[24px] font-semibold leading-[120%]">แดชบอร์ด</div>
            <div className="mt-2 text-[20px] leading-[120%] text-muted">ติดตามสถานะห้องอบทั้งหมด</div>
          </div>

          {/* Factory select (as in Figma export) */}
          <div className="w-full lg:w-[410.5px] rounded-md border border-border bg-bg p-6">
            <div className="text-[20px] leading-[120%] text-muted">โรงงาน</div>
            <select
              className="mt-3 h-10 w-full rounded-md border border-border bg-bg px-4 text-[16px] leading-[100%]"
              defaultValue="all"
              aria-label="Factory"
            >
              <option value="all">ทุกโรงงาน</option>
              <option value="A">โรงงาน A</option>
              <option value="B">โรงงาน B</option>
            </select>
          </div>
        </div>

        {/* Room cards grid (2 columns on desktop, 1 on mobile)
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK.map((r) => (
            <div key={r.roomId} className="w-full">
              <RoomCard {...r} />
            </div>
          ))}
        </div> */}
        <div>
          {/* ...header... */}
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredRooms.map((r) => (
              <RoomCard key={r.roomId} {...r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
