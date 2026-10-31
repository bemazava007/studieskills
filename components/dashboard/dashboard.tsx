'use client'

import { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { HeroBanner } from './hero-banner'
import { StatsSection } from './stats-section'
import { SimulatorsSection } from './simulators-section'
import { SimulatorDetail } from './simulator-detail'
import { ScenarioSimulation } from './scenario-simulation'
import { SimulatorDetailsModal } from './simulator-details-modal'
import { SimulatorsContent } from './simulators-content'
import { PortfolioContent } from './portfolio-content'
import { BadgesCertificationsContent } from './badges-certifications-content'
import { PerformancesContent } from './performances-content'
import { OpportunitiesContent } from './opportunities-content'
import type { Simulator } from './simulator-card'
import PerformancesPage from '@/app/performances/page'

type ViewType = 'dashboard' | 'detail' | 'scenario' | 'performance' | 'opportunities' | 'simulators' | 'portfolio' | 'certifications' | 'performances'

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [selectedSimulator, setSelectedSimulator] = useState<Simulator | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [modalSimulator, setModalSimulator] = useState<Simulator | null>(null)

  const handleLaunchSimulator = (simulator: Simulator) => {
    setSelectedSimulator(simulator)
    setCurrentView('detail')
  }

  const handleStartScenario = () => {
    setCurrentView('scenario')
  }

  const handleBackFromDetail = () => {
    setCurrentView('dashboard')
    setSelectedSimulator(null)
  }

  const handleBackFromScenario = () => {
    if (selectedSimulator) {
      setCurrentView('detail')
    } else {
      setCurrentView('dashboard')
      setSelectedSimulator(null)
    }
  }

  const handleDetailsModal = (simulator: Simulator) => {
    setModalSimulator(simulator)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setModalSimulator(null)
  }

  const handleLaunchFromModal = () => {
    if (modalSimulator) {
      setShowDetailsModal(false)
      setSelectedSimulator(modalSimulator)
      setCurrentView('detail')
    }
  }

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view)
    setSelectedSimulator(null)
  }

  // Render different views
  if (currentView === 'scenario' && selectedSimulator) {
    return <ScenarioSimulation simulator={selectedSimulator} onBack={handleBackFromScenario} />
  }

  if (currentView === 'detail' && selectedSimulator) {
    return (
      <>
        <Header
          title={selectedSimulator.title}
          showBackButton={true}
          onBack={handleBackFromDetail}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} activeView={currentView} />
          <main className="flex-1 overflow-auto">
            <SimulatorDetail
              simulator={selectedSimulator}
              onStartScenario={handleStartScenario}
            />
          </main>
        </div>
      </>
    )
  }

  // Render page views
  let pageTitle = "Tableau de bord"
  let pageContent: React.ReactNode = null

  switch (currentView) {
    case 'simulators':
      pageTitle = "Mes Simulateurs"
      pageContent = <SimulatorsContent />
      break
    case 'portfolio':
      pageTitle = "Mon Portfolio"
      pageContent = <PortfolioContent />
      break
    case 'certifications':
      pageTitle = "Badge & Certification"
      pageContent = <BadgesCertificationsContent />
      break
    case 'performances':
      pageTitle = "Mes Performances"
      pageContent = <PerformancesContent />
      break
    case 'opportunities':
      pageTitle = "Opportunités"
      pageContent = <OpportunitiesContent />
      break
    default:
      pageContent = (
        <div className="space-y-8">
          <HeroBanner />
          <StatsSection />
          <SimulatorsSection
            onLaunchSimulator={handleLaunchSimulator}
            onDetailsSimulator={handleDetailsModal}
          />
        </div>
      )
  }

  // Default dashboard view
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} activeView={currentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={pageTitle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 space-y-8">
            {pageContent}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && modalSimulator && (
        <SimulatorDetailsModal
          simulator={modalSimulator}
          onClose={handleCloseDetailsModal}
          onLaunch={handleLaunchFromModal}
        />
        
      )}


   

    </div>
  )
}
