"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type Factory = {
  id: string;
  name: string;
  addressLine: string;
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  roomsCount: number;
  note?: string;
  updatedAt: string; // ISO
};

type FactoriesMock = { factories: Factory[] };

type ModalKind = "none" | "create" | "edit" | "confirmSave" | "confirmDelete" | "success";

function formatThaiDate(iso: string) {
  try {
    const d = new Date(iso);
    const m = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const day = d.getDate();
    const month = m[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return iso;
  }
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E3E3E3]">{children}</span>;
}

function FactoryGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 21V9l6 3V9l6 3V9l6 3v9H4Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
      <path d="M12 10a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M6 10v11h12V10" />
    </svg>
  );
}
function PencilIcon({ cls }: { cls?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", cls)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function TrashIcon({ cls }: { cls?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", cls)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function CloseX() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <div className="h-14 w-14 rounded-full bg-[color:rgba(20,174,92,0.15)] grid place-items-center">
      <div className="h-10 w-10 rounded-full bg-greenInk grid place-items-center text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
    </div>
  );
}

function WarnIcon() {
  return (
    <div className="h-14 w-14 rounded-full bg-[color:rgba(0,0,0,0.06)] grid place-items-center">
      <div className="h-10 w-10 rounded-full border border-border grid place-items-center text-muted">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>
    </div>
  );
}

function DangerIcon() {
  return (
    <div className="h-14 w-14 rounded-full bg-[color:rgba(236,34,31,0.15)] grid place-items-center">
      <div className="h-10 w-10 rounded-full bg-red grid place-items-center text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
    </div>
  );
}

/**
 * ✅ Responsive + scrollable modal:
 * - overlay scrolls (overflow-y-auto)
 * - dialog has max-height and internal scroll
 */
function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={onClose} />

      <div className="relative min-h-full w-full px-4 py-6 sm:py-10 flex items-start sm:items-center justify-center">
        <div className="w-full max-w-[720px] rounded-lg border border-border bg-bg shadow-soft max-h-[calc(100vh-48px)] overflow-y-auto">
          <div className="px-8 pt-8 pb-4 border-b border-border flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title ? <div className="text-[24px] font-semibold leading-[120%]">{title}</div> : null}
              {subtitle && <div className="mt-2 text-[16px] text-muted leading-[140%]">{subtitle}</div>}
            </div>
            <button
              className="h-10 w-10 rounded-full border border-border bg-bg hover:bg-surface grid place-items-center"
              onClick={onClose}
              aria-label="Close"
              title="Close"
              type="button"
            >
              <CloseX />
            </button>
          </div>

          <div className="px-8 py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[14px] text-muted leading-[140%]">{children}</div>;
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-border bg-bg px-4 pr-10 rd-sub16 outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]",
          disabled && "opacity-60 pointer-events-none"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder ?? "เลือก..."}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()) as T;
}

