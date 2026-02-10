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
      <div className="mx-auto max-w-[1112px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="rd-page-32">แดชบอร์ด</div>
            <div className="mt-2 rd-body20 text-muted">ติดตามสถานะห้องอบทั้งหมด</div>
          </div>

          {/* Factory select */}
          <div className="w-full lg:w-[410.5px]">
            <div className="rd-body16">โรงงาน</div>

            <div className="mt-2 relative">
              <select
                className="h-10 w-full appearance-none rounded-md border border-border bg-bg px-4 pr-10 rd-sub16 outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
                defaultValue="all"
                aria-label="Factory"
              >
                <option value="all">ทุกโรงงาน</option>
                <option value="A">โรงงาน A</option>
                <option value="B">โรงงาน B</option>
              </select>

              {/* caret icon */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        <div>
          {/* ...header... */}
          <div className="mt-8 grid gap-6 grid-cols-1 min-[980px]:grid-cols-2">
            {filteredRooms.map((r) => (
              <div key={r.roomId} className="min-w-0">
                <RoomCard {...r} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
