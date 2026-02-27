"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { clearAuthCookie, clearRoleCookie } from "@/lib/auth";
import * as React from "react";
import { Logo, LogoAppShell } from "@/components/brand/Logo";
import Image from "next/image";

import HomeSvg from "@/assets/icons/home.svg";
import SlidersSvg from "@/assets/icons/slider.svg";
import ListSvg from "@/assets/icons/list.svg";
import FactorySvg from "@/assets/icons/factory.svg";
import HouseSvg from "@/assets/icons/room.svg";
import UserSvg from "@/assets/icons/user.svg";
import LogoutSvg from "@/assets/icons/logout.svg";

type Role = "ADMIN" | "USER" | "VIEWER";
type NavItem = { href: string; label: string; icon: (active: boolean) => React.ReactNode };

function readClientUser(): { fullName: string; role: Role } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("rd_auth_user");
    if (!raw) return null;
    const obj = JSON.parse(raw) as { fullName?: string; role?: Role };
    if (!obj.fullName) return null;
    if (obj.role !== "ADMIN" && obj.role !== "USER" && obj.role !== "VIEWER") return null;
    return { fullName: obj.fullName, role: obj.role };
  } catch {
    return null;
  }
}

function roleLabel(role: Role) {
  if (role === "ADMIN") return "ผู้ดูแลระบบ";
  if (role === "USER") return "ผู้ใช้งาน";
  return "ผู้ชม";
}

function canSeeNav(role: Role, href: string) {
  if (role === "ADMIN") return true;

  // Dashboard: Visible to all roles
  if (href.startsWith("/dashboard")) return true;

  // Control: USER sees (VIEWER does not see)
  if (href.startsWith("/control")) return role === "USER";

  // Settings: ADMIN only
  if (href.startsWith("/settings")) return false;

  return false;
}

export function AppShellClient({ children }: { children: React.ReactNode }) {
  function IconWrap({ children }: { children: React.ReactNode }) {
    return <span className="h-5 w-5 inline-flex items-center justify-center">{children}</span>;
  }

  function HomeIcon({ active }: { active: boolean }) {
    return (
      <IconWrap>
        <HomeSvg className={cn("h-5 w-5", active ? "text-white" : "text-text")} />
      </IconWrap>
    );
  }
  function SlidersIcon({ active }: { active: boolean }) {
    return (
      <IconWrap>
        <SlidersSvg className={cn("h-5 w-5", active ? "text-white" : "text-text")} />
      </IconWrap>
    );
  }

  function ListIcon({ active }: { active: boolean }) {
    return (
      <IconWrap>
        <ListSvg className={cn("h-3 w-5", active ? "text-white" : "text-text")} />
      </IconWrap>
    );
  }

  function FactoryIcon({ active }: { active: boolean }) {
    return (
      <IconWrap>
        <FactorySvg className={cn("h-5 w-5", active ? "text-white" : "text-text")} />
      </IconWrap>
    );
  }

  function HouseIcon({ active }: { active: boolean }) {
    return (
      <IconWrap>
        <HouseSvg className={cn("h-5 w-5", active ? "text-white" : "text-text")} />
      </IconWrap>
    );
  }

  function UserIcon({ active }: { active: boolean }) {
    return (
      <IconWrap>
        <UserSvg className={cn("h-5 w-5", active ? "text-white" : "text-text")} />
      </IconWrap>
    );
  }

  function LogoutIcon() {
    return (
      <IconWrap>
        <LogoutSvg className="h-5 w-5 text-text" />
      </IconWrap>
    );
  }

  function IconButton({
    src,
    alt,
    onClick,
    className,
  }: {
    src: string;
    alt: string;
    onClick?: () => void;
    className?: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "h-10 w-10 grid place-items-center rounded-sm border border-transparent hover:bg-surface active:translate-y-[1px]",
          className
        )}
        aria-label={alt}
        title={alt}
      >
        <Image src={src} alt={alt} width={25} height={25} />
      </button>
    );
  }

  function SearchBar({
    value,
    onChange,
    onSubmit,
  }: {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
  }) {
    return (
      <form
        className="flex items-center h-10 w-full rounded-pill border border-border bg-bg px-4 gap-2 min-w-0"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          autoFocus
          className="min-w-0 flex-1 bg-transparent outline-none text-[16px] leading-[100%] placeholder:text-grey1"
          placeholder="ค้นหา..."
          aria-label="Search rooms"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 h-8 w-8 grid place-items-center rounded-sm hover:bg-surface"
          aria-label="Search"
          title="Search"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>
      </form>
    );
  }

  function NavLink({
    href,
    label,
    icon,
    collapsed,
  }: {
    href: string;
    label: string;
    icon: (active: boolean) => React.ReactNode;
    collapsed: boolean;
  }) {
    const pathname = usePathname();
    const active = pathname === href || pathname.startsWith(href + "/");

    return (
      <Link
        href={href}
        className={cn(
          "h-10 w-full flex items-center gap-3 rounded-sm border border-transparent transition",
          active ? "bg-ink text-white" : "text-text hover:bg-surface",
          collapsed ? "justify-center px-0" : "px-3"
        )}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
      >
        {icon(active)}
        {!collapsed && <span className={cn(active ? "font-semibold" : "font-normal")}>{label}</span>}
      </Link>
    );
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(q);

  React.useEffect(() => setQuery(q), [q]);

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    router.push(`/dashboard?${params.toString()}`);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)"); // lg
    const apply = () => {
      if (!mq.matches) setCollapsed(false); // mobile/tablet -> ห้าม collapsed
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // อ่าน user/role จาก localStorage
  const [me, setMe] = React.useState<{ fullName: string; role: Role } | null>(null);

  React.useEffect(() => {
    setMe(readClientUser());
  }, []);

  // === สร้าง nav sections แบบ “ตาม role”
  const navSections: { title: string; items: NavItem[] }[] = React.useMemo(() => {
    const role: Role = me?.role ?? "VIEWER";

    const sections: { title: string; items: NavItem[] }[] = [
      {
        title: "เมนูหลัก",
        items: [
          { href: "/dashboard", label: "หน้าหลัก", icon: (active) => <HomeIcon active={active} /> },
          { href: "/control", label: "ควบคุม", icon: (a) => <SlidersIcon active={a} /> },
        ],
      },
      {
        title: "ตั้งค่าระบบ",
        items: [
          { href: "/settings/profiles", label: "โปรไฟล์อุณหภูมิ", icon: (a) => <ListIcon active={a} /> },
          { href: "/settings/factories", label: "ตั้งค่าโรงงาน", icon: (a) => <FactoryIcon active={a} /> },
          { href: "/settings/rooms", label: "ตั้งค่าห้องอบ", icon: (a) => <HouseIcon active={a} /> },
          { href: "/settings/users", label: "ตั้งค่าผู้ใช้งาน", icon: (a) => <UserIcon active={a} /> },
        ],
      },
    ];

    // filter items ตาม role
    return sections
      .map((sec) => ({ ...sec, items: sec.items.filter((it) => canSeeNav(role, it.href)) }))
      .filter((sec) => sec.items.length > 0);
  }, [me]);

  const Sidebar = ({ forceExpanded }: { forceExpanded?: boolean }) => {
    const c = forceExpanded ? false : collapsed; // mobile drawer force expanded

    return (
      <div className="h-full flex flex-col">
        {/* Brand header */}
        <div className={cn(
          "h-[84px] flex items-center border-b border-border shrink-0",
          c ? "px-0 justify-center" : "px-6"
        )}>
          <div className={cn("flex items-center gap-3", c && "gap-0")}>
            <LogoAppShell size={40} />
            {!c && (
              <div className="min-w-0">
                <div className="text-[16px] font-semibold leading-[120%] truncate">
                  <span lang="en">Rubber Dryer System</span>
                </div>
                <div className="text-[14px] text-muted leading-[140%] truncate">
                  ระบบควบคุมห้องอบยางพารา
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav sections */}
        <nav className={cn("flex-1 min-h-0 overflow-y-auto", c ? "py-6 px-2" : "p-6")}>
          <div className={cn("space-y-6", c && "space-y-5")}>
            {navSections.map((sec) => (
              <div key={sec.title} className={cn(c && "flex flex-col items-center")}>
                {/* title show both collapsed and expanded */}
                <div
                  className={cn(
                    "text-[12px] leading-[140%] text-muted mb-2 whitespace-nowrap overflow-hidden",
                    collapsed ? "px-1 text-center truncate" : "truncate"
                  )}
                  title={sec.title}
                >
                  {sec.title}
                </div>

                <div className={cn("space-y-2", c && "w-full flex flex-col items-center")}>
                  {sec.items.map((it) => (
                    <NavLink key={it.href} href={it.href} label={it.label} icon={it.icon} collapsed={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className={cn("shrink-0", c ? "p-4" : "p-6")}>
          {c ? (
            <div className="flex justify-center">
              <button
                className="h-12 w-12 grid place-items-center rounded-md bg-surface hover:bg-[rgba(0,0,0,0.06)] active:translate-y-[1px]"
                onClick={() => {
                  clearAuthCookie();
                  clearRoleCookie();
                  localStorage.removeItem("rd_auth_user");
                  window.location.href = "/login";
                }}
                aria-label="Logout"
                title="Logout"
              >
                <LogoutIcon />
              </button>
            </div>
          ) : (
            <div className="rounded-md bg-surface p-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold leading-[140%] truncate">{me?.fullName ?? "-"}</div>
                <div className="text-[12px] text-muted leading-[140%] truncate">{me ? roleLabel(me.role) : "-"}</div>
              </div>

              <button
                className="h-10 w-10 grid place-items-center rounded-sm border border-transparent hover:bg-surface active:translate-y-[1px]"
                onClick={() => {
                  clearAuthCookie();
                  clearRoleCookie();
                  localStorage.removeItem("rd_auth_user");
                  window.location.href = "/login";
                }}
                aria-label="Logout"
                title="Logout"
              >
                <LogoutIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-dvh overflow-hidden bg-bg text-text">
      <div className="flex h-full overflow-hidden">
        <aside
          className={cn(
            "hidden lg:block border-r border-border bg-bg transition-[width] duration-200 ease-out h-full overflow-hidden",
            collapsed ? "w-[84px]" : "w-[280px]"
          )}
        >
          <Sidebar />
        </aside>

        <div className="flex-1 min-w-0 h-full flex flex-col min-h-0">
          <header className="h-[84px] border-b border-border bg-bg flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <IconButton
                src={collapsed ? "/icons/expand.svg" : "/icons/collapse.svg"}
                alt={collapsed ? "ขยายแถบด้านข้าง" : "ยุบแถบด้านข้าง"}
                onClick={() => setCollapsed((v) => !v)}
                className="hidden lg:grid"
              />

              <button
                className="lg:hidden rounded-sm border border-border h-10 w-10 grid place-items-center"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="sm:hidden h-10 w-10 grid place-items-center rounded-sm border border-border hover:bg-surface"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                title="Search"
              >
                <Image src="/icons/search.svg" alt="" width={20} height={20} />
              </button>

              <div className="hidden sm:block">
                <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} />
              </div>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6">{children}</main>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-bg border-r border-border shadow-soft overflow-hidden">
            <Sidebar forceExpanded />
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={() => setSearchOpen(false)} />
          <div className="absolute left-0 right-0 top-0 bg-bg border-b border-border p-4">
            <div className="mx-auto w-full max-w-[520px]">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={() => {
                  submitSearch();
                  setSearchOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}