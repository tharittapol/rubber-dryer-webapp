export type TempProfile = {
  id: string;
  name: string;
  holdTempC: number;
  hours: number;
  tempsC: number[];       // length = hours
  updatedAt: string;      // ISO string
};