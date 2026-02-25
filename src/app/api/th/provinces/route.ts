import { NextResponse } from "next/server";
import { getThaiAddressCache, uniqSortedTH } from "../_store";

export async function GET() {
  const db = await getThaiAddressCache();
  const provinces = uniqSortedTH(db.provinces.map((p) => p.name_th));
  return NextResponse.json({ provinces });
}