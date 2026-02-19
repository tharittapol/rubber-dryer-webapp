import type { RoomState } from "@/types/room";

export type ControlRoom = {
  roomId: string;
  roomName: string;
  roomNo: string;
  factoryId: string;
  factoryName: string;
  state: RoomState;
  tempC?: number | null;
  humRH?: number | null;
  furnanceOn?: boolean | null;
  lastUpdateText?: string | null;
};

export type ControlFactory = {
  factoryId: string;
  factoryName: string;
};

export type ControlProfile = {
  profileId: string;
  profileName: string;
  totalHours: number;
  description?: string;
};

export type ControlActionId = "START" | "STOP" | "RESET";

export type ControlAction = {
  id: ControlActionId;
  title: string;
  desc: string;
  tone: "green" | "orange" | "red" | "gray";
};

export type ControlMockData = {
  factories: ControlFactory[];
  rooms: ControlRoom[];
  profiles: ControlProfile[];
};
