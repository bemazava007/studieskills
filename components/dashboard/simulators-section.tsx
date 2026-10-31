"use client"

import { useState } from "react"
import { SimulatorCard, type Simulator } from "./simulator-card"

interface SimulatorsSectionProps {
  onLaunchSimulator?: (simulator: Simulator) => void
  onDetailsSimulator?: (simulator: Simulator) => void
}

const simulators: Simulator[] = [
  {
    id: 1,
    title: "Call Center Orange",
    description:
      "Apprendre a gerer des appels clients, resoudre des plaintes, adopter un ton professionnel.",
    category: "Service Client",
    categoryColor: "red",
    status: "En cours",
    scenarios: 20,
    date: "15 Aout 2025",
    level: 3,
    progress: 60,
  },
  {
    id: 2,
    title: "Vente & Negociation",
    description:
      "Former l'etudiant a la presentation d'un produit, l'argumentation, et la cloture de vente.",
    category: "Marketing",
    categoryColor: "blue",
    status: "Termine",
    scenarios: 50,
    date: "25 Aout 2025",
    level: 5,
    progress: 100,
  },
  {
    id: 3,
    title: "Maintenance Informatique",
    description:
      "Resoudre des pannes techniques (connexion internet, serveur, poste client).",
    category: "Service Client",
    categoryColor: "red",
    status: "En cours",
    scenarios: 20,
    date: "15 Aout 2025",
    level: 3,
    progress: 45,
  },
  {
    id: 4,
    title: "Entretien Professionnel",
    description:
      "Preparer l'etudiant a un entretien d'embauche (soft skills, presentation, reponses).",
    category: "Marketing",
    categoryColor: "blue",
    status: "Termine",
    scenarios: 50,
    date: "25 Aout 2025",
    level: 5,
    progress: 100,
  },
]

const tabs = ["Tous les simulateurs", "En cours", "Termines"] as const

export function SimulatorsSection({ onLaunchSimulator, onDetailsSimulator }: SimulatorsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("Tous les simulateurs")

  const filteredSimulators = simulators.filter((sim) => {
    if (activeTab === "En cours") return sim.status === "En cours"
    if (activeTab === "Termines") return sim.status === "Termine"
    return true
  })

  return (
    <section>
      {/* Tabs */}
      <div className="mb-5 flex gap-0 rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section title */}
      <h3 className="mb-4 text-base font-semibold text-foreground">{activeTab}</h3>

      {/* Cards grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredSimulators.map((sim) => (
          <SimulatorCard key={sim.id} simulator={sim} onLaunch={onLaunchSimulator} onDetails={onDetailsSimulator} />
        ))}
      </div>

      {filteredSimulators.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <p className="text-muted-foreground">Aucun simulateur dans cette categorie.</p>
        </div>
      )}
    </section>
  )
}