export default function FactoriesPage() {
  const [loading, setLoading] = React.useState(true);
  const [factories, setFactories] = React.useState<Factory[]>([]);
  const [modal, setModal] = React.useState<ModalKind>("none");

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const active = factories.find((f) => f.id === activeId) ?? null;

  // form state
  const [name, setName] = React.useState("");
  const [addr, setAddr] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [subdistrict, setSubdistrict] = React.useState("");
  const [postcode, setPostcode] = React.useState("");
  const [postcodeTouched, setPostcodeTouched] = React.useState(false);
  const [note, setNote] = React.useState("");

  const [successText, setSuccessText] = React.useState<{ title: string; subtitle: string }>({
    title: "สำเร็จ",
    subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย",
  });

  const [formError, setFormError] = React.useState<string | null>(null);

  // ✅ TH address dropdown (real)
  const [addrLoading, setAddrLoading] = React.useState(false);
  const [provinceOpts, setProvinceOpts] = React.useState<string[]>([]);
  const [districtOpts, setDistrictOpts] = React.useState<string[]>([]);
  const [subdistrictOpts, setSubdistrictOpts] = React.useState<string[]>([]);
  const [addrBootstrapped, setAddrBootstrapped] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/mock/factories.json", { cache: "no-store" });
        const json = (await res.json()) as FactoriesMock;
        if (mounted) setFactories(json.factories ?? []);
      } catch {
        if (mounted) setFactories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function resetForm() {
    setName("");
    setAddr("");
    setProvince("");
    setDistrict("");
    setSubdistrict("");
    setPostcode("");
    setNote("");

    setDistrictOpts([]);
    setSubdistrictOpts([]);
    setAddrBootstrapped(false);
    setFormError(null);
    setPostcodeTouched(false);
  }

  function fillFormFromFactory(f: Factory) {
    setName(f.name ?? "");
    setAddr(f.addressLine ?? "");
    setProvince(f.province ?? "");
    setDistrict(f.district ?? "");
    setSubdistrict(f.subdistrict ?? "");
    setPostcode(f.postcode ?? "");
    setPostcodeTouched(true);
    setNote(f.note ?? "");

    setFormError(null);
  }

  function openCreate() {
    setActiveId(null);
    resetForm();
    setModal("create");
  }

  function openEdit(f: Factory) {
    setActiveId(f.id);
    fillFormFromFactory(f);
    setAddrBootstrapped(false);
    setModal("edit");
  }

  function openDelete(f: Factory) {
    setActiveId(f.id);
    setModal("confirmDelete");
  }

  function validate(): string | null {
    if (!name.trim()) return "กรุณากรอกชื่อโรงงาน";
    if (!addr.trim()) return "กรุณากรอกที่อยู่";
    if (!province.trim()) return "กรุณาเลือกจังหวัด";
    if (!district.trim()) return "กรุณาเลือกอำเภอ";
    if (!subdistrict.trim()) return "กรุณาเลือกตำบล";
    if (postcode && !/^\d{5}$/.test(postcode.trim())) return "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    return null;
  }

  function goConfirmSave() {
    const err = validate();
    setFormError(err);
    if (!err) setModal("confirmSave");
  }

  function doSave() {
    const nowIso = new Date().toISOString();

    if (activeId) {
      setFactories((prev) =>
        prev.map((f) =>
          f.id === activeId
            ? {
                ...f,
                name,
                addressLine: addr,
                province,
                district,
                subdistrict,
                postcode,
                note,
                updatedAt: nowIso,
              }
            : f
        )
      );
      setSuccessText({ title: "บันทึกการแก้ไขสำเร็จแล้ว", subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย" });
    } else {
      const id = `fac-${Math.random().toString(16).slice(2)}`;
      setFactories((prev) => [
        {
          id,
          name,
          addressLine: addr,
          province,
          district,
          subdistrict,
          postcode,
          roomsCount: 0,
          note,
          updatedAt: nowIso,
        },
        ...prev,
      ]);
      setSuccessText({ title: "เพิ่มโรงงานใหม่สำเร็จแล้ว", subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย" });
    }

    setModal("success");
  }

  function doDelete() {
    if (!activeId) return;
    setFactories((prev) => prev.filter((f) => f.id !== activeId));
    setSuccessText({ title: "ลบสำเร็จ", subtitle: "ข้อมูลถูกลบออกจากระบบเรียบร้อย" });
    setModal("success");
  }

  // =========================
  // ✅ TH address API chain
  // =========================

  // Load provinces when opening create/edit modal
  React.useEffect(() => {
    if (!(modal === "create" || modal === "edit")) return;

    let alive = true;
    (async () => {
      try {
        setAddrLoading(true);
        const json = await apiGet<{ provinces: string[] }>("/api/th/provinces");
        if (!alive) return;
        setProvinceOpts(json.provinces ?? []);
      } catch {
        if (!alive) return;
        setProvinceOpts([]);
      } finally {
        if (alive) setAddrLoading(false);
      }
    })();

    // allow edit bootstrap to run once
    setAddrBootstrapped(false);

    return () => {
      alive = false;
    };
  }, [modal]);

  // Province change -> fetch districts + reset downstream
  React.useEffect(() => {
    if (!(modal === "create" || modal === "edit")) return;

    let alive = true;
    (async () => {
      if (!province) {
        setDistrictOpts([]);
        setSubdistrictOpts([]);
        return;
      }

      try {
        setAddrLoading(true);

        // user-driven change -> reset
        setDistrict("");
        setSubdistrict("");
        setPostcode("");
        setPostcodeTouched(false);

        const json = await apiGet<{ districts: string[] }>(
          `/api/th/districts?province=${encodeURIComponent(province)}`
        );
        if (!alive) return;

        setDistrictOpts(json.districts ?? []);
        setSubdistrictOpts([]);
      } catch {
        if (!alive) return;
        setDistrictOpts([]);
        setSubdistrictOpts([]);
      } finally {
        if (alive) setAddrLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province]);

  // District change -> fetch subdistricts + reset downstream
  React.useEffect(() => {
    if (!(modal === "create" || modal === "edit")) return;

    let alive = true;
    (async () => {
      if (!province || !district) {
        setSubdistrictOpts([]);
        return;
      }

      try {
        setAddrLoading(true);

        setSubdistrict("");
        setPostcode("");
        setPostcodeTouched(false);

        const json = await apiGet<{ subdistricts: string[] }>(
          `/api/th/subdistricts?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`
        );
        if (!alive) return;
        setSubdistrictOpts(json.subdistricts ?? []);
      } catch {
        if (!alive) return;
        setSubdistrictOpts([]);
      } finally {
        if (alive) setAddrLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  // Subdistrict change -> fetch postcode
  React.useEffect(() => {
    if (!(modal === "create" || modal === "edit")) return;

    let alive = true;

    (async () => {
      if (!province || !district || !subdistrict) return;

      // ถ้าผู้ใช้พิมพ์เอง “หลังจากเลือกตำบลแล้ว” ค่อยไม่ทับ
      if (postcodeTouched) return;

      try {
        setAddrLoading(true);

        const json = await apiGet<{ postcode: string }>(
          `/api/th/postcode?province=${encodeURIComponent(province.trim())}&district=${encodeURIComponent(
            district.trim()
          )}&subdistrict=${encodeURIComponent(subdistrict.trim())}`
        );

        if (!alive) return;

        const pc = String((json as any).postcode ?? "").trim();
        setPostcode(pc);
      } catch {
        if (!alive) return;
        setPostcode("");
      } finally {
        if (alive) setAddrLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [province, district, subdistrict, modal, postcodeTouched]);

  // Edit bootstrap: preload district/subdistrict options + postcode based on existing values
  React.useEffect(() => {
    if (modal !== "edit") return;
    if (addrBootstrapped) return;
    if (!province) return;

    let alive = true;
    (async () => {
      try {
        setAddrLoading(true);

        // 1) districts
        const d1 = await apiGet<{ districts: string[] }>(
          `/api/th/districts?province=${encodeURIComponent(province)}`
        );
        if (!alive) return;
        setDistrictOpts(d1.districts ?? []);

        // 2) subdistricts (if district exists)
        if (district) {
          const s1 = await apiGet<{ subdistricts: string[] }>(
            `/api/th/subdistricts?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`
          );
          if (!alive) return;
          setSubdistrictOpts(s1.subdistricts ?? []);
        }

        // 3) postcode (if subdistrict exists)
        if (district && subdistrict) {
          const p1 = await apiGet<{ postcode: string }>(
            `/api/th/postcode?province=${encodeURIComponent(province)}&district=${encodeURIComponent(
              district
            )}&subdistrict=${encodeURIComponent(subdistrict)}`
          );
          if (!alive) return;
          setPostcode((p1.postcode ?? "").trim());
        }

        if (!alive) return;
        setAddrBootstrapped(true);
      } catch {
        if (!alive) return;
        setDistrictOpts([]);
        setSubdistrictOpts([]);
        setAddrBootstrapped(true);
      } finally {
        if (alive) setAddrLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [modal, province, district, subdistrict, addrBootstrapped]);

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-[32px] font-semibold leading-[120%]">ตั้งค่าโรงงาน</div>
            <div className="mt-2 text-[20px] text-muted leading-[120%]">การตั้งค่าโรงงาน</div>
          </div>

          <Button variant="primary" className="h-10 px-4 rounded-md" onClick={openCreate}>
            + สร้างโรงงานใหม่
          </Button>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-muted">กำลังโหลด...</div>
          ) : factories.length === 0 ? (
            <div className="text-muted">ยังไม่มีโรงงาน</div>
          ) : (
            factories.map((f) => (
              <div key={f.id} className="rounded-2xl border border-border bg-bg p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <IconWrap>
                      <FactoryGlyph />
                    </IconWrap>

                    <div className="min-w-0">
                      <div className="text-[24px] font-semibold leading-[120%] truncate">{f.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="h-10 w-10 rounded-md border border-transparent hover:bg-surface grid place-items-center"
                      onClick={() => openEdit(f)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      className="h-10 w-10 rounded-md border border-transparent hover:bg-surface grid place-items-center"
                      onClick={() => openDelete(f)}
                      aria-label="Delete"
                      title="Delete"
                    >
                      <TrashIcon cls="text-red" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-[16px] leading-[140%]">
                  <div className="flex items-start gap-3 text-ink">
                    <span className="mt-[2px] text-muted">
                      <PinIcon />
                    </span>
                    <div className="text-ink">
                      <div className="text-ink">
                        {f.addressLine}
                        {f.subdistrict ? ` ต.${f.subdistrict}` : ""}
                        {f.district ? ` อ.${f.district}` : ""}
                        {f.province ? ` จ.${f.province}` : ""}
                        {f.postcode ? ` ${f.postcode}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted">
                      <HomeIcon />
                    </span>
                    <div>{f.roomsCount} ห้องอบ</div>
                  </div>

                  <div className="text-muted">อัปเดตล่าสุด {formatThaiDate(f.updatedAt)}</div>

                  <div className="italic text-muted">{f.note ?? "Text Emphasis"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {(modal === "create" || modal === "edit") && (
        <ModalShell
          title={modal === "create" ? "สร้างโรงงานใหม่" : "แก้ไขโรงงาน"}
          subtitle={modal === "create" ? "กรอกข้อมูลโรงงานใหม่" : "แก้ไขข้อมูลโรงงาน"}
          onClose={() => setModal("none")}
        >
          <div className="space-y-5">
            {formError && (
              <div className="rounded-md border border-red bg-[color:rgba(236,34,31,0.08)] p-3 text-red">{formError}</div>
            )}

            <div className="space-y-2">
              <FieldLabel>ชื่อโรงงาน</FieldLabel>
              <Input placeholder="เช่น โรงงานเชียงใหม่" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <FieldLabel>ที่อยู่</FieldLabel>
              <Input placeholder="123 หมู่ 4" value={addr} onChange={(e) => setAddr(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel>จังหวัด</FieldLabel>
                <Select
                  value={province}
                  onChange={setProvince}
                  options={provinceOpts}
                  placeholder="เลือกจังหวัด"
                  disabled={addrLoading}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>อำเภอ</FieldLabel>
                <Select
                  value={district}
                  onChange={setDistrict}
                  options={districtOpts}
                  placeholder="เลือกอำเภอ"
                  disabled={addrLoading || !province}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel>ตำบล</FieldLabel>
                <Select
                  value={subdistrict}
                  onChange={(v) => {
                    setPostcodeTouched(false);
                    setPostcode("");
                    setSubdistrict(v);
                  }}
                  options={subdistrictOpts}
                  placeholder="เลือกตำบล"
                  disabled={addrLoading || !province || !district}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>รหัสไปรษณีย์</FieldLabel>
                <Input
                  placeholder="10000"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value);
                    setPostcodeTouched(true);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel>หมายเหตุ</FieldLabel>
              <textarea
                className="w-full min-h-[92px] rounded-md border border-border bg-bg px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
                placeholder="โรงงานหลัก"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Footer actions (responsive) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-0">
              <button
                type="button"
                className="justify-self-center text-[16px] text-ink hover:underline"
                onClick={() => setModal("none")}
              >
                ยกเลิก
              </button>

              <Button
                variant="primary"
                className="h-12 w-full sm:w-[320px] justify-self-stretch sm:justify-self-end rounded-md bg-ink text-white"
                onClick={goConfirmSave}
              >
                บันทึก
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Confirm Save */}
      {modal === "confirmSave" && (
        <ModalShell title="บันทึกการแก้ไข" subtitle="คุณต้องการบันทึกการนี้หรือไม่?" onClose={() => setModal("none")}>
          <div className="grid place-items-center text-center gap-4 py-6">
            <WarnIcon />
            <div>
              <div className="text-[24px] font-semibold leading-[120%]">บันทึกการแก้ไข</div>
              <div className="mt-2 text-[16px] text-muted">คุณต้องการบันทึกการนี้หรือไม่?</div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-0">
              <button
                type="button"
                className="justify-self-center text-[16px] text-ink hover:underline"
                onClick={() => setModal("none")}
              >
                ยกเลิก
              </button>

              <Button
                variant="primary"
                className="justify-self-stretch sm:justify-self-end h-12 w-full sm:w-[320px] rounded-md bg-ink text-white"
                onClick={doSave}
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Confirm Delete */}
      {modal === "confirmDelete" && (
        <ModalShell
          title="ยืนยันการลบ"
          subtitle="การลบนี้จะถูกลบออกจากระบบอย่างถาวร ไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่ว่าต้องการลบ?"
          onClose={() => setModal("none")}
        >
          <div className="grid place-items-center text-center gap-4 py-6">
            <DangerIcon />
            <div>
              <div className="text-[24px] font-semibold leading-[120%] text-red">ยืนยันการลบ</div>
              <div className="mt-2 text-[16px] text-red">
                การลบนี้จะถูกลบออกจากระบบอย่างถาวร ไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่ว่าต้องการลบ?
              </div>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
              <Button variant="ghost" className="h-12 w-full sm:w-[220px] border border-border" onClick={() => setModal("none")}>
                ยกเลิก
              </Button>
              <Button variant="danger" className="h-12 w-full sm:w-[220px]" onClick={doDelete}>
                ลบโรงงาน
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Success */}
      {modal === "success" && (
        <ModalShell title="" onClose={() => setModal("none")}>
          <div className="grid place-items-center text-center gap-4 py-8">
            <SuccessIcon />
            <div>
              <div className="text-[24px] font-semibold leading-[120%] text-greenInk">{successText.title}</div>
              <div className="mt-2 text-[16px] text-muted">{successText.subtitle}</div>
            </div>

            <Button variant="primary" className="h-12 w-full max-w-[520px]" onClick={() => setModal("none")}>
              ตกลง
            </Button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}