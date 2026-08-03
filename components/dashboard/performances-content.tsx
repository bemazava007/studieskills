"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp, Clock, Medal } from "lucide-react"
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
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

// Data for bar chart - Evolution des scores
const scoreEvolutionData = [
  { name: "Sim 1", score: 7.5 },
  { name: "Sim 2", score: 8.2 },
  { name: "Sim 3", score: 6.8 },
  { name: "Sim 4", score: 8.9 },
  { name: "Sim 5", score: 7.2 },
  { name: "Sim 6", score: 9.1 },
  { name: "Sim 7", score: 8.4 },
]

// Data for line chart - Monthly progression
const monthlyProgressionData = [
  { month: "Jan", progression: 3.2 },
  { month: "Fév", progression: 4.8 },
  { month: "Mar", progression: 3.5 },
  { month: "Avr", progression: 5.2 },
  { month: "Mai", progression: 4.6 },
  { month: "Jun", progression: 6.8 },
  { month: "Jul", progression: 5.4 },
  { month: "Aou", progression: 7.2 },
]

// Data for pie chart - Sector distribution
const sectorData = [
  { name: "Commerce", value: 35 },
  { name: "Marketing", value: 30 },
  { name: "Service Client", value: 25 },
  { name: "Autres", value: 10 },
]

// Colors for pie chart
const COLORS = ["#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]

const stats = [
  {
    icon: Award,
    label: "Score Moyen",
    value: "8.5/10",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    label: "Simulateurs Termines",
    value: "3/5",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Clock,
    label: "Temps Moyen",
    value: "24h",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Medal,
    label: "Classement",
    value: "#47",
    color: "bg-chart-4/10 text-chart-4",
  },
]

export function PerformancesContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-primary p-4 sm:p-6 text-primary-foreground">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Mes Performances</h2>
        <p className="text-sm text-primary-foreground/90">
          Consolidez votre progression et visualisez vos performances
        </p>
      </div>

      {/* Quick Stats */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart - Evolution of Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolution de mes Scores par Simulateur</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreEvolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 10]} />
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

        {/* Pie Chart - Sector Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Repartition par Secteur</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Monthly Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progression Mensuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyProgressionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProgression" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
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
