"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, Medal, Star, Lock, Share2, Calendar, Trophy, Target, Zap, Flame, Layers, Crown, Loader2 } from "lucide-react"
import { getCertifications, getUserSessions } from "@/lib/api"
import type { Certification, SimulationSession } from "@/lib/types"

interface BadgeItem {
  id: string
  title: string
  description: string
  icon: typeof Medal
  date?: string
  obtained: boolean
  progression?: number
}

const earnedBadges: BadgeItem[] = [
  {
    id: "1",
    title: "Premier Pas",
    description: "Completez votre premiere simulation",
    icon: Trophy,
    date: "15 Jan 2025",
    obtained: true,
  },
  {
    id: "2",
    title: "Maitrise Technique",
    description: "Obtenez 80% ou plus dans un simulateur technique",
    icon: Target,
    date: "01 Jan 2025",
    obtained: true,
  },
  {
    id: "3",
    title: "Resolution Rapide",
    description: "Completez 5 simulations en moins de 10 minutes",
    icon: Zap,
    date: "13 Jan 2025",
    obtained: true,
  },
]

const lockedBadges: BadgeItem[] = [
  {
    id: "4",
    title: "Perfectionniste",
    description: "Obtenez 100% dans 5 simulateurs differents",
    icon: Crown,
    obtained: false,
    progression: 60,
  },
  {
    id: "5",
    title: "Marathon",
    description: "Completez 30 heures de simulation",
    icon: Flame,
    obtained: false,
    progression: 80,
  },
  {
    id: "6",
    title: "Expert Industriel",
    description: "Completez tous les simulateurs industriels",
    icon: Star,
    obtained: false,
    progression: 40,
  },
  {
    id: "7",
    title: "Polyvalent",
    description: "Completez au moins un simulateur de chaque categorie",
    icon: Layers,
    obtained: false,
    progression: 70,
  },
  {
    id: "8",
    title: "Serie Gagnante",
    description: "Completez 10 simulations consecutives avec succes",
    icon: Medal,
    obtained: false,
    progression: 25,
  },
]

interface CertificationItem {
  id: string
  title: string
  issuer: string
  date: string
  status: "obtained" | "in_progress"
  progression?: number
}

const certifications: CertificationItem[] = [
  {
    id: "c1",
    title: "Certification Service Client",
    issuer: "StudieSkills Academy",
    date: "15 Fevrier 2025",
    status: "obtained",
  },
  {
    id: "c2",
    title: "Certification Vente & Negociation",
    issuer: "StudieSkills Academy",
    date: "28 Janvier 2025",
    status: "obtained",
  },
  {
    id: "c3",
    title: "Certification Maintenance IT",
    issuer: "StudieSkills Academy",
    date: "",
    status: "in_progress",
    progression: 65,
  },
  {
    id: "c4",
    title: "Certification Communication Professionnelle",
    issuer: "StudieSkills Academy",
    date: "",
    status: "in_progress",
    progression: 30,
  },
]

const tabs = ["Badges", "Certifications"] as const

