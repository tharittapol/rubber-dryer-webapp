"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { clearAuthCookie } from "@/lib/auth";
import * as React from "react";
import { Logo } from "@/components/brand/Logo";
import Image from "next/image";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "เมนูหลัก",
    items: [
      {
        href: "/dashboard",
        label: "หน้าหลัก",
        icon: <HomeIcon />,
      },
      {
        href: "/control",
        label: "ควบคุม",
        icon: <SlidersIcon />,
      },
    ],
  },
  {
    title: "ตั้งค่าระบบ",
    items: [
      { href: "/settings/profiles", label: "โปรไฟล์อุณหภูมิ", icon: <ListIcon /> },
      { href: "/settings/factories", label: "ตั้งค่าโรงงาน", icon: <FactoryIcon /> },
      { href: "/settings/rooms", label: "ตั้งค่าห้องอบ", icon: <HouseIcon /> },
      { href: "/settings/users", label: "ตั้งค่าผู้ใช้งาน", icon: <UserIcon /> },
    ],
  },
];

function IconWrap({ children }: { children: React.ReactNode }) {
  return <span className="h-5 w-5 inline-flex items-center justify-center">{children}</span>;
}

function HomeIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 10v10h14V10" />
      </svg>
    </IconWrap>
  );
}
function SlidersIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 21v-7" /><path d="M4 10V3" />
        <path d="M12 21v-9" /><path d="M12 8V3" />
        <path d="M20 21v-5" /><path d="M20 12V3" />
        <path d="M2 14h4" /><path d="M10 8h4" /><path d="M18 12h4" />
      </svg>
    </IconWrap>
  );
}
function ListIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" />
        <path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" />
      </svg>
    </IconWrap>
  );
}
function FactoryIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21V9l6 3V9l6 3V9l6 3v9H3Z" />
      </svg>
    </IconWrap>
  );
}
function HouseIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M6 10v11h12V10" />
      </svg>
    </IconWrap>
  );
}
function UserIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      </svg>
    </IconWrap>
  );
}
function LogoutIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
        <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" />
      </svg>
    </IconWrap>
  );
}
function CollapseIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="5" width="6" height="14" rx="1" />
        <rect x="14" y="5" width="6" height="14" rx="1" />
      </svg>
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
      <Image src={src} alt={alt} width={20} height={20} />
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
        {/* can use SVG file */}
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
  icon: React.ReactNode;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "h-10 w-full flex items-center gap-3 rounded-sm px-3 border border-transparent transition",
        active ? "bg-ink text-white" : "text-text hover:bg-surface",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
    >
      <span className={cn(active ? "text-white" : "text-text")}>{icon}</span>
      {!collapsed && <span className={cn(active ? "font-semibold" : "font-normal")}>{label}</span>}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(q);

  // sync state when route changes
  React.useEffect(() => setQuery(q), [q]);

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");

    // search is meaningful on dashboard; navigate there
    router.push(`/dashboard?${params.toString()}`);
  };
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const Sidebar = (
    <div className="min-h-screen flex flex-col">
      {/* Brand header */}
      <div className="h-[84px] px-6 flex items-center border-b border-border">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          {!collapsed && (
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
      <nav className="p-6 flex-1">
        <div className="space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <div className="text-[12px] leading-[140%] text-muted mb-2">{sec.title}</div>
              <div className="space-y-2">
                {sec.items.map((it) => (
                  <NavLink key={it.href} href={it.href} label={it.label} icon={it.icon} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User card (bottom) */}
      <div className={cn("p-6", collapsed && "px-3") + " mt-auto"}>
        <div className="rounded-md bg-surface p-4 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[14px] font-semibold leading-[140%] truncate">สมชาย อินทะระชัย</div>
            <div className="text-[12px] text-muted leading-[140%] truncate">ผู้ดูแลระบบ</div>
          </div>

          <button
            className="h-10 w-10 rounded-sm border border-border bg-bg hover:bg-surface grid place-items-center"
            onClick={() => {
              clearAuthCookie();
              window.location.href = "/login";
            }}
            aria-label="Logout"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "hidden lg:block border-r border-border bg-bg transition-[width] duration-200 ease-out",
            collapsed ? "w-[84px]" : "w-[280px]"
          )}
        >
          {Sidebar}
        </aside>

        <div className="flex-1 min-w-0">
          {/* Top header */}
          <header className="h-[84px] border-b border-border bg-bg flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {/* Desktop collapse icon (design) */}
              <IconButton
                src={collapsed ? "/icons/expand.svg" : "/icons/collapse.svg"}
                alt={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => setCollapsed((v) => !v)}
                className="hidden lg:grid"
              />

              {/* Mobile hamburger */}
              <button
                className="lg:hidden rounded-sm border border-border h-10 w-10 grid place-items-center"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Mobile: search icon button */}
              <button
                type="button"
                className="sm:hidden h-10 w-10 grid place-items-center rounded-sm border border-border hover:bg-surface"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                title="Search"
              >
                {/* if have svg can use Image */}
                <Image src="/icons/search.svg" alt="" width={20} height={20} />
              </button>

              {/* Desktop: show full search bar */}
              <div className="hidden sm:block">
                <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} />
              </div>
            </div>
          </header>

          <main className="px-6 py-6">{children}</main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-bg border-r border-border shadow-soft">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Mobile search overlay */}
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
