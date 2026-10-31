import { BookOpen, Layers, Award, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: BookOpen,
    label: "Cours Suivis",
    value: "12",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Layers,
    label: "Modules",
    value: "34",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Award,
    label: "Certifications",
    value: "3",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Clock,
    label: "Heures",
    value: "128",
    color: "bg-chart-4/10 text-chart-4",
  },
]

export function QuickStats() {
  return (
    <section aria-label="Statistiques Rapides">
      <h3 className="mb-4 text-base font-semibold text-foreground">Statistiques Rapides</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-0 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
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
  )
}
