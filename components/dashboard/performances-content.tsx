"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp, Clock, Medal, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { getUserSessions, getSessionEvaluations } from "@/lib/api"
import type { SimulationSession, SkillEvaluation } from "@/lib/types"

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"]

export function PerformancesContent() {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<SimulationSession[]>([])
  const [evaluations, setEvaluations] = useState<SkillEvaluation[]>([])

  useEffect(() => {
    (async () => {
      try {
        const allSessions = await getUserSessions()
        const completed = allSessions.filter((s) => s.status === "completed")
        setSessions(completed)

        const allEvals: SkillEvaluation[] = []
        for (const s of completed) {
          const evals = await getSessionEvaluations(s.id)
          allEvals.push(...evals)
        }
        setEvaluations(allEvals)
      } catch (err) {
        console.error("Failed to load performance data:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const completedSessions = sessions.filter((s) => s.status === "completed")
  const avgScore =
    completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length)
      : 0

  const scoreEvolutionData = completedSessions.map((s, i) => ({
    name: `Sim ${i + 1}`,
    score: s.score || 0,
  }))

  const skillMap = new Map<string, number[]>()
  for (const ev of evaluations) {
    const arr = skillMap.get(ev.skill_name) ?? []
    arr.push(ev.score)
    skillMap.set(ev.skill_name, arr)
  }
  const skillDistribution = Array.from(skillMap.entries()).map(([name, scores]) => ({
    name,
    value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }))

  const progressionData = completedSessions.map((s, i) => ({
    month: `S${i + 1}`,
    progression: s.score || 0,
  }))

  const stats = [
    { icon: Award, label: "Score Moyen", value: `${avgScore}/100`, color: "bg-primary/10 text-primary" },
    { icon: TrendingUp, label: "Simulations Terminées", value: String(completedSessions.length), color: "bg-green-50 text-green-600" },
    { icon: Clock, label: "Compétences Évaluées", value: String(skillMap.size), color: "bg-blue-50 text-blue-600" },
    { icon: Medal, label: "Meilleur Score", value: completedSessions.length > 0 ? `${Math.max(...completedSessions.map((s) => s.score || 0))}` : "—", color: "bg-orange-50 text-orange-500" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (completedSessions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-primary p-4 sm:p-6 text-primary-foreground">
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Mes Performances</h2>
          <p className="text-sm text-primary-foreground/90">
            Suivez votre progression et visualisez vos résultats
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <TrendingUp className="size-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Aucune simulation terminée pour le moment
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Terminez une simulation pour voir vos statistiques ici
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-primary p-4 sm:p-6 text-primary-foreground">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Mes Performances</h2>
        <p className="text-sm text-primary-foreground/90">
          Suivez votre progression et visualisez vos résultats
        </p>
      </div>

      <div>
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Évolution de mes Scores par Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreEvolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition par Compétence</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillDistribution.length > 0 ? skillDistribution : [{ name: "N/A", value: 1 }]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(skillDistribution.length > 0 ? skillDistribution : [{ name: "N/A", value: 1 }]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progression des Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProgression" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Area
                type="monotone"
                dataKey="progression"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProgression)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
