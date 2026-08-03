import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Info, AlertTriangle, Award } from "lucide-react"

const notifications = [
  {
    icon: CheckCircle,
    iconColor: "text-accent",
    title: "Nouveau module disponible",
    description: "Le module de Droit des affaires est maintenant accessible.",
    time: "Il y a 2h",
  },
  {
    icon: Info,
    iconColor: "text-primary",
    title: "Examen programme",
    description: "Votre examen de Marketing est prevu le 15 mars.",
    time: "Il y a 5h",
  },
  {
    icon: Award,
    iconColor: "text-chart-4",
    title: "Certification disponible",
    description: "Vous pouvez maintenant passer la certification en gestion de projet.",
    time: "Hier",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-destructive",
    title: "Delai approchant",
    description: "Le rendu du projet de comptabilite est dans 3 jours.",
    time: "Hier",
  },
]

export function NotificationsCard() {
  return (
    <Card className="gap-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Notifications</CardTitle>
        <p className="text-xs text-muted-foreground">{"Restez informe de vos activites."}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {notifications.map((notif, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <notif.icon className={`mt-0.5 size-5 shrink-0 ${notif.iconColor}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-card-foreground">{notif.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{notif.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{notif.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
