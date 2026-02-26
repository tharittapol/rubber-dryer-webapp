"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type Role = "ADMIN" | "USER" | "VIEWER";

type UserRow = {
  id: string;
  fullName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  lineId: string;
  role: Role;
  factories: string[]; // แสดงเป็น "โรงงานเชียงใหม่, โรงงานลำปาง, ..."
};

type UsersMock = {
  users: UserRow[];
  factories: string[];
};

type ModalKind = "none" | "create" | "edit" | "confirmSave" | "confirmDelete" | "success";

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
        className="h-[46px] w-full appearance-none rounded-sm border border-border bg-bg px-4 pr-10 text-[16px] leading-[140%] outline-none focus:border-blue focus:shadow-ringBlue"
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

function MultiSelectDropdown({
  labelPlaceholder,
  options,
  value,
  onChange,
}: {
  labelPlaceholder: string; // เช่น "เลือกโรงงาน"
  options: string[];
  value: string[]; // รายการที่เลือก
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const label =
    value.length === 0
      ? labelPlaceholder
      : value.length <= 2
      ? value.join(", ")
      : `${value[0]}, ${value[1]} +${value.length - 2}`;

  function toggle(opt: string) {
    const has = value.includes(opt);
    const next = has ? value.filter((x) => x !== opt) : [...value, opt];
    onChange(next);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger - looks like dropdown */}
      <button
        type="button"
        className={cn(
          "h-[46px] w-full rounded-sm border border-border bg-bg px-4 pr-10 text-left text-[16px] leading-[140%] outline-none",
          "focus:border-blue focus:shadow-ringBlue",
          value.length === 0 ? "text-muted" : "text-text"
        )}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="block truncate">{label}</span>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-bg shadow-soft overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <div className="text-[14px] text-muted">เลือกได้หลายโรงงาน</div>
            <button type="button" className="text-[14px] text-muted hover:text-text" onClick={clearAll}>
              ล้าง
            </button>
          </div>

          <div className="max-h-[240px] overflow-y-auto py-2">
            {options.map((opt) => {
              const checked = value.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={checked}
                    onChange={() => toggle(opt)}
                  />
                  <span className="text-[16px]">{opt}</span>
                </label>
              );
            })}
            {options.length === 0 ? (
              <div className="px-4 py-3 text-muted">ยังไม่มีรายการโรงงาน</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

/** ===== Modal: Form (เพิ่ม/แก้ไข) ===== */
function FormModalShell({
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
        <div className="w-full max-w-[980px] rounded-lg border border-border bg-bg shadow-soft max-h-[calc(100vh-48px)] overflow-y-auto">
          <div className="px-8 pt-8 pb-4 border-b border-border flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[36px] font-semibold leading-[120%]">{title}</div>
              {subtitle ? <div className="mt-2 text-[16px] text-muted leading-[140%]">{subtitle}</div> : null}
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

/** ===== Modal: Confirm/Success (ตามดีไซน์วงกลม+ปุ่มใหญ่) ===== */
function ConfirmModalShell({
  title,
  subtitle,
  onClose,
  icon,
  tone = "default",
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  icon: React.ReactNode;
  tone?: "default" | "danger" | "success";
  children: React.ReactNode;
}) {
  const titleCls = tone === "danger" ? "text-red" : tone === "success" ? "text-greenInk" : "text-text";
  const subCls = tone === "danger" ? "text-red" : "text-muted";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={onClose} />
      <div className="relative h-full w-full px-4 py-6 sm:py-10 flex items-center justify-center">
        <div className="w-full max-w-[980px] rounded-[24px] bg-bg shadow-soft">
          <div className="relative px-8 sm:px-14 pt-10 sm:pt-14 pb-10 sm:pb-12">
            <button
              className="absolute right-6 top-6 h-12 w-12 rounded-full border border-border bg-bg hover:bg-surface grid place-items-center"
              onClick={onClose}
              aria-label="Close"
              title="Close"
              type="button"
            >
              <CloseX />
            </button>

            <div className="flex justify-center">{icon}</div>

            <div className="mt-6 text-center">
              <div className={cn("text-[40px] font-semibold leading-[120%]", titleCls)}>{title}</div>
              {subtitle ? <div className={cn("mt-3 text-[18px] whitespace-pre-line", subCls)}>{subtitle}</div> : null}
            </div>

            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmWarnIcon() {
  return (
    <div className="grid place-items-center">
      <div className="h-[84px] w-[84px] rounded-full bg-[color:rgba(0,0,0,0.06)] grid place-items-center">
        <div className="h-[64px] w-[64px] rounded-full border-2 border-[color:rgba(0,0,0,0.35)] grid place-items-center">
          <span className="text-[28px] font-bold text-text">!</span>
        </div>
      </div>
    </div>
  );
}

function ConfirmDangerIcon() {
  return (
    <div className="grid place-items-center">
      <div className="h-[84px] w-[84px] rounded-full bg-[color:rgba(236,34,31,0.18)] grid place-items-center">
        <div className="h-[64px] w-[64px] rounded-full bg-red grid place-items-center">
          <div className="h-[42px] w-[42px] rounded-full border-[3px] border-white grid place-items-center">
            <span className="text-[22px] font-extrabold text-white leading-none">!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmSuccessIcon() {
  return (
    <div className="grid place-items-center">
      <div className="h-[84px] w-[84px] rounded-full bg-[color:rgba(20,174,92,0.18)] grid place-items-center">
        <div className="h-[64px] w-[64px] rounded-full bg-greenInk grid place-items-center">
          <div className="h-[42px] w-[42px] rounded-full border-[3px] border-white grid place-items-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function roleLabel(role: Role) {
  if (role === "ADMIN") return "ผู้ดูแลระบบ";
  if (role === "USER") return "ผู้ใช้งาน";
  return "ผู้ชม";
}

function RoleBadge({ role }: { role: Role }) {
  const cls =
    role === "ADMIN"
      ? "bg-[color:rgba(56,120,255,0.16)] text-blue"
      : role === "USER"
      ? "bg-[color:rgba(20,174,92,0.16)] text-greenInk"
      : "bg-surface text-muted";
  return <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[14px] font-semibold", cls)}>{roleLabel(role)}</span>;
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function isValidPhone(s: string) {
  const t = s.trim();
  // specific integer 9-10 digit
  return /^\d{9,10}$/.test(t);
}

export default function UsersSettingsPage() {
  const [loading, setLoading] = React.useState(true);

  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [factories, setFactories] = React.useState<string[]>([]);

  const [roleFilter, setRoleFilter] = React.useState<Role | "">("");
  const [modal, setModal] = React.useState<ModalKind>("none");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // form state
  const [username, setUsername] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [lineId, setLineId] = React.useState("");
  const [factoryPick, setFactoryPick] = React.useState<string[]>([]);
  const [rolePick, setRolePick] = React.useState<Role | "">("");

  const [formError, setFormError] = React.useState<string | null>(null);

  const [successText, setSuccessText] = React.useState<{ title: string; subtitle: string }>({
    title: "เพิ่มผู้ใช้งานใหม่สำเร็จแล้ว",
    subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย",
  });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/mock/users.json", { cache: "no-store" });
        const json = (await res.json()) as UsersMock;
        if (!mounted) return;
        setUsers(json.users ?? []);
        setFactories(json.factories ?? []);
      } catch {
        if (!mounted) return;
        setUsers([]);
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
    setUsername("");
    setFullName("");
    setPassword("");
    setEmail("");
    setPhone("");
    setLineId("");
    setFactoryPick([]);
    setRolePick("");
    setFormError(null);
  }

  function fillFormFromUser(u: UserRow) {
    setUsername(u.username ?? "");
    setFullName(u.fullName ?? "");
    setPassword(u.password ?? "");
    setEmail(u.email ?? "");
    setPhone(u.phone ?? "");
    setLineId(u.lineId ?? "");
    setFactoryPick(u.factories ?? []);
    setRolePick(u.role ?? "USER");
    setFormError(null);
  }

  function openCreate() {
    setActiveId(null);
    resetForm();
    setModal("create");
  }

  function openEdit(u: UserRow) {
    setActiveId(u.id);
    fillFormFromUser(u);
    setModal("edit");
  }

  function openDelete(u: UserRow) {
    setActiveId(u.id);
    setModal("confirmDelete");
  }

  function validate(): string | null {
    if (!username.trim()) return "กรุณากรอกชื่อผู้ใช้";
    if (!fullName.trim()) return "กรุณากรอกชื่อ - นามสกุล";
    if (!password.trim()) return "กรุณากรอกรหัสผ่าน";
    if (!email.trim()) return "กรุณากรอกอีเมล";
    if (!phone.trim()) return "กรุณากรอกเบอร์โทร";
    if (factoryPick.length === 0) return "กรุณาเลือกโรงงานอย่างน้อย 1 โรงงาน";
    if (!rolePick) return "กรุณาเลือกบทบาท";

    if (!/^[a-zA-Z0-9._-]{3,20}$/.test(username.trim())) return "ชื่อผู้ใช้ควรเป็น a-z, 0-9, . _ - (3–20 ตัว)";
    if (password.trim().length < 6) return "รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร";
    if (!isValidEmail(email)) return "รูปแบบอีเมลไม่ถูกต้อง";
    if (!isValidPhone(phone)) return "รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 0812345678)";
    return null;
  }

  // ✅ Create: save ทันที -> success
  // ✅ Edit: confirm ก่อน
  function onSaveClick() {
    const err = validate();
    setFormError(err);
    if (err) return;

    if (!activeId) {
      doSave();
      return;
    }
    setModal("confirmSave");
  }

  function doSave() {
    const id = activeId ?? `user-${Date.now()}`;
    const payload: UserRow = {
      id,
      username: username.trim(),
      fullName: fullName.trim(),
      password: password.trim(),
      email: email.trim(),
      phone: phone.trim(),
      lineId: lineId.trim(),
      role: (rolePick as Role) ?? "USER",
      factories: factoryPick,
    };

    if (activeId) {
      setUsers((prev) => prev.map((u) => (u.id === activeId ? payload : u)));
      setSuccessText({ title: "บันทึกการแก้ไขสำเร็จแล้ว", subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย" });
    } else {
      setUsers((prev) => [payload, ...prev]);
      setSuccessText({ title: "เพิ่มผู้ใช้งานใหม่สำเร็จแล้ว", subtitle: "ข้อมูลได้รับการอัปเดตเรียบร้อย" });
    }

    setModal("success");
  }

  function doDelete() {
    if (!activeId) return;
    setUsers((prev) => prev.filter((u) => u.id !== activeId));
    setSuccessText({ title: "ลบสำเร็จ", subtitle: "ข้อมูลถูกลบออกจากระบบเรียบร้อย" });
    setModal("success");
  }

  const shownUsers = users.filter((u) => (roleFilter ? u.role === roleFilter : true));

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-[40px] font-semibold leading-[120%]">ตั้งค่าผู้ใช้งาน</div>
          <div className="text-muted mt-2">จัดการผู้ใช้งานในระบบ</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="min-w-[240px]">
            <FieldLabel>บทบาท</FieldLabel>
            <div className="mt-2">
              <div className="relative">
                <select
                  className="h-[46px] w-full appearance-none rounded-sm border border-border bg-bg px-4 pr-10 text-[16px] leading-[140%] outline-none focus:border-blue focus:shadow-ringBlue"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter((e.target.value as Role) || "")}
                >
                  <option value="">ทุกบทบาท</option>
                  <option value="ADMIN">ผู้ดูแลระบบ</option>
                  <option value="USER">ผู้ใช้งาน</option>
                  <option value="VIEWER">ผู้ชม</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <Button variant="success" className="h-[46px] rounded-sm" onClick={openCreate} type="button">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-sm border border-greenInk">
              +
            </span>
            เพิ่มผู้ใช้งาน
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="rounded-lg border border-border bg-bg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-[16px]">
            <thead className="bg-surface">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-semibold">ชื่อผู้ใช้</th>
                <th className="px-6 py-4 font-semibold">รหัสผ่าน</th>
                <th className="px-6 py-4 font-semibold">อีเมล</th>
                <th className="px-6 py-4 font-semibold">เบอร์โทร</th>
                <th className="px-6 py-4 font-semibold">Line ID</th>
                <th className="px-6 py-4 font-semibold">บทบาท</th>
                <th className="px-6 py-4 font-semibold">โรงงาน</th>
                <th className="px-6 py-4 font-semibold text-right"> </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-muted" colSpan={9}>
                    กำลังโหลด...
                  </td>
                </tr>
              ) : shownUsers.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-muted" colSpan={9}>
                    ไม่พบข้อมูลผู้ใช้งาน
                  </td>
                </tr>
              ) : (
                shownUsers.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-6 py-4">{u.fullName}</td>
                    <td className="px-6 py-4">{u.username}</td>
                    <td className="px-6 py-4">{u.password}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{(u.phone ?? "").replace(/-/g, "")}</td>
                    <td className="px-6 py-4">{u.lineId}</td>
                    <td className="px-6 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-6 py-4">{(u.factories ?? []).join(", ")}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          className="h-10 w-10 grid place-items-center rounded-sm border border-transparent hover:bg-surface active:translate-y-[1px]"
                          onClick={() => openEdit(u)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          <PencilIcon cls="text-muted" />
                        </button>
                        <button
                          type="button"
                          className="h-10 w-10 grid place-items-center rounded-sm border border-transparent hover:bg-surface active:translate-y-[1px]"
                          onClick={() => openDelete(u)}
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

      {/* modal: create/edit form */}
      {(modal === "create" || modal === "edit") && (
        <FormModalShell
          title={modal === "create" ? "เพิ่มผู้ใช้งานใหม่" : "แก้ไขผู้ใช้งาน"}
          subtitle={modal === "create" ? "กรอกข้อมูลผู้ใช้งานใหม่" : "แก้ไขข้อมูลผู้ใช้งาน"}
          onClose={() => setModal("none")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel>ชื่อผู้ใช้</FieldLabel>
                <div className="mt-2">
                  <Input
                    placeholder="เช่น admin01"
                    value={username}
                    onKeyDown={(e) => {
                      const allowKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                      if (allowKeys.includes(e.key)) return;
                      if (e.ctrlKey || e.metaKey) return;

                      const target = e.currentTarget as HTMLInputElement;
                      const hasSelection = (target.selectionStart ?? 0) !== (target.selectionEnd ?? 0);
                      if (!hasSelection && target.value.length >= 20) {
                        e.preventDefault();
                        return;
                      }

                      if (!/^[a-zA-Z0-9._-]$/.test(e.key)) e.preventDefault();
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("text");
                      const filtered = pasted.replace(/[^a-zA-Z0-9._-]/g, "");

                      const el = e.currentTarget as HTMLInputElement;
                      const start = el.selectionStart ?? el.value.length;
                      const end = el.selectionEnd ?? el.value.length;

                      const next = (el.value.slice(0, start) + filtered + el.value.slice(end)).slice(0, 20);
                      setUsername(next);
                    }}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 20);
                      setUsername(filtered);
                    }}
                  />
                </div>

                {/* ✅ helper */}
                <div className="mt-2 text-[14px] text-muted leading-[140%]">
                  อนุญาต a-z 0-9 . _ -
                </div>
              </div>

              <div>
                <FieldLabel>ชื่อ - นามสกุล</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น สมชาย ใจดี" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>

              <div>
                <FieldLabel>รหัสผ่าน</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น 123456" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              <div>
                <FieldLabel>อีเมล</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <FieldLabel>เบอร์โทร</FieldLabel>
                <div className="mt-2">
                    <Input
                      placeholder="เช่น 0812345678"
                      value={phone}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        const allowKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                        if (allowKeys.includes(e.key)) return;
                        if (e.ctrlKey || e.metaKey) return;

                        // allow int
                        if (!/^\d$/.test(e.key)) e.preventDefault();
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text");
                        const filtered = pasted.replace(/\D/g, ""); // take int
                        const el = e.currentTarget as HTMLInputElement;
                        const start = el.selectionStart ?? el.value.length;
                        const end = el.selectionEnd ?? el.value.length;

                        // max 10 digit
                        const next = (el.value.slice(0, start) + filtered + el.value.slice(end)).replace(/\D/g, "").slice(0, 10);
                        setPhone(next);
                      }}
                      onChange={(e) => {
                        // fillter to all int and trim 10 digit
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      }}
                    />
                </div>
              </div>

              <div>
                <FieldLabel>Line ID</FieldLabel>
                <div className="mt-2">
                  <Input placeholder="เช่น ADCD12545" value={lineId} onChange={(e) => setLineId(e.target.value)} />
                </div>
              </div>

              <div>
                <FieldLabel>โรงงาน</FieldLabel>
                <div className="mt-2">
                  <MultiSelectDropdown
                    labelPlaceholder="เลือกโรงงาน"
                    options={factories}
                    value={factoryPick}
                    onChange={setFactoryPick}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>บทบาท</FieldLabel>
                <div className="mt-2">
                  <div className="relative">
                    <select
                      className="h-[46px] w-full appearance-none rounded-sm border border-border bg-bg px-4 pr-10 text-[16px] leading-[140%] outline-none focus:border-blue focus:shadow-ringBlue"
                      value={rolePick}
                      onChange={(e) => setRolePick((e.target.value as Role) || "")}
                    >
                      <option value="">เลือกบทบาท</option>
                      <option value="ADMIN">ผู้ดูแลระบบ</option>
                      <option value="USER">ผู้ใช้งาน</option>
                      <option value="VIEWER">ผู้ชม</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {formError ? <div className="text-red text-[14px]">{formError}</div> : null}

            <div className="pt-2 flex items-center justify-between gap-6">
              <Button variant="secondary" className="w-full sm:w-[360px] h-[64px] rounded-[14px] text-[20px]" onClick={() => setModal("none")}>
                ยกเลิก
              </Button>
              <Button variant="primary" className="w-full sm:w-[360px] h-[64px] rounded-[14px] text-[20px]" onClick={onSaveClick}>
                บันทึก
              </Button>
            </div>
          </div>
        </FormModalShell>
      )}

      {/* confirm save (เฉพาะ edit) */}
      {modal === "confirmSave" && (
        <ConfirmModalShell
          title="บันทึกการแก้ไข"
          subtitle="คุณต้องการบันทึกการนี้ใช่หรือไม่?"
          onClose={() => setModal("none")}
          icon={<ConfirmWarnIcon />}
        >
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6">
            <Button
              variant="secondary"
              className="w-full sm:w-[360px] h-[64px] rounded-[14px] text-[20px]"
              onClick={() => setModal("edit")}
            >
              ยกเลิก
            </Button>
            <Button variant="primary" className="w-full sm:w-[360px] h-[64px] rounded-[14px] text-[20px]" onClick={doSave}>
              ยืนยัน
            </Button>
          </div>
        </ConfirmModalShell>
      )}

      {/* confirm delete */}
      {modal === "confirmDelete" && (
        <ConfirmModalShell
          tone="danger"
          title="ยืนยันการลบ"
          subtitle={`การลบนี้จะถูกลบออกจากระบบอย่างถาวร\nไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่ว่าต้องการลบ?`}
          onClose={() => setModal("none")}
          icon={<ConfirmDangerIcon />}
        >
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6">
            <Button variant="secondary" className="w-full sm:w-[360px] h-[64px] rounded-[14px] text-[20px]" onClick={() => setModal("none")}>
              ยกเลิก
            </Button>
            <Button variant="danger" className="w-full sm:w-[360px] h-[64px] rounded-[14px] text-[20px]" onClick={doDelete}>
              ยืนยัน
            </Button>
          </div>
        </ConfirmModalShell>
      )}

      {/* success */}
      {modal === "success" && (
        <ConfirmModalShell
          tone="success"
          title={successText.title}
          subtitle={successText.subtitle}
          onClose={() => setModal("none")}
          icon={<ConfirmSuccessIcon />}
        >
          <div className="flex justify-center">
            <Button
              variant="success"
              className="w-full h-[64px] rounded-[14px] text-[20px] max-w-[760px]"
              onClick={() => {
                setModal("none");
                setActiveId(null);
              }}
            >
              ตกลง
            </Button>
          </div>
        </ConfirmModalShell>
      )}
    </div>
  );
}