'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Calendar,
  Zap,
  Target,
  Award,
  Clock,
} from 'lucide-react'

interface ProgressData {
  date: string
  score: number
}

interface SimulatorProgressProps {
  simulatorTitle: string
  totalAttempts: number
  bestScore: number
  averageScore: number
  totalXpEarned: number
  progressData: ProgressData[]
  categoryStats: Array<{
    name: string
    value: number
    percentage: number
  }>
}

const COLORS = ['#0284c7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export function SimulatorProgress({
  simulatorTitle,
  totalAttempts,
  bestScore,
  averageScore,
  totalXpEarned,
  progressData,
  categoryStats,
}: SimulatorProgressProps) {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Target className="size-4 text-primary" />
              Meilleur Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{bestScore}%</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Votre record personnel
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="size-4 text-blue-500" />
              Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{averageScore}%</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Moyenne sur {totalAttempts} tentatives
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Zap className="size-4 text-yellow-500" />
              XP Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {totalXpEarned}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Gagnés au total
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="size-4 text-green-500" />
              Tentatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {totalAttempts}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Quiz complétés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progression Chart */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Évolution de vos Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ fill: '#0284c7', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Categories and Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Performance */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Performances par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryStats.map((cat, index) => (
              <div key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <Badge variant="outline">{cat.percentage}%</Badge>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Distribution des Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {averageScore >= 80 ? (
            <p className="text-blue-900">
              Excellent travail! Continuez à maintenir ce niveau et essayez les
              simulateurs plus difficiles.
            </p>
          ) : averageScore >= 60 ? (
            <p className="text-blue-900">
              Vous êtes sur la bonne voie! Concentrez-vous sur les catégories
              où vous avez des difficultés.
            </p>
          ) : (
            <p className="text-blue-900">
              Continuez vos efforts. Pratiquez régulièrement et révisez les
              concepts difficiles.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
