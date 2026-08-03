import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OpportunitiesContent } from "@/components/dashboard/opportunities-content"

export default function OpportunitiesPage() {
  return (
    <DashboardShell title="Opportunites Professionnelles">
      <OpportunitiesContent />
    </DashboardShell>
  )
}
