"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { setAuthCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    // Prototype-only: accept any email/pass. Replace with POST /api/auth/login
    await new Promise((r) => setTimeout(r, 400));
    setAuthCookie("demo_token");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-[520px] rounded-lg border border-border bg-bg p-8 shadow-soft">
        <div className="text-center">
          <div className="text-[28px] font-semibold leading-[120%]">Rubber Dryer</div>
          <div className="mt-2 text-[16px] text-muted">เข้าสู่ระบบเพื่อใช้งาน</div>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-[14px] text-muted">อีเมล</label>
            <div className="mt-2">
              <Input placeholder="name@company.com" {...register("email")} />
            </div>
            {errors.email && <div className="mt-2 text-[14px] text-red">{errors.email.message}</div>}
          </div>

          <div>
            <label className="text-[14px] text-muted">รหัสผ่าน</label>
            <div className="mt-2">
              <Input type="password" placeholder="••••••••" {...register("password")} />
            </div>
            {errors.password && <div className="mt-2 text-[14px] text-red">{errors.password.message}</div>}
          </div>

          {serverError && <div className="rounded-sm border border-red bg-[color:rgba(236,34,31,0.08)] p-3 text-red">{serverError}</div>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>

          <div className="text-[12px] text-muted text-center">
            โหมด prototype: login ได้ทุกอีเมล/รหัสผ่าน (เดี๋ยวค่อยต่อ API จริง)
          </div>
        </form>
      </div>
    </div>
  );
}
