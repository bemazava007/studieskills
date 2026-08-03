"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, TrendingUp, Clock, Award, Loader2 } from "lucide-react"
import { SimulatorCard, type Simulator, type SimulatorStatus } from "./simulator-card"
import { getSimulators, getUserSessions } from "@/lib/api"
import type { SimulationSession } from "@/lib/types"

const difficultyToLevel: Record<string, number> = {
  debutant: 1,
  intermediaire: 3,
  avance: 5,
}

const categoryColors: Record<string, "red" | "blue" | "green" | "orange"> = {
  "Service Client": "red",
  "Vente": "orange",
  "IT": "blue",
  "Marketing": "orange",
  "Soft Skills": "blue",
}

export function SimulatorsContent() {
  const router = useRouter()
  const [simulators, setSimulators] = useState<Simulator[]>([])
  const [sessions, setSessions] = useState<SimulationSession[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"Tous les simulateurs" | "En cours" | "Terminés">("Tous les simulateurs")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [sims, userSessions] = await Promise.all([getSimulators(), getUserSessions()])
      setSessions(userSessions)

      const mapped: Simulator[] = sims.map((sim) => {
        const simSessions = userSessions.filter((s) => s.simulator_id === sim.id)
        const completedCount = simSessions.filter((s) => s.status === "completed").length
        const isActive = simSessions.some((s) => s.status === "active")
        const progress = simSessions.length > 0
          ? Math.round((completedCount / Math.max(simSessions.length, 1)) * 100)
          : 0

        let status: SimulatorStatus = "non_commence"
        if (completedCount > 0 && progress === 100) status = "termine"
        else if (isActive || completedCount > 0) status = "en_cours"

        return {
          id: sim.id,
          title: sim.title,
          description: sim.description,
          category: sim.category || sim.profession?.title || "Simulation",
          categoryColor: categoryColors[sim.category] ?? "blue",
          status,
          scenarios: simSessions.length,
          date: new Date(sim.created_at).toLocaleDateString("fr-FR"),
          level: difficultyToLevel[sim.difficulty] ?? 1,
          progress,
        }
      })

      setSimulators(mapped)
    } catch (err) {
      console.error("Failed to load simulators:", err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { icon: Monitor, value: String(simulators.length), label: "Simulateurs disponibles", color: "bg-primary/10 text-primary" },
    { icon: TrendingUp, value: `${sessions.filter(s => s.status === "completed").length}`, label: "Sessions complétées", color: "bg-green-50 text-green-600" },
    { icon: Clock, value: `${sessions.filter(s => s.status === "active").length}`, label: "Sessions en cours", color: "bg-orange-50 text-orange-500" },
    { icon: Award, value: "0", label: "Certifications", color: "bg-blue-50 text-blue-600" },
  ]

  const filteredSimulators = simulators.filter((sim) => {
    if (activeTab === "En cours") return sim.status === "en_cours"
    if (activeTab === "Terminés") return sim.status === "termine"
    return true
  })

  const handleLaunch = (simulator: Simulator) => {
    router.push(`/simulateurs/${simulator.id}/lancer`)
  }

  const handleDetails = (simulator: Simulator) => {
    router.push(`/simulateurs/${simulator.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-primary p-5 text-primary-foreground sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl text-balance">
          Vue d'ensemble de vos simulateurs et parcours
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-primary-foreground/80">
          Votre espace d'apprentissage, conçu pour progresser à votre rythme et suivre vos résultats.
        </p>
      </div>

      <section aria-label="Impact en un coup d'œil">
        <h3 className="mb-4 text-base font-semibold text-foreground">Impact en un coup d'œil</h3>
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

      <section>
        <div className="mb-5 flex items-center border-b border-border">
          {(["Tous les simulateurs", "En cours", "Terminés"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

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
