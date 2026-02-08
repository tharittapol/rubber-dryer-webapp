"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { clearAuthCookie } from "@/lib/auth";
import * as React from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/control", label: "Control" },
  { href: "/settings/profiles", label: "Profiles" },
  { href: "/settings/factories", label: "Factories" },
  { href: "/settings/rooms", label: "Rooms" },
  { href: "/settings/users", label: "Users" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-sm px-3 py-2 text-[16px] border border-transparent",
        active ? "bg-surface border-border font-semibold" : "hover:bg-surface"
      )}
    >
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const Sidebar = (
    <div className="h-full flex flex-col">
      <div className="h-[84px] px-4 flex items-center border-b border-border">
        <div className="font-semibold text-[18px]">Rubber Dryer</div>
      </div>
      <nav className="p-4 flex-1 space-y-2">
        {navItems.map((it) => (
          <NavLink key={it.href} href={it.href} label={it.label} />
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            clearAuthCookie();
            window.location.href = "/login";
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="flex">
        <aside className="hidden lg:block w-[280px] border-r border-border bg-bg">{Sidebar}</aside>

        <div className="flex-1 min-w-0">
          <header className="h-[84px] border-b border-border bg-bg flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-sm border border-border h-10 w-10"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
              <div className="text-[18px] font-semibold">Control Panel</div>
            </div>

            <div className="text-[14px] text-muted">Prototype UI • Ready for API hookup</div>
          </header>

          <main className="px-4 lg:px-6 py-6">{children}</main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.25)]" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[300px] bg-bg border-r border-border shadow-soft">
            <div className="flex items-center justify-between px-4 h-[84px] border-b border-border">
              <div className="font-semibold">Rubber Dryer</div>
              <button className="h-10 w-10 rounded-sm border border-border" onClick={() => setMobileOpen(false)}>
                ✕
              </button>
            </div>
            <div className="p-4 space-y-2" onClick={() => setMobileOpen(false)}>
              {navItems.map((it) => (
                <NavLink key={it.href} href={it.href} label={it.label} />
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  clearAuthCookie();
                  window.location.href = "/login";
                }}
              >
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
