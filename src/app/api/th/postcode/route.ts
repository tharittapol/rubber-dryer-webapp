import { NextResponse } from "next/server";
import { getThaiAddressCache } from "../_store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = (searchParams.get("province") ?? "").trim();
  const district = (searchParams.get("district") ?? "").trim();
  const subdistrict = (searchParams.get("subdistrict") ?? "").trim();

  if (!province || !district || !subdistrict) return NextResponse.json({ postcode: "" });

  const db = await getThaiAddressCache();
  const p = db.provinces.find((x) => x.name_th === province);
  if (!p) return NextResponse.json({ postcode: "" });

  const d = db.districts.find((x) => x.province_id === p.id && x.name_th === district);
  if (!d) return NextResponse.json({ postcode: "" });

  const s = db.subdistricts.find((x) => x.district_id === d.id && x.name_th === subdistrict);
  return NextResponse.json({ postcode: String(s?.zip_code ?? "") });
}