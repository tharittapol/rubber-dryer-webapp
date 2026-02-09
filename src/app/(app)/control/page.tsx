import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ControlPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="rd-h24">Control</div>
        <div className="rd-body16 rd-muted mt-2">โครงหน้าควบคุม (จะต่อ API + realtime + confirmation popup ตาม design)</div>
      </div>

      <Card className="shadow-none">
        <div className="text-[18px] font-semibold">Room selection</div>
        <div className="mt-2 text-muted">TODO: dropdown / stepper / cards ตาม Figma</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button>Start</Button>
          <Button variant="ghost">Stop</Button>
          <Button variant="danger">Reset</Button>
        </div>
      </Card>
    </div>
  );
}
