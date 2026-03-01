// src/lib/mockRepo.server.ts
import "server-only";

import path from "node:path";
import { readFile } from "node:fs/promises";
import { cache } from "react";
import type { RoomState, RoomSummary } from "@/types/room";

type Factory = { id: string; name: string };
type FactoriesJson = { factories: Factory[] };

type RoomCfg = {
  id: string;
  roomName: string;
  roomNo: string;
  factoryId: string;
  plcIp?: string;
  gatewayId?: string;
};
type RoomsJson = { rooms: RoomCfg[] };

type ControlRow = {
  state: RoomState;
  tempC: number;
  humRH: number;
  furnanceOn: boolean;
  lastUpdateText: string;
};
type ControlJson = { roomControls: Record<string, ControlRow> };

const readJson = cache(async <T,>(rel: string): Promise<T> => {
  const full = path.join(process.cwd(), rel);
  const raw = await readFile(full, "utf8");
  return JSON.parse(raw) as T;
});

const getFactoriesJson = cache(async () => readJson<FactoriesJson>("public/mock/factories.json"));
const getRoomsJson = cache(async () => readJson<RoomsJson>("public/mock/rooms.json"));
const getControlJson = cache(async () => readJson<ControlJson>("public/mock/control.json"));

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function f01(h: number, salt: number) {
  const x = (h ^ (salt * 2654435761)) >>> 0;
  return (x % 1000) / 1000;
}

function deriveDashboardFields(roomId: string, state: RoomState) {
  const h = hash32(roomId);

  // profileName/hourNow/startInText/etaText/alarmText เป็น “derived mock” เพื่อให้ UI ใช้ได้เหมือนเดิม
  const profileName = state === "READY" || state === "STOPPED" ? "-" : "โปรไฟล์มาตรฐาน 48 ชม.";

    // --- hours ---
    let hourTotal: number | undefined;
    let hourNow: number | undefined;

    if (state === "WARM_HOLD") {
        // อบเสร็จแล้ว อุ่นทิ้งไว้
        hourTotal = 48;
        hourNow = 48;
    } else if (state === "RUNNING") {
        hourTotal = 48;
        hourNow = Math.max(0, Math.min(48, Math.floor(1 + f01(h, 7) * 47)));
    } else {
        hourTotal = undefined;
        hourNow = undefined;
    }

  const startInText =
    state === "WAITING"
      ? `${Math.floor(f01(h, 8) * 2) + 1} ชั่วโมง ${Math.floor(f01(h, 9) * 59)} นาที`
      : undefined;

  const etaText =
    state === "WARM_HOLD"
      ? "การอบเสร็จสิ้น"
      : state === "READY" || state === "STOPPED"
        ? "-"
        : state === "FAULT"
          ? "-"
          : "12/03/2569 16.00 น.";

  const alarmText = state === "FAULT" ? "อุณหภูมิสูงเกินกำหนด" : undefined;

  return { profileName, hourNow, hourTotal, startInText, etaText, alarmText };
}

export const getDashboardData = cache(async () => {
  const [facJson, roomsJson, ctlJson] = await Promise.all([
    getFactoriesJson(),
    getRoomsJson(),
    getControlJson(),
  ]);

  const facNameById = new Map(facJson.factories.map((f) => [f.id, f.name] as const));

  const rooms: RoomSummary[] = roomsJson.rooms.map((r) => {
    const c = ctlJson.roomControls?.[r.id];

    const state: RoomState = c?.state ?? "STOPPED";
    const derived = deriveDashboardFields(r.id, state);

    return {
      roomId: r.id,
      roomName: r.roomName,
      roomNo: r.roomNo,
      factoryName: facNameById.get(r.factoryId) ?? "-",

      state,
      tempC: c?.tempC ?? 0,
      humRH: c?.humRH ?? 0,
      furnanceOn: c?.furnanceOn ?? false,
      lastUpdateText: c?.lastUpdateText ?? "-",

      // fields ที่ RoomCard ใช้อยู่เดิม
      profileName: derived.profileName,
      hourNow: derived.hourNow,
      hourTotal: derived.hourTotal,
      startInText: derived.startInText,
      etaText: derived.etaText,
      alarmText: derived.alarmText,
    } as RoomSummary;
  });

  const factories = facJson.factories.map((f) => f.name).filter(Boolean);

  return { rooms, factories };
});

export const getRoomDetailData = cache(async (roomId: string) => {
  const { rooms } = await getDashboardData();
  return rooms.find((r) => r.roomId === roomId) ?? null;
});