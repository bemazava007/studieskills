import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SimulatorsContent } from "@/components/dashboard/simulators-content"

export default function SimulateursPage() {
  return (
    <DashboardShell title="Tableau de bord">
      <SimulatorsContent />
    </DashboardShell>
  )
}