export function BadgesCertificationsContent() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Badges")
  const [certs, setCerts] = useState<Certification[]>([])
  const [completedSessions, setCompletedSessions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [certData, sessions] = await Promise.all([getCertifications(), getUserSessions()])
      setCerts(certData)
      setCompletedSessions(sessions.filter(s => s.status === "completed").length)
    } catch (err) {
      console.error("Failed to load certifications:", err)
    } finally {
      setLoading(false)
    }
  }

  const dynamicStats = [
    { icon: Medal, value: String(completedSessions >= 1 ? 3 : 0), label: "Badges Obtenus", color: "bg-primary/10 text-primary" },
    { icon: Award, value: String(certs.length), label: "Certifications", color: "bg-green-50 text-green-600" },
    { icon: Star, value: String(completedSessions * 10), label: "Points Totaux", color: "bg-orange-50 text-orange-500" },
    { icon: Lock, value: "10", label: "A Debloquer", color: "bg-blue-50 text-blue-600" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      {/* Welcome Banner */}
      <div className="rounded-xl bg-primary p-5 text-primary-foreground sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl text-balance">
          {"Badges & Certifications"}
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-primary-foreground/80">
          {"Suivez vos accomplissements et validez vos competences professionnelles."}
        </p>
      </div>

      {/* Stats */}
      <section aria-label="Impact en un coup d'oeil">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {"Impact en un coup d'oeil"}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {dynamicStats.map((stat) => (
            <Card key={stat.label} className="gap-0 py-4">
              <CardContent className="flex items-center gap-3 px-4">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${stat.color}`}
                >
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

      {/* Tabs */}
      <section>
        <div className="mb-5 flex items-center border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "Badges" && <BadgesTab />}
        {activeTab === "Certifications" && <CertificationsTab certifications={certs} />}
      </section>
    </>
  )
}

/* ======================== Badges Tab ======================== */

function BadgesTab() {
  return (
    <div className="flex flex-col gap-8">
      {/* Earned */}
      <div>
        <h3 className="mb-1 text-lg font-bold text-foreground">
          {"Badges Obtenus ("}
          {earnedBadges.length}
          {")"}
        </h3>
        <p className="mb-5 text-sm text-muted-foreground">
          Vos accomplissements debloques
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {earnedBadges.map((badge) => (
            <EarnedBadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* Locked */}
      <div>
        <h3 className="mb-1 text-lg font-bold text-foreground">
          {"Badges a Debloquer ("}
          {lockedBadges.length}
          {")"}
        </h3>
        <p className="mb-5 text-sm text-muted-foreground">
          Continuez votre progression pour debloquer ces badges
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lockedBadges.map((badge) => (
            <LockedBadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EarnedBadgeCard({ badge }: { badge: BadgeItem }) {
  const Icon = badge.icon
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardContent className="flex flex-col items-center px-5 py-6 text-center">
        <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-amber-100">
          <Icon className="size-8 text-amber-500" />
        </div>
        <h4 className="text-sm font-bold text-card-foreground">{badge.title}</h4>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {badge.description}
        </p>
        {badge.date && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{badge.date}</span>
          </div>
        )}
        <Button
          size="sm"
          className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Share2 className="mr-1.5 size-3.5" />
          Partager
        </Button>
      </CardContent>
    </Card>
  )
}

function LockedBadgeCard({ badge }: { badge: BadgeItem }) {
  const Icon = badge.icon
  return (
    <Card className="gap-0 overflow-hidden border-dashed py-0">
      <CardContent className="flex flex-col items-center px-5 py-6 text-center">
        <div className="relative mb-3 flex size-16 items-center justify-center rounded-full bg-muted">
          <Icon className="size-8 text-muted-foreground/50" />
          <div className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-muted-foreground/20">
            <Lock className="size-3 text-muted-foreground" />
          </div>
        </div>
        <h4 className="text-sm font-bold text-card-foreground">{badge.title}</h4>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {badge.description}
        </p>
        <div className="mt-4 w-full">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Progression</span>
            <span className="text-xs font-semibold text-foreground">
              {badge.progression}%
            </span>
          </div>
          <Progress value={badge.progression} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

/* ======================== Certifications Tab ======================== */

function CertificationsTab({ certifications }: { certifications: Certification[] }) {
  if (certifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <Award className="size-12 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Aucune certification obtenue pour le moment
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Completez des simulations pour gagner des certifications
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-1 text-lg font-bold text-foreground">
          {"Certifications Obtenues ("}
          {certifications.length}
          {")"}
        </h3>
        <p className="mb-5 text-sm text-muted-foreground">
          Vos certifications validees
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <Card key={cert.id} className="gap-0 py-0 overflow-hidden">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <Award className="size-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-card-foreground">
                    {cert.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{cert.issuer}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>{"Obtenue le "}{new Date(cert.issued_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <Star className="size-3.5 text-orange-500" />
                    <span className="font-semibold text-foreground">{cert.score}/100</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Share2 className="mr-1 size-3" />
                      Partager
                    </Button>
                    <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                      Telecharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
