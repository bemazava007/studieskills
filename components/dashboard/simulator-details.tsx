'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, BarChart3, CheckCircle2, Target, Zap } from 'lucide-react'
import { SimulatorProgress } from './simulator-progress'

interface SimulatorDetailsProps {
  id: string
  title: string
  description: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  duration: number
  participants: number
  rating: number
  reviews: number
  progression: number
  questionsCount: number
  category: string
  detailedDescription?: string
  learningObjectives?: string[]
  skillsDeveloped?: string[]
  scenarios?: string[]
}

export function SimulatorDetails({
  id,
  title,
  description,
  level,
  duration,
  participants,
  rating,
  reviews,
  progression,
  questionsCount,
  category,
  detailedDescription = 'Dans ce simulateur immersif, vous serez confronté à diverses situations de service client, allant des plaintes mineures aux crises majeures. Vous apprendrez à écouter attentivement, à identifier les besoins sous-jacents des clients, et à proposer des solutions créatives qui satisfont toutes les parties. Le simulateur utilise l\'intelligence artificielle pour adapter les réponses des clients en fonction de vos actions, créant ainsi une expérience d\'apprentissage dynamique et personnalisée.',
  learningObjectives = [
    'Maîtriser les techniques d\'écoute active',
    'Développer l\'empathie et la patience',
    'Apprendre à désamorcer les situations tendues',
    'Proposer des solutions créatives et satisfaisantes',
    'Gérer le stress dans des situations difficiles'
  ],
  skillsDeveloped = ['Communication', 'Empathie', 'Résolution de problèmes', 'Gestion du stress'],
  scenarios = ['Service Client', 'Gestion des Réclamations', 'Communication', 'Résolution de Conflits']
}: SimulatorDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'badges' | 'stats'>('overview')

  const levelColors: Record<string, string> = {
    'Débutant': 'bg-green-100 text-green-800',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800',
    'Avancé': 'bg-red-100 text-red-800',
  }

  // Mock progress data
  const progressData = [
    { date: 'Lun', score: 65 },
    { date: 'Mar', score: 70 },
    { date: 'Mer', score: 68 },
    { date: 'Jeu', score: 75 },
    { date: 'Ven', score: 80 },
    { date: 'Sam', score: 78 },
    { date: 'Dim', score: 85 },
  ]

  const categoryStats = [
    { name: 'Communication', value: 85, percentage: 85 },
    { name: 'Résolution', value: 75, percentage: 75 },
    { name: 'Gestion', value: 70, percentage: 70 },
    { name: 'Écoute', value: 90, percentage: 90 },
  ]

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'scenarios', label: 'Scénarios' },
    { id: 'badges', label: 'Badges' },
    { id: 'stats', label: 'Statistiques' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Link href="/simulateurs" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" />
        Retour aux simulateurs
      </Link>

      {/* Blue Header Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-primary-foreground/90 max-w-2xl">{description}</p>
          </div>
          <Link href={`/simulateurs/${id}/lancer`}>
            <Button size="lg" variant="secondary" className="gap-2 shrink-0">
              <Play className="size-5" />
              LANCER
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Progression Globale</h2>
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm font-bold">{progression}%</span>
            </div>
            <Progress value={progression} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-2">
                  <CheckCircle2 className="size-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Réussis</div>
                  <div className="font-bold">4/5</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                  <div className="font-bold">{questionsCount}/50</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <Clock className="size-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Temps passé</div>
                  <div className="font-bold">3h 20min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`relative whitespace-nowrap px-2 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Description Détaillée */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5" />
                Description Détaillée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{detailedDescription}</p>
            </CardContent>
          </Card>

          {/* Objectifs d'Apprentissage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Objectifs d&apos;Apprentissage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-pink-100 p-1.5 flex-shrink-0">
                      <CheckCircle2 className="size-4 text-pink-600" />
                    </div>
                    <p className="text-foreground">{objective}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compétences Développées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-5" />
                Compétences Développées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillsDeveloped.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-600 text-white hover:bg-slate-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <Card>
          <CardHeader>
            <CardTitle>Scénarios Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {scenarios.map((scenario, index) => (
                <div key={index} className="rounded-lg border border-border p-4 hover:bg-muted transition-colors">
                  <h3 className="font-semibold text-foreground">{scenario}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Explorez différents scénarios et cas d&apos;usage pratiques
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'badges' && (
        <Card>
          <CardHeader>
            <CardTitle>Badges Déverrouillables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="size-12 mx-auto mb-4 opacity-50" />
              <p>Complétez le quiz avec succès pour déverrouiller des badges exclusifs!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'stats' && (
        <SimulatorProgress
          simulatorTitle={title}
          totalAttempts={5}
          bestScore={85}
          averageScore={Math.round(progression)}
          totalXpEarned={450}
          progressData={progressData}
          categoryStats={categoryStats}
        />
      )}
    </div>
  )
}
