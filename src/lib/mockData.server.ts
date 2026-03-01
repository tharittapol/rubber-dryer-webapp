
import "server-only";

import path from "node:path";
import { readFile } from "node:fs/promises";
import { cache } from "react";
import type { RoomState, RoomSummary } from "@/types/room";

export type Factory = {
  id: string;
  name: string;
  addressLine: string;
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  roomsCount: number;
  note?: string;
  updatedAt: string;
};

export type RoomConfig = {
  id: string; // in rooms.json
  roomName: string;
  roomNo: string;
  factoryName: string;
  plcIp: string;
  gatewayId: string;
};

export type RoomsMock = { rooms: RoomConfig[]; factories: string[] };
export type FactoriesMock = { factories: Factory[] };

const readJson = cache(async <T,>(rel: string): Promise<T> => {
  const full = path.join(process.cwd(), rel);
  const raw = await readFile(full, "utf8");
  return JSON.parse(raw) as T;
});

export const getRoomsMock = cache(async (): Promise<RoomsMock> => readJson<RoomsMock>("public/mock/rooms.json"));
export const getFactoriesMock = cache(async (): Promise<FactoriesMock> =>
  readJson<FactoriesMock>("public/mock/factories.json")
);

export const getFactoryNames = cache(async (): Promise<string[]> => {
  const rooms = await getRoomsMock();
  if (Array.isArray(rooms.factories) && rooms.factories.length) return rooms.factories;

  const fac = await getFactoriesMock();
  return fac.factories.map((f) => f.name).filter(Boolean);
});

export const getRoomConfigById = cache(async (roomId: string): Promise<RoomConfig | undefined> => {
  const { rooms } = await getRoomsMock();
  return rooms.find((r) => r.id === roomId);
});

function hash32(input: string): number {
  // FNV-1a (deterministic)
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function f01(h: number, salt: number) {
  // 0..1 deterministic
  const x = (h ^ (salt * 2654435761)) >>> 0;
  return (x % 1000) / 1000;
}

function range(h: number, salt: number, min: number, max: number) {
  return min + f01(h, salt) * (max - min);
}

const STATES: RoomState[] = ["RUNNING", "READY", "WARM_HOLD", "WAITING", "STOPPED", "FAULT"];

export const getRoomSummariesMock = cache(async (): Promise<RoomSummary[]> => {
  const { rooms } = await getRoomsMock();

  return rooms.map((r, idx) => {
    const h = hash32(r.id);
    const state = STATES[(h + idx) % STATES.length];

    // metrics by state (สมเหตุสมผลขึ้น)
    const tempC =
      state === "RUNNING" || state === "WARM_HOLD"
        ? range(h, 1, 70, 100)
        : state === "FAULT"
          ? range(h, 2, 95, 110)
          : range(h, 3, 25, 45);

    const humRH =
      state === "RUNNING" || state === "WARM_HOLD"
        ? range(h, 4, 40, 95)
        : state === "FAULT"
          ? range(h, 5, 0, 15)
          : range(h, 6, 30, 75);

    const furnanceOn = state === "RUNNING" || state === "WARM_HOLD" || state === "FAULT";

    const hourTotal = 48;
    const hourNow =
      state === "RUNNING" || state === "WARM_HOLD" ? Math.max(0, Math.min(hourTotal, Math.floor(range(h, 7, 1, 48)))) : undefined;

    const profileName = state === "READY" || state === "STOPPED" ? "-" : "โปรไฟล์มาตรฐาน 48 ชม.";

    const startInText = state === "WAITING" ? `${Math.floor(range(h, 8, 0, 3))} ชั่วโมง ${Math.floor(range(h, 9, 0, 59))} นาที` : undefined;

    const etaText =
      state === "STOPPED" ? "-" : state === "READY" ? "-" : state === "WAITING" ? "12/02/2569 18.40 น." : "12/02/2569 18.40 น.";

    const lastUpdateText = `${Math.max(1, Math.floor(range(h, 10, 1, 9)))} นาทีที่แล้ว`;

    const alarmText = state === "FAULT" ? "อุณหภูมิสูงเกินกำหนด" : undefined;

    return {
      roomId: r.id, // สำคัญ: ให้ route ใช้ id จาก rooms.json
      roomName: r.roomName,
      roomNo: r.roomNo,
      factoryName: r.factoryName,

      state,
      tempC: Number(tempC.toFixed(1)),
      humRH: Number(humRH.toFixed(1)),
      furnanceOn,

      profileName,
      hourNow,
      hourTotal: hourNow != null ? hourTotal : undefined,
      startInText,
      etaText,

      lastUpdateText,
      alarmText,
    };
  });
});

export const getRoomSummaryById = cache(async (roomId: string): Promise<RoomSummary | undefined> => {
  const all = await getRoomSummariesMock();
  return all.find((x) => x.roomId === roomId);
});