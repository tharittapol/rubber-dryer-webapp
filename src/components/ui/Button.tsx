import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";
type Size = "md" | "sm" | "figma40";

/**
 * Reusable button sizes:
 * - md: 46px (current baseline)
 * - figma40: 40px (Login / compact)
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm border font-semibold transition active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<Variant, string> = {
    primary: "border-ink bg-ink text-white hover:opacity-90",
    // ใช้กับปุ่ม “ยกเลิก” ที่เป็นสีเทาอ่อนในดีไซน์
    secondary: "border-border bg-surface text-text hover:bg-surface2",
    ghost: "border-border bg-bg text-text hover:bg-surface",
    // ปุ่มเขียวตามดีไซน์ “สร้างห้องอบใหม่ / ตกลง”
    success: "border-greenInk bg-greenInk text-white hover:opacity-90",
    danger: "border-red bg-red text-white hover:opacity-90",
  };

  const sizes: Record<Size, string> = {
    md: "h-[46px] px-4 text-[16px] leading-[140%]",
    sm: "h-[40px] px-3 text-[14px] leading-[140%]",
    figma40: "h-[40px] px-4 text-[16px] leading-[100%]",
  };

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}