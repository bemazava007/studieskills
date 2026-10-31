import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PortfolioContent } from "@/components/dashboard/portfolio-content"

export default function PortfolioPage() {
  return (
    <DashboardShell title="Tableau de bord">
      <PortfolioContent />
    </DashboardShell>
  )
}
