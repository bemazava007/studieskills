"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, TrendingUp, Clock, Award } from "lucide-react"
import { SimulatorCard, type Simulator, type SimulatorStatus } from "./simulator-card"

// ════════════════════════════════════════════════════════════════
//  STATISTIQUES
// ════════════════════════════════════════════════════════════════

const stats = [
  {
    icon: Monitor,
    value: "4",
    label: "Simulateurs suivis",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    value: "65%",
    label: "Progression moyenne",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Clock,
    value: "30h",
    label: "Heures de simulation",
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: Award,
    value: "2",
    label: "Certifications obtenues",
    color: "bg-blue-50 text-blue-600",
  },
]

// ════════════════════════════════════════════════════════════════
//  DONNÉES SIMULATEURS (avec types alignés)
// ════════════════════════════════════════════════════════════════

const simulators: Simulator[] = [
  {
    id: 1,
    title: "Call Center Orange",
    description:
      "Apprendre à gérer des appels clients, résoudre des plaintes, adopter un ton professionnel.",
    category: "service client",
    categoryColor: "red",
    status: "en_cours",
    scenarios: 20,
    date: "15 août 2025",
    level: 3,
    progress: 60,
  },
  {
    id: 2,
    title: "Vente & Négociation",
    description:
      "Former l'étudiant à la présentation d'un produit, l'argumentation, et la clôture de vente.",
    category: "marketing",
    categoryColor: "orange",
    status: "termine",
    scenarios: 50,
    date: "25 août 2025",
    level: 5,
    progress: 100,
  },
  {
    id: 3,
    title: "Maintenance Informatique",
    description:
      "Résoudre des pannes techniques (connexion Internet, serveur, poste client).",
    category: "service client",
    categoryColor: "red",
    status: "en_cours",
    scenarios: 20,
    date: "15 août 2025",
    level: 3,
    progress: 60,
  },
  {
    id: 4,
    title: "Entretien Professionnel",
    description:
      "Préparer l'étudiant à un entretien d'embauche (soft skills, présentation, réponses).",
    category: "marketing",
    categoryColor: "orange",
    status: "non_commence",
    scenarios: 50,
    date: "25 août 2025",
    level: 5,
    progress: 0,
  },
  {
    id: 5,
    title: "Gestion de Projet Agile",
    description:
      "Apprendre à gérer un projet avec la méthode Scrum, gérer les sprints et les rétrospectives.",
    category: "management",
    categoryColor: "blue",
    status: "en_cours",
    scenarios: 30,
    date: "1 sept. 2025",
    level: 4,
    progress: 45,
  },
]

// ════════════════════════════════════════════════════════════════
//  TABS
// ════════════════════════════════════════════════════════════════

type TabValue = "Tous les simulateurs" | "En cours" | "Terminés"

const tabs: TabValue[] = ["Tous les simulateurs", "En cours", "Terminés"]

// ════════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════════

export function SimulatorsContent() {
  const [activeTab, setActiveTab] = useState<TabValue>("Tous les simulateurs")

  // Filtrage cohérent avec les statuts
  const filteredSimulators = simulators.filter((sim) => {
    if (activeTab === "En cours") return sim.status === "en_cours"
    if (activeTab === "Terminés") return sim.status === "termine"
    return true // "Tous les simulateurs"
  })

  // Handlers
  const handleLaunch = (simulator: Simulator) => {
    console.log("🚀 Lancer :", simulator.title)
    // TODO: navigation vers la simulation
  }

  const handleDetails = (simulator: Simulator) => {
    console.log("📋 Détails :", simulator.title)
    // TODO: navigation vers les détails
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-primary p-5 text-primary-foreground sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl text-balance">
          Vue d'ensemble de vos simulateurs et parcours
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-primary-foreground/80">
          Votre espace d'apprentissage, conçu pour progresser à votre rythme et suivre vos résultats.
        </p>
      </div>

      {/* Impact Stats */}
      <section aria-label="Impact en un coup d'œil">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          Impact en un coup d'œil
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="gap-0 py-4">
              <CardContent className="flex items-center gap-3 px-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tabs + Grid */}
      <section>
        {/* Tab Navigation */}
        <div className="mb-5 flex items-center border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Simulator Cards Grid */}
        {filteredSimulators.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSimulators.map((sim) => (
              <SimulatorCard
                key={sim.id ?? sim.title}
                simulator={sim}
                onLaunch={handleLaunch}
                onDetails={handleDetails}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <Monitor className="size-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Aucun simulateur dans cette catégorie
            </p>
          </div>
        )}
      </section>
    </div>
  )
}