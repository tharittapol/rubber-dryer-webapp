import { ControlWizard } from "@/components/control/ControlWizard";

export const dynamic = "force-static";

export default function ControlPage() {
  // Frontend-only: the wizard will load mock data from /public/mock/control.json
  return <ControlWizard />;
}
