import { Card } from "@/components/ui/Card";

export default function Page() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[26px] font-semibold leading-[120%]">Users</div>
        <div className="text-muted mt-1">ตั้งค่าผู้ใช้งานและสิทธิ์ (Admin only)</div>
      </div>

      <Card className="shadow-none">
        <div className="text-muted">TODO: Table + create/edit dialog + validation + RBAC</div>
      </Card>
    </div>
  );
}
