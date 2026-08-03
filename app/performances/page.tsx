'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Menu, X, Bell, Settings } from 'lucide-react'

const performanceData = [
  { month: 'Jan', score: 65, completed: 3 },
  { month: 'Fev', score: 72, completed: 5 },
  { month: 'Mar', score: 78, completed: 7 },
  { month: 'Avr', score: 85, completed: 9 },
  { month: 'Mai', score: 88, completed: 11 },
]

const skillsData = [
  { name: 'Empathie', value: 85 },
  { name: 'Clarté', value: 78 },
  { name: 'Résolution', value: 92 },
  { name: 'Écoute', value: 88 },
]

const completedScenarios = [
  {
    id: 1,
    name: 'Client Positif - Activation forfait',
    level: 1,
    score: 92,
    date: '2024-04-15',
    duration: '8:32',
  },
  {
    id: 2,
    name: 'Client Neutre - Diagnostic problème',
    level: 1,
    score: 85,
    date: '2024-04-14',
    duration: '6:45',
  },
  {
    id: 3,
    name: 'Client Mécontent - Gestion réclamation',
    level: 2,
    score: 78,
    date: '2024-04-12',
    duration: '10:22',
  },
  {
    id: 4,
    name: 'Vente produit complémentaire',
    level: 2,
    score: 88,
    date: '2024-04-10',
    duration: '7:15',
  },
]

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function PerformancesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col p-4 fixed md:relative z-40 h-screen`}>
        <Link href="/" className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-foreground">StudieSkills</span>}
        </Link>

        <nav className="space-y-2 flex-1">
          {[
            { label: 'Tableau de bord', href: '/' },
            { label: 'Mes Simulateurs', href: '/' },
            { label: 'Mes Performances', href: '/performances', active: true },
            { label: 'Opportunités', href: '/opportunities' },
            { label: 'Mes Certificats', href: '/' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                item.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <div className="w-5 h-5 bg-current rounded" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground md:hidden"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Mes Performances</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Scénarios complétés', value: '47', subtext: '+12 ce mois' },
                { label: 'Score moyen', value: '85%', subtext: '+5% ce mois' },
                { label: 'Temps d\'entraînement', value: '12h 45m', subtext: 'Ce mois' },
                { label: 'Certificats obtenus', value: '2', subtext: 'Expert en cours' },
              ].map((kpi, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
                  <h3 className="text-3xl font-bold text-foreground mb-1">{kpi.value}</h3>
                  <p className="text-xs text-primary">{kpi.subtext}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Trend */}
              <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold text-foreground mb-4">Progression du score</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Skills Pie */}
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
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scenarios Completed Table */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4">Scénarios complétés</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Scénario</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Niveau</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Score</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Durée</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedScenarios.map(scenario => (
                      <tr key={scenario.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="py-3 px-4 text-foreground">{scenario.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {scenario.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-foreground font-semibold">{scenario.score}%</span>
                            <span className={scenario.score >= 85 ? 'text-green-500' : scenario.score >= 70 ? 'text-orange-500' : 'text-red-500'}>
                              ●
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-muted-foreground">{scenario.duration}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {new Date(scenario.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
