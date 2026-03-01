import { RoomCard } from "@/components/room/RoomCard";
import type { RoomSummary } from "@/types/room";
import { FactorySelect } from "@/components/FactorySelect";
import { getDashboardData } from "@/lib/mockRepo.server";

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const qRaw = sp.q;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw ?? "").toLowerCase().trim();

  const factoryRaw = sp.factory;
  const factory = (Array.isArray(factoryRaw) ? factoryRaw[0] : factoryRaw ?? "").trim();

  // mock data
  const { rooms, factories } = await getDashboardData();

  const filteredRooms: RoomSummary[] = rooms
    .filter((r) => (!q ? true : `${r.roomName ?? ""} ${r.roomNo ?? ""} ${r.factoryName ?? ""}`.toLowerCase().includes(q)))
    .filter((r) => (!factory || factory === "all" ? true : r.factoryName === factory));

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="rd-page-32">แดชบอร์ด</div>
            <div className="mt-2 rd-body20 text-muted">ติดตามสถานะห้องอบทั้งหมด</div>
          </div>

          <div className="w-full lg:w-[410.5px]">
            <div className="rd-body16">โรงงาน</div>
            <FactorySelect factories={factories} />
          </div>
        </div>

        <div className="mt-8 grid items-stretch gap-6 grid-cols-1 min-[980px]:grid-cols-2">
          {filteredRooms.map((r) => (
            <div key={r.roomId} className="min-w-0 h-full">
              <RoomCard {...r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}