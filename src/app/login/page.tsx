"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { setAuthCookie, setRoleCookie } from "@/lib/auth";
import { ensureUsersStore, type UserRow } from "@/lib/mockUsersStore";
import { Logo } from "@/components/brand/Logo";

const schema = z.object({
  username: z
    .string()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(32, "ชื่อผู้ใช้ยาวเกินไป")
    .regex(/^[a-zA-Z0-9._@-]+$/, "ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, . _ @ -"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  
  const [allowedUsers, setAllowedUsers] = React.useState<UserRow[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await ensureUsersStore();
      if (!mounted) return;
      setAllowedUsers(data.users ?? []);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { username: "", password: "" },
      });

  type AllowedUser = {
    username: string;
    password: string;
    role: "ADMIN" | "USER" | "VIEWER";
    fullName: string;
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    await new Promise((r) => setTimeout(r, 200));

    const u = allowedUsers.find(
      (x) => x.username === values.username.trim() && x.password === values.password
    );

    if (!u) {
      setServerError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    setAuthCookie("demo_token");
    setRoleCookie(u.role);
    localStorage.setItem("rd_auth_user", JSON.stringify({ username: u.username, role: u.role, fullName: u.fullName }));
    window.location.href = "/dashboard";
  };

  return (
  <div className="rd-page-center">
    <div className="w-full max-w-[520px] rd-stack-32">
      {/* AuthHeader (reusable block) */}
      <div className="rd-stack-24 items-center">
        <div className="relative w-[100px] h-[100px]">
          <Logo size={100} />
        </div>

        <div className="rd-stack-8 items-center w-full max-w-[240px]">
          <div className="rd-heading-24 text-center w-full"><p lang="en">Rubber Dryer System</p></div>
          <div className="rd-subheading-20 text-center text-muted w-full">
            ระบบควบคุมห้องอบยางพารา
          </div>
        </div>
      </div>

      {/* AuthCard (reusable block) */}
      <div className="w-full border border-border bg-bg rounded-sm p-6 shadow-soft">
        <div className="rd-stack-8 items-center">
          <div className="rd-heading-24 text-center">เข้าสู่ระบบ</div>
          <div className="rd-body16 rd-muted text-center">กรอกข้อมูลเพื่อเข้าสู่ระบบ</div>
        </div>

        <form className="mt-6 rd-stack-24" onSubmit={handleSubmit(onSubmit)}>
          <div className="rd-stack-8">
            <label className="rd-label">ชื่อผู้ใช้</label>
            <Input variant="figma40" placeholder="กรอกชื่อผู้ใช้" {...register("username")} />
            {errors.username && <div className="rd-body14 text-red">{errors.username.message}</div>}
          </div>

          <div className="rd-stack-8">
            <label className="rd-label">รหัสผ่าน</label>
            <Input variant="figma40" type="password" placeholder="กรอกรหัสผ่าน" {...register("password")} />
            {errors.password && <div className="rd-body14 text-red">{errors.password.message}</div>}
          </div>

          {serverError && (
            <div className="rounded-sm border border-red bg-[color:rgba(236,34,31,0.08)] p-3 text-red">
              {serverError}
            </div>
          )}

          <Button type="submit" size="figma40" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
      </div>
    </div>
  </div>
);

}
