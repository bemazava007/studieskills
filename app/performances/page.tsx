'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loader2 } from 'lucide-react'
import { getUserSessions, getSessionEvaluations } from '@/lib/api'
import type { SimulationSession, SkillEvaluation } from '@/lib/types'
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function PerformancesPage() {
  const [sessions, setSessions] = useState<SimulationSession[]>([])
  const [evaluations, setEvaluations] = useState<SkillEvaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const userSessions = await getUserSessions()
      const completed = userSessions.filter(s => s.status === 'completed')
      setSessions(completed)

      const allEvals: SkillEvaluation[] = []
      for (const session of completed) {
        const evals = await getSessionEvaluations(session.id)
        allEvals.push(...evals)
      }
      setEvaluations(allEvals)
    } catch (err) {
      console.error('Failed to load performances:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const completedCount = sessions.length
  const avgScore = completedCount > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedCount)
    : 0
  const totalHours = Math.round(completedCount * 0.5)

  const skillsAgg = evaluations.reduce((acc, e) => {
    if (!acc[e.skill_name]) acc[e.skill_name] = { total: 0, count: 0 }
    acc[e.skill_name].total += e.score
    acc[e.skill_name].count += 1
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const skillsData = Object.entries(skillsAgg).map(([name, { total, count }]) => ({
    name,
    value: Math.round(total / count),
  }))

  const performanceData = sessions.slice(0, 10).reverse().map((s, i) => ({
    session: `S${i + 1}`,
    score: s.score || 0,
  }))

  return (

    <DashboardShell title={"Mes Performances"} >

    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
        
          <Link href="/" className="text-sm text-primary hover:underline">Tableau de bord</Link>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Scénarios complétés', value: String(completedCount) },
                { label: 'Score moyen', value: `${avgScore}%` },
                { label: "Temps d'entraînement", value: `${totalHours}h` },
                { label: 'Évaluations', value: String(evaluations.length) },
              ].map((kpi, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
                  <h3 className="text-3xl font-bold text-foreground">{kpi.value}</h3>
                </div>
              ))}
            </div>

            {completedCount === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                <p className="text-sm font-medium text-muted-foreground">Aucune simulation terminée pour le moment</p>
                <Link href="/simulateurs" className="mt-3 text-primary hover:underline text-sm">Commencer une simulation</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-bold text-foreground mb-4">Progression du score</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="session" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-bold text-foreground mb-4">Compétences</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={skillsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {skillsData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-4">Sessions complétées</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Simulateur</th>
                          <th className="text-center py-3 px-4 text-muted-foreground font-medium">Score</th>
                          <th className="text-right py-3 px-4 text-muted-foreground font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((session) => (
                          <tr key={session.id} className="border-b border-border hover:bg-secondary transition">
                            <td className="py-3 px-4 text-foreground">
                              {(session as any).simulator?.title ?? 'Simulation'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-foreground font-semibold">{session.score}%</span>
                            </td>
                            <td className="py-3 px-4 text-right text-muted-foreground">
                              {new Date(session.completed_at ?? session.started_at).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardShell>
  )
}
