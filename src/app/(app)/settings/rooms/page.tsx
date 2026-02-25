"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type RoomConfig = {
  id: string;
  roomName: string;
  roomNo: string;
  factoryName: string;
  plcIp: string;
  gatewayId: string;
};

type RoomsMock = {
  rooms: RoomConfig[];
  factories: string[];
};

type ModalKind = "none" | "create" | "edit" | "confirmSave" | "success" | "confirmDelete";

function CloseX() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function PencilIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", cls)} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function TrashIcon({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", cls)} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
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
        <div className="w-full max-w-[860px] rounded-lg border border-border bg-bg shadow-soft max-h-[calc(100vh-48px)] overflow-y-auto">
          <div className="px-8 pt-8 pb-4 border-b border-border flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title ? <div className="text-[32px] font-semibold leading-[120%]">{title}</div> : null}
              {subtitle ? (
                <div className="mt-2 text-[16px] text-muted leading-[140%] whitespace-pre-line">{subtitle}</div>
              ) : null}
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
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        className="h-10 w-full appearance-none rounded-sm border border-border bg-bg px-4 pr-10 text-[16px] leading-[140%] outline-none focus:border-blue focus:shadow-ringBlue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder ?? "เลือก..."}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

function normalizeIp(ip: string) {
  return ip.trim();
}

function isValidIPv4(ip: string) {
  const s = normalizeIp(ip);
  const parts = s.split(".");
  if (parts.length !== 4) return false;
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return false;
    const n = Number(p);
    if (n < 0 || n > 255) return false;
  }
  return true;
}

