import { Monitor, TrendingUp, Clock, Award } from "lucide-react"

const stats = [
  {
    label: "Simulateurs Suivis",
    value: "4",
    icon: Monitor,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Progression Moyenne",
    value: "65%",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Heures de Simulation",
    value: "30h",
    icon: Clock,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Certifications Obtenues",
    value: "2",
    icon: Award,
    color: "bg-primary/10 text-primary",
  },
]

export function StatsSection() {
  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {"Impact en un coup d'oeil"}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${stat.color}`}
            >
              <stat.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
              <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
