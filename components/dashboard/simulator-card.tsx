"use client"

import { Calendar, Layers, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// ════════════════════════════════════════════════════════════════
//  TYPES ALIGNÉS avec SimulatorsContent
// ════════════════════════════════════════════════════════════════

export type SimulatorStatus = "en_cours" | "termine" | "non_commence"

export interface Simulator {
  id?: number | string
  title: string
  description: string
  category: string
  categoryColor: "red" | "blue" | "green" | "orange"
  status: SimulatorStatus
  scenarios: number
  date: string
  level: number
  progress: number
}

// ════════════════════════════════════════════════════════════════
//  STYLES
// ════════════════════════════════════════════════════════════════

const categoryStyles: Record<NonNullable<Simulator["categoryColor"]>, string> = {
  red: "bg-destructive/10 text-destructive border-destructive/20",
  blue: "bg-primary/10 text-primary border-primary/20",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
}

const statusStyles: Record<SimulatorStatus, string> = {
  en_cours: "bg-primary/10 text-primary border-primary/20",
  termine: "bg-emerald-100 text-emerald-700 border-emerald-200",
  non_commence: "bg-muted text-muted-foreground border-muted",
}

const statusLabels: Record<SimulatorStatus, string> = {
  en_cours: "En cours",
  termine: "Terminé",
  non_commence: "Non commencé",
}

// ════════════════════════════════════════════════════════════════
//  COMPOSANT
// ════════════════════════════════════════════════════════════════

interface SimulatorCardProps {
  simulator: Simulator
  onLaunch?: (simulator: Simulator) => void
  onDetails?: (simulator: Simulator) => void
}

export function SimulatorCard({ simulator, onLaunch, onDetails }: SimulatorCardProps) {
  const isCompleted = simulator.progress === 100
  const progressColor = isCompleted
    ? "[&>[data-slot=progress-indicator]]:bg-emerald-500"
    : "[&>[data-slot=progress-indicator]]:bg-primary"

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Top badges */}
      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            categoryStyles[simulator.categoryColor]
          )}
        >
          {simulator.category}
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            statusStyles[simulator.status]
          )}
        >
          {statusLabels[simulator.status]}
        </span>
      </div>

      {/* Title & description */}
      <h4 className="mb-1.5 text-base font-bold text-foreground line-clamp-1">
        {simulator.title}
      </h4>
      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
        {simulator.description}
      </p>

      {/* Meta info */}
      <div className="mb-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="size-4 shrink-0" />
          <span>{simulator.scenarios} scénarios</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          <span>{simulator.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="size-4 shrink-0" />
          <span>Niveau {simulator.level}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Progression</span>
          <span className="text-sm font-semibold text-foreground">
            {simulator.progress}%
          </span>
        </div>
        <Progress value={simulator.progress} className={cn("h-2", progressColor)} />
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        <button
          onClick={() => onDetails?.(simulator)}
          className="flex-1 rounded-full border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          Détails
        </button>
        <button
          onClick={() => onLaunch?.(simulator)}
          disabled={simulator.status === "non_commence"}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground transition-colors",
            simulator.status === "non_commence"
              ? "cursor-not-allowed bg-muted-foreground/30"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {simulator.status === "termine" ? "Revoir" : "Lancer"}
        </button>
      </div>
    </div>
  )
}