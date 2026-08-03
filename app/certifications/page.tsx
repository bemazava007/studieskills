import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BadgesCertificationsContent } from "@/components/dashboard/badges-certifications-content"

export default function CertificationsPage() {
  return (
    <DashboardShell title="Tableau de bord">
      <BadgesCertificationsContent />
    </DashboardShell>
  )
}
