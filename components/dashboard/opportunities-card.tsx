"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, ChevronDown, ChevronUp, Share2 } from "lucide-react"

const opportunities = [
  {
    title: "Assistant Commercial",
    company: "Groupe LMN",
    location: "Paris",
    type: "Stage",
    salary: "800-1000 EUR/mois",
    description:
      "Vous participerez aux activites commerciales du groupe, incluant la prospection client, le suivi des ventes et la preparation des offres commerciales.",
  },
  {
    title: "Assistant Commercial",
    company: "Tech Solutions",
    location: "Lyon",
    type: "Alternance",
    salary: "900-1200 EUR/mois",
    description:
      "Rejoignez notre equipe dynamique pour assurer le developpement commercial de nos solutions technologiques aupres des PME.",
  },
  {
    title: "Assistant Commercial",
    company: "RetailCorp",
    location: "Bordeaux",
    type: "CDI",
    salary: "1800-2200 EUR/mois",
    description:
      "En charge du portefeuille clients existants et du developpement de nouveaux partenariats commerciaux.",
  },
  {
    title: "Assistant Communication",
    company: "MediaPlus",
    location: "Marseille",
    type: "Stage",
    salary: "700-900 EUR/mois",
    description:
      "Participez a la creation de contenus et a la gestion des reseaux sociaux pour nos clients.",
  },
]

export function OpportunitiesCard() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <Card className="gap-0">
      <CardHeader>
        <div>
          <CardTitle className="text-base">{"Opportunites Professionnelles"}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {"Partenariats qui recrutent"}
          </p>
        </div>
        <CardAction>
          <Button size="sm">Voir Plus</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {opportunities.map((opp, i) => {
            const isExpanded = expandedIndex === i
            return (
              <div
                key={i}
                className="rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Briefcase className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-card-foreground">{opp.title}</h4>
                      <Badge variant="secondary" className="text-xs">{opp.type}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{opp.company}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {opp.location}
                      </span>
                      <span>{opp.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? "mt-3 max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="rounded-md bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                    {opp.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                    {"Plus d'infos"}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    <Share2 className="size-3.5" />
                    Partager
                  </Button>
                  <Button size="sm" className="ml-auto h-8 text-xs">
                    {"Je suis interesse"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
