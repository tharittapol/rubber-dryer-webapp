import { NextResponse } from "next/server";
import { getThaiAddressCache, uniqSortedTH } from "../_store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = (searchParams.get("province") ?? "").trim();
  const district = (searchParams.get("district") ?? "").trim();

  if (!province || !district) return NextResponse.json({ subdistricts: [] });

  const db = await getThaiAddressCache();
  const p = db.provinces.find((x) => x.name_th === province);
  if (!p) return NextResponse.json({ subdistricts: [] });

  const d = db.districts.find((x) => x.province_id === p.id && x.name_th === district);
  if (!d) return NextResponse.json({ subdistricts: [] });

  const subdistricts = uniqSortedTH(
    db.subdistricts.filter((s) => s.district_id === d.id).map((s) => s.name_th)
  );

  return NextResponse.json({ subdistricts });
}