'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Lock, CheckCircle2, Zap, HelpCircle } from 'lucide-react'

interface Level {
  id: number
  scenarios: number
  completed: boolean
  currentLevel?: boolean
}

interface LevelProgressionProps {
  simulatorTitle: string
  simulatorId: string
  totalLevels?: number
  currentLevelId?: number
}

export function LevelProgression({
  simulatorTitle,
  simulatorId,
  totalLevels = 5,
  currentLevelId = 1,
}: LevelProgressionProps) {
  const [selectedLevel, setSelectedLevel] = useState(currentLevelId)

  const levels: Level[] = Array.from({ length: totalLevels }, (_, i) => ({
    id: i + 1,
    scenarios: 5,
    completed: i < currentLevelId - 1,
    currentLevel: i === currentLevelId - 1,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{simulatorTitle}</h1>
              <p className="text-primary-foreground/90">
                {totalLevels} Niveaux, avec 5 Scénarios chacuns
              </p>
            </div>
            <Button variant="secondary" className="gap-2">
              <BookOpen className="size-4" />
              GUIDE
            </Button>
          </div>
          <p className="text-primary-foreground/90">
            Accomplir ces scénarios pour décrocher les étapes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Level Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-xl bg-white p-12 shadow-lg">
              {/* SVG Visualization */}
              <svg
                viewBox="0 0 600 700"
                className="mx-auto w-full max-w-2xl"
              >
                {/* Connection Lines */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#0284c7" />
                  </marker>
                </defs>

                {/* Start Node */}
                <circle cx="300" cy="80" r="40" fill="#0284c7" />
                <text
                  x="300"
                  y="90"
                  textAnchor="middle"
                  fill="white"
                  className="font-bold text-lg"
                >
                  ★
                </text>
                <text
                  x="300"
                  y="135"
                  textAnchor="middle"
                  fill="#0284c7"
                  className="font-bold"
                >
                  COMMENCER
                </text>

                {/* Connecting Lines to Level 1 */}
                <line
                  x1="300"
                  y1="120"
                  x2="150"
                  y2="200"
                  stroke="#0284c7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line
                  x1="300"
                  y1="120"
                  x2="300"
                  y2="200"
                  stroke="#0284c7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line
                  x1="300"
                  y1="120"
                  x2="450"
                  y2="200"
                  stroke="#0284c7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />

                {/* Level 1 Nodes */}
                <circle
                  cx="150"
                  cy="240"
                  r="35"
                  fill="#0284c7"
                  className="cursor-pointer hover:opacity-80"
                />
                <text x="150" y="250" textAnchor="middle" fill="white" className="text-xl">
                  ?
                </text>

                <circle
                  cx="300"
                  cy="240"
                  r="35"
                  fill="#0284c7"
                  className="cursor-pointer hover:opacity-80"
                />
                <text x="300" y="250" textAnchor="middle" fill="white" className="text-xl">
                  👤
                </text>

                <circle
                  cx="450"
                  cy="240"
                  r="35"
                  fill="#0284c7"
                  className="cursor-pointer hover:opacity-80"
                />
                <text x="450" y="250" textAnchor="middle" fill="white" className="text-xl">
                  👥
                </text>

                {/* Connecting Lines to Level 2 */}
                <line
                  x1="150"
                  y1="275"
                  x2="200"
                  y2="340"
                  stroke="#0284c7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line
                  x1="300"
                  y1="275"
                  x2="300"
                  y2="340"
                  stroke="#0284c7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line
                  x1="450"
                  y1="275"
                  x2="400"
                  y2="340"
                  stroke="#0284c7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />

                {/* Level 2 Nodes */}
                <circle
                  cx="200"
                  cy="380"
                  r="35"
                  fill="#0284c7"
                  className="cursor-pointer hover:opacity-80"
                />
                <text x="200" y="390" textAnchor="middle" fill="white" className="text-xl">
                  🤖
                </text>

                <circle
                  cx="300"
                  cy="380"
                  r="35"
                  fill="#0284c7"
                  className="cursor-pointer hover:opacity-80"
                />
                <text x="300" y="390" textAnchor="middle" fill="white" className="text-xl">
                  👥
                </text>

                <circle
                  cx="400"
                  cy="380"
                  r="35"
                  fill="#0284c7"
                  className="cursor-pointer hover:opacity-80"
                />
                <text x="400" y="390" textAnchor="middle" fill="white" className="text-xl">
                  👥
                </text>

                {/* Level Label */}
                <text
                  x="300"
                  y="460"
                  textAnchor="middle"
                  fill="#6b7280"
                  className="font-bold text-lg"
                >
                  Niveau 2
                </text>

                {/* Bottom Navigation */}
                <text
                  x="50"
                  y="650"
                  fill="#0284c7"
                  className="text-sm font-semibold cursor-pointer hover:underline"
                >
                  ← Précédent
                </text>
                <text
                  x="300"
                  y="665"
                  textAnchor="middle"
                  fill="#6b7280"
                  className="text-xs"
                >
                  Niveau 2 / 5
                </text>
                <text
                  x="550"
                  y="650"
                  textAnchor="end"
                  fill="#0284c7"
                  className="text-sm font-semibold cursor-pointer hover:underline"
                >
                  Avancer →
                </text>
              </svg>

              {/* Start Button */}
              <div className="mt-8 flex justify-center">
                <Link href={`/simulateurs/${simulatorId}/quiz/1`}>
                  <Button size="lg" className="gap-2 px-8">
                    <CheckCircle2 className="size-5" />
                    COMMENCER
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Free Trial Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5" />
                  Essaie studieskills gratuitement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">
                  Sans publicité, 100% personnalisé, et un accès illimité aux Data Legendaires - l&apos;entraînement haut de gamme, c&apos;est maintenant.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Essayer le Niveau 1 gratuitement
                </Button>
              </CardContent>
            </Card>

            {/* Unlock Levels Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Déverrouiller les Niveaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lock className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">3 niveaux à conquérir pour</p>
                    <p className="text-xs text-muted-foreground">entrer dans l&apos;arène professionnelle</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Challenge Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge du Jour</CardTitle>
                <a href="#" className="text-xs text-primary hover:underline">AFFICHER TOUT</a>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🔥</div>
                  <div>
                    <p className="font-semibold">Série de 3 jours</p>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-2 w-8 rounded-full ${
                            i <= 3 ? 'bg-amber-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">3 / 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
