import { NextResponse } from "next/server";
import { getThaiAddressCache, uniqSortedTH } from "../_store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = (searchParams.get("province") ?? "").trim();

  if (!province) return NextResponse.json({ districts: [] });

  const db = await getThaiAddressCache();
  const p = db.provinces.find((x) => x.name_th === province);
  if (!p) return NextResponse.json({ districts: [] });

  const districts = uniqSortedTH(
    db.districts.filter((d) => d.province_id === p.id).map((d) => d.name_th)
  );

  return NextResponse.json({ districts });
}