import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Star, Zap } from "lucide-react"

const badges = [
  {
    icon: Award,
    label: "Assidu",
    description: "Presente tous les jours",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Star,
    label: "Performant",
    description: "Note > 16/20",
    bgColor: "bg-chart-4/10",
    iconColor: "text-chart-4",
  },
  {
    icon: Zap,
    label: "Expert",
    description: "Modules completes",
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
]

export function BadgesCard() {
  return (
    <Card className="gap-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{"Badges & Recompenses"}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {"Gagnez des badges en completant les objectifs."}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${badge.bgColor}`}>
                <badge.icon className={`size-5 ${badge.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground">{badge.label}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
