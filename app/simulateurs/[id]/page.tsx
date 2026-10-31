import { notFound } from "next/navigation"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SimulatorDetails } from "@/components/dashboard/simulator-details"

import { getSimulator } from "@/lib/api"

export default async function SimulatorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const simulator =
      await getSimulator(id)

    if (!simulator) {
      notFound()
    }

    // =========================================================
    // NIVEAU
    // =========================================================

    const levelMap: Record<
      string,
      "Débutant" | "Intermédiaire" | "Avancé"
    > = {
      debutant: "Débutant",
      intermediaire: "Intermédiaire",
      avance: "Avancé",
    }

    const level =
      levelMap[simulator.difficulty] ??
      "Débutant"

    // =========================================================
    // DONNÉES DU SIMULATEUR
    // =========================================================

    const mappedSimulator = {
      id: simulator.id,

      title:
        simulator.title ?? "Sans titre",

      description:
        simulator.description ?? "",

      level,

      duration:
        simulator.duration_minutes ?? 0,

      category:
        simulator.category ??
        simulator.profession?.title ??
        "Simulation",

      skillsDeveloped:
        Array.isArray(
          simulator.skills_evaluated
        )
          ? simulator.skills_evaluated
          : [],

      learningObjectives:
        Array.isArray(
          simulator.learning_objectives
        )
          ? simulator.learning_objectives
          : [],

      scenarios:
        Array.isArray(
          simulator.scenarios
        )
          ? simulator.scenarios
          : [],

      badges:
        Array.isArray(
          simulator.badges
        )
          ? simulator.badges
          : [],

      // =====================================================
      // STATISTIQUES DYNAMIQUES
      // =====================================================

      progression:
        simulator.progression ?? 0,

      attempts:
        simulator.attempts ?? 0,

      completedSessions:
        simulator.completedSessions ?? 0,

      activeSessions:
        simulator.activeSessions ?? 0,

      bestScore:
        simulator.bestScore ?? 0,

      averageScore:
        simulator.averageScore ?? 0,
    }

    return (
      <DashboardShell
        title={simulator.title}
      >
        <SimulatorDetails
          {...mappedSimulator}
        />
      </DashboardShell>
    )
  } catch (error) {
    console.error(
      "❌ Erreur chargement simulateur :",
      error
    )

    notFound()
  }
}