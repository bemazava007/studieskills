import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { SimulatorCreator } from '@/components/dashboard/simulator-creator'

export default function CreateSimulatorPage() {
  return (
    <DashboardShell>
      <SimulatorCreator />
    </DashboardShell>
  )
}
