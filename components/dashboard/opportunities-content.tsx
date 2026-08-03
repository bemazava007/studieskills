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
  {
    title: "Responsable Marketing Digital",
    company: "Digital Experts",
    location: "Toulouse",
    type: "CDI",
    salary: "2200-2600 EUR/mois",
    description:
      "Pilotez les stratégies marketing digitales, gérez les campagnes et optimisez la présence en ligne.",
  },
  {
    title: "Chef de Projet Commercial",
    company: "Innovation Corp",
    location: "Nice",
    type: "Alternance",
    salary: "1000-1300 EUR/mois",
    description:
      "Coordonnez les projets commerciaux, assurez le suivi client et participez au développement des partenariats.",
  },
]

export function OpportunitiesContent() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-primary p-4 sm:p-6 text-primary-foreground">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Opportunites Professionnelles</h2>
        <p className="text-sm text-primary-foreground/90">
          Explorez les partenariats et offres qui vous correspondent
        </p>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Offres Disponibles</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="gap-0 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-card-foreground">{opportunities.length}</p>
                <p className="truncate text-xs text-muted-foreground">Opportunites</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-0 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <MapPin className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-card-foreground">6</p>
                <p className="truncate text-xs text-muted-foreground">Villes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-0 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <Badge className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-card-foreground">3</p>
                <p className="truncate text-xs text-muted-foreground">Stages</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-0 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <Briefcase className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-card-foreground">2</p>
                <p className="truncate text-xs text-muted-foreground">CDI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Opportunities List */}
      <Card className="gap-0">
        <CardHeader>
          <div>
            <CardTitle className="text-base">Offres d&apos;Emploi</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Partenaires qui recrutent
            </p>
          </div>
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
                      Plus d&apos;infos
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                      <Share2 className="size-3.5" />
                      Partager
                    </Button>
                    <Button size="sm" className="ml-auto h-8 text-xs">
                      Je suis interesse
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
