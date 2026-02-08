export type RoomState = "RUNNING" | "WARM_HOLD" | "READY" | "STOPPED" | "WAITING" | "FAULT";

export type RoomSummary = {
  roomId: string;
  roomName: string;
  roomNo: string;
  factoryName: string;

  state: RoomState;
  tempC: number;
  humRH: number;
  kilnOn: boolean;

  profileName?: string;
  hourNow?: number;
  hourTotal?: number;
  etaText?: string;

  lastUpdateText: string;
  alarmText?: string;
};
