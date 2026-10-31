'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Zap,
  TrendingUp,
  Award,
  Target,
  Clock,
  BarChart3,
  Share2,
  ArrowRight,
} from 'lucide-react'

interface QuizResultsProps {
  simulatorTitle: string
  simulatorId: string
  score: number
  totalQuestions: number
  xpEarned: number
  timeSpent: number
  streak: number
  badge?: string
  previousScore?: number
  answers: Array<{
    questionId: string
    question: string
    userAnswer: string
    isCorrect: boolean
  }>
}

export function QuizResults({
  simulatorTitle,
  simulatorId,
  score,
  totalQuestions,
  xpEarned,
  timeSpent,
  streak,
  badge,
  previousScore = 0,
  answers,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const improvement = Math.round(percentage - previousScore)
  const avgTimePerQuestion = Math.round(timeSpent / totalQuestions)

  // Déterminer le badge basé sur le score
  const getBadgeInfo = () => {
    if (percentage >= 90) return { emoji: '⭐', label: 'Excellent!', color: 'bg-yellow-50' }
    if (percentage >= 75) return { emoji: '👏', label: 'Très bien!', color: 'bg-blue-50' }
    if (percentage >= 60) return { emoji: '💪', label: 'Bon!', color: 'bg-green-50' }
    return { emoji: '📚', label: 'Continue!', color: 'bg-orange-50' }
  }

  const badgeInfo = getBadgeInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Celebration Header */}
        <div className={`rounded-2xl ${badgeInfo.color} p-8 text-center shadow-lg`}>
          <div className="mb-4 text-6xl">{badgeInfo.emoji}</div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Félicitations!
          </h1>
          <p className="mb-2 text-lg text-muted-foreground">
            {badgeInfo.label}
          </p>
          <p className="text-foreground">
            Vous avez complété <span className="font-bold">{simulatorTitle}</span>
          </p>
        </div>

        {/* Score Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Score Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="size-5 text-yellow-500" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {score}/{totalQuestions}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/20">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="mt-2 text-center text-sm font-semibold text-foreground">
                {percentage}%
              </div>
            </CardContent>
          </Card>

          {/* XP Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="size-5 text-yellow-500" />
                XP Gagnés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">+{xpEarned}</div>
              <div className="mt-4 text-sm text-muted-foreground">
                {xpEarned > 200
                  ? 'Excellent travail!'
                  : xpEarned > 100
                    ? 'Très bien!'
                    : 'Continue!'}
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="size-5 text-red-500" />
                Série
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{streak}</div>
              <div className="mt-4 text-sm text-muted-foreground">
                Jours consécutifs
              </div>
            </CardContent>
          </Card>

          {/* Time Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="size-5 text-blue-500" />
                Temps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {avgTimePerQuestion}s par question
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analysis */}
        {improvement !== 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-green-500" />
                Votre Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Score précédent</p>
                  <p className="text-2xl font-bold text-foreground">
                    {previousScore}%
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                  <ArrowRight className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nouveau score</p>
                  <p className="text-2xl font-bold text-primary">
                    {percentage}%
                  </p>
                </div>
              </div>
              {improvement > 0 && (
                <Badge className="w-fit bg-green-100 text-green-800">
                  +{improvement}% d&apos;amélioration! 🎉
                </Badge>
              )}
              {improvement < 0 && (
                <p className="text-sm text-muted-foreground">
                  Continuez à vous entraîner pour vous améliorer!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detailed Answers */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Détail des Réponses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`rounded-lg border-l-4 p-4 ${
                    answer.isCorrect
                      ? 'border-l-green-500 bg-green-50'
                      : 'border-l-red-500 bg-red-50'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        Question {index + 1}: {answer.question}
                      </p>
                    </div>
                    <Badge
                      className={
                        answer.isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {answer.isCorrect ? '✓ Correcte' : '✗ Incorrecte'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Votre réponse: <span className="font-medium">{answer.userAnswer}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href={`/simulateurs/${simulatorId}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Retour aux détails
            </Button>
          </Link>
          <Button className="flex-1">
            <Share2 className="mr-2 size-4" />
            Partager mes résultats
          </Button>
          <Link href="/simulateurs" className="flex-1">
            <Button className="w-full">
              Autres simulateurs
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
