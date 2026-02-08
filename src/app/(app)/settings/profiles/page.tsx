import { Card } from "@/components/ui/Card";

export default function Page() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[26px] font-semibold leading-[120%]">Profiles</div>
        <div className="text-muted mt-1">ตั้งค่าโปรไฟล์การอบ (Admin only)</div>
      </div>

      <Card className="shadow-none">
        <div className="text-muted">TODO: Table + create/edit dialog + validation + RBAC</div>
      </Card>
    </div>
  );
}
