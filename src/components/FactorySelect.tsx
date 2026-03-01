"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FactorySelect({ factories }: { factories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const value = sp.get("factory") ?? "all";

  function onChange(next: string) {
    const params = new URLSearchParams(sp.toString());

    if (!next || next === "all") params.delete("factory");
    else params.set("factory", next);

    // When changing factories, please return to page 1 if there is pagination.
    // params.delete("page");

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="mt-2 relative">
      <select
        className="h-10 w-full appearance-none rounded-md border border-border bg-bg px-4 pr-10 rd-sub16 outline-none focus:ring-2 focus:ring-[color:rgba(0,0,0,0.06)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Factory"
      >
        <option value="all">ทุกโรงงาน</option>

        {factories.map((f) => {
          const label = f.startsWith("โรงงาน") ? f : `โรงงาน${f}`;
          return (
            <option key={f} value={f}>
              {label}
            </option>
          );
        })}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