export default function RoomsSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [rooms, setRooms] = React.useState<RoomConfig[]>([]);
  const [factories, setFactories] = React.useState<string[]>([]);

  const [factoryFilter, setFactoryFilter] = React.useState<string>("");
  const [modal, setModal] = React.useState<ModalKind>("none");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // form state
  const [factoryName, setFactoryName] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const [roomNo, setRoomNo] = React.useState("");
  const [gatewayId, setGatewayId] = React.useState("");
  const [plcIp, setPlcIp] = React.useState("");

  const [formError, setFormError] = React.useState<string | null>(null);
  const [successText, setSuccessText] = React.useState<{ title: string; subtitle: string }>({
    title: "สำเร็จ",
    subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย",
  });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/mock/rooms.json", { cache: "no-store" });
        const json = (await res.json()) as RoomsMock;
        if (!mounted) return;
        setRooms(json.rooms ?? []);
        setFactories(json.factories ?? []);
      } catch {
        if (!mounted) return;
        setRooms([]);
        setFactories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function resetForm() {
    setFactoryName("");
    setRoomName("");
    setRoomNo("");
    setGatewayId("");
    setPlcIp("");
    setFormError(null);
  }

  function fillFormFromRoom(r: RoomConfig) {
    setFactoryName(r.factoryName ?? "");
    setRoomName(r.roomName ?? "");
    setRoomNo(r.roomNo ?? "");
    setGatewayId(r.gatewayId ?? "");
    setPlcIp(r.plcIp ?? "");
    setFormError(null);
  }

  function openCreate() {
    setActiveId(null);
    resetForm();
    setModal("create");
  }

  function openEdit(r: RoomConfig) {
    setActiveId(r.id);
    fillFormFromRoom(r);
    setModal("edit");
  }

  function openDelete(r: RoomConfig) {
    setActiveId(r.id);
    setModal("confirmDelete");
  }

  function validate(): string | null {
    if (!factoryName.trim()) return "กรุณาเลือกโรงงาน";
    if (!roomName.trim()) return "กรุณากรอกชื่อห้อง";
    if (!roomNo.trim()) return "กรุณากรอกเลขห้อง";
    if (!gatewayId.trim()) return "กรุณากรอก Gateway ID";
    if (!plcIp.trim()) return "กรุณากรอก PLC IP";

    if (!/^[0-9A-Za-z-]{1,12}$/.test(roomNo.trim())) return "เลขห้องควรเป็นตัวอักษร/ตัวเลข (ไม่เกิน 12 ตัวอักษร)";
    if (!/^[0-9A-Za-z-]{2,24}$/.test(gatewayId.trim())) return "Gateway ID ไม่ถูกต้อง";
    if (!isValidIPv4(plcIp)) return "รูปแบบ PLC IP ไม่ถูกต้อง (ตัวอย่าง: 192.168.1.10)";
    return null;
  }

  function goConfirmSave() {
    const err = validate();
    setFormError(err);
    if (!err) setModal("confirmSave");
  }

  function doSave() {
    const now = Date.now();
    const id = activeId ?? `room-${now}`;

    const payload: RoomConfig = {
      id,
      factoryName: factoryName.trim(),
      roomName: roomName.trim(),
      roomNo: roomNo.trim(),
      gatewayId: gatewayId.trim(),
      plcIp: normalizeIp(plcIp),
    };

    if (activeId) {
      setRooms((prev) => prev.map((r) => (r.id === activeId ? payload : r)));
      setSuccessText({ title: "บันทึกการแก้ไขสำเร็จแล้ว", subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย" });
    } else {
      setRooms((prev) => [payload, ...prev]);
      setSuccessText({ title: "สร้างห้องอบใหม่สำเร็จแล้ว", subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย" });
    }

    setModal("success");
  }

  function doDelete() {
    if (!activeId) return;
    setRooms((prev) => prev.filter((r) => r.id !== activeId));
    setSuccessText({ title: "ลบสำเร็จ", subtitle: "ข้อมูลถูกลบออกจากระบบเรียบร้อย" });
    setModal("success");
  }

  const shownRooms = rooms.filter((r) => (factoryFilter ? r.factoryName === factoryFilter : true));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-[40px] font-semibold leading-[120%]">ตั้งค่าห้องอบ</div>
          <div className="text-muted mt-2">จัดการห้องอบในระบบ</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="min-w-[240px]">
            <FieldLabel>โรงงาน</FieldLabel>
            <div className="mt-2">
              <Select value={factoryFilter} onChange={setFactoryFilter} options={factories} placeholder="ทุกโรงงาน" />
            </div>
          </div>

          <Button variant="success" className="h-[46px] rounded-sm" onClick={openCreate} type="button">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-sm border border-[color:rgba(255,255,255,0.35)]">
              +
            </span>
            สร้างห้องอบใหม่
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-bg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-[16px]">
            <thead className="bg-surface">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">ลำดับ</th>
                <th className="px-6 py-4 font-semibold">ชื่อห้อง</th>
                <th className="px-6 py-4 font-semibold">เลขห้อง</th>
                <th className="px-6 py-4 font-semibold">โรงงาน</th>
                <th className="px-6 py-4 font-semibold">PLC IP</th>
                <th className="px-6 py-4 font-semibold">Gateway ID</th>
                <th className="px-6 py-4 font-semibold text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-muted" colSpan={7}>
                    กำลังโหลด...
                  </td>
                </tr>
              ) : shownRooms.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-muted" colSpan={7}>
                    ไม่พบข้อมูลห้องอบ
                  </td>
                </tr>
              ) : (
                shownRooms.map((r, idx) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{r.roomName}</td>
                    <td className="px-6 py-4">{r.roomNo}</td>
                    <td className="px-6 py-4">{r.factoryName}</td>
                    <td className="px-6 py-4">{r.plcIp}</td>
                    <td className="px-6 py-4">{r.gatewayId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          className="h-10 w-10 grid place-items-center rounded-sm border border-transparent hover:bg-surface active:translate-y-[1px]"
                          onClick={() => openEdit(r)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          <PencilIcon cls="text-muted" />
                        </button>
                        <button
                          type="button"
                          className="h-10 w-10 grid place-items-center rounded-sm border border-transparent hover:bg-surface active:translate-y-[1px]"
                          onClick={() => openDelete(r)}
                          aria-label="Delete"
                          title="Delete"
                        >
                          <TrashIcon cls="text-red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "create" || modal === "edit") && (
        <ModalShell
          title={modal === "create" ? "สร้างห้องอบใหม่" : "แก้ไขห้องอบ"}
          subtitle={modal === "create" ? "กรอกข้อมูลห้องอบใหม่" : "แก้ไขข้อมูลห้องอบ"}
          onClose={() => setModal("none")}
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>โรงงาน</FieldLabel>
              <div className="mt-2">
                <Select value={factoryName} onChange={setFactoryName} options={factories} placeholder={modal === "create" ? "เลือกโรงงาน" : undefined} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>ชื่อห้อง</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น ห้องอบ A1" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                </div>
              </div>
              <div>
                <FieldLabel>เลขห้อง</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น 001" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} />
                </div>
              </div>

              <div>
                <FieldLabel>Gateway ID</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น GW-001" value={gatewayId} onChange={(e) => setGatewayId(e.target.value)} />
                </div>
              </div>
              <div>
                <FieldLabel>PLC IP</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น 192.168.1.10" value={plcIp} onChange={(e) => setPlcIp(e.target.value)} />
                </div>
              </div>
            </div>

            {formError ? <div className="text-red text-[14px]">{formError}</div> : null}

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button variant="secondary" className="w-full sm:w-[240px]" onClick={() => setModal("none")}>
                ยกเลิก
              </Button>
              <Button className="w-full sm:w-[240px]" onClick={goConfirmSave}>บันทึก</Button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal === "confirmSave" && (
        <ModalShell title="บันทึกการแก้ไข" subtitle="คุณต้องการบันทึกการใช่หรือไม่?" onClose={() => setModal("none")}>
          <div className="space-y-6">
            <div className="flex justify-center">
              <WarnIcon />
            </div>
            <div className="pt-2 flex items-center justify-between gap-3">
              <Button variant="secondary" className="w-full sm:w-[240px]" onClick={() => setModal(activeId ? "edit" : "create")}>
                ยกเลิก
              </Button>
              <Button className="w-full sm:w-[240px]" onClick={doSave}>ยืนยัน</Button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal === "confirmDelete" && (
        <ModalShell
          title="ยืนยันการลบ"
          subtitle={`การลบนี้จะถูกลบออกจากระบบอย่างถาวร\nไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่ว่าต้องการลบ?`}
          onClose={() => setModal("none")}
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <DangerIcon />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button variant="secondary" className="w-full sm:w-[240px]" onClick={() => setModal("none")}>
                ยกเลิก
              </Button>
              <Button variant="danger" className="w-full sm:w-[240px]" onClick={doDelete}>ยืนยัน</Button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal === "success" && (
        <ModalShell title="" onClose={() => setModal("none")}>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <SuccessIcon />
            </div>
            <div className="text-[28px] font-semibold leading-[120%] text-greenInk">{successText.title}</div>
            <div className="text-muted">{successText.subtitle}</div>
            <div className="pt-2">
              <Button variant="success" className="w-full" onClick={() => {
                  setModal("none");
                  setActiveId(null);
                }}>
                ตกลง
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}