'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Heart, Zap, Trophy } from 'lucide-react'
import { QuizResults } from './quiz-results'

interface Question {
  id: string
  text: string
  options: string[]
  correct: number
  explanation?: string
}

interface GamifiedQuizProps {
  questions: Question[]
  title: string
  simulatorId?: string
  onComplete?: (score: number, xp: number) => void
}

interface AnswerRecord {
  questionId: string
  question: string
  userAnswer: string
  isCorrect: boolean
}

export function GamifiedQuiz({
  questions,
  title,
  simulatorId = '1',
  onComplete,
}: GamifiedQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [completed, setCompleted] = useState(false)
  const [startTime] = useState(Date.now())
  const [timeSpent, setTimeSpent] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isCorrect = answered && selectedAnswer === currentQuestion.correct

  const handleSelectAnswer = (index: number) => {
    if (!answered) {
      setSelectedAnswer(index)
      setAnswered(true)

      const isCorrect = index === currentQuestion.correct
      const userAnswer = currentQuestion.options[index]

      setAnswers([
        ...answers,
        {
          questionId: currentQuestion.id,
          question: currentQuestion.text,
          userAnswer,
          isCorrect,
        },
      ])

      if (isCorrect) {
        setScore(score + 1)
        setXp(xp + 10)
      } else {
        setHearts(hearts - 1)
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      const finalTime = Math.floor((Date.now() - startTime) / 1000)
      setTimeSpent(finalTime)
      setCompleted(true)
      if (onComplete) {
        onComplete(score, xp)
      }
    }
  }

  if (hearts <= 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">💔</div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">Oups! Game Over</h2>
          <p className="mb-6 text-muted-foreground">
            Vous avez épuisé tous vos cœurs. Réessayez!
          </p>
          <Button onClick={() => window.location.reload()}>
            Recommencer
          </Button>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="p-0">
        <QuizResults
          simulatorTitle={title}
          simulatorId={simulatorId}
          score={score}
          totalQuestions={questions.length}
          xpEarned={xp}
          timeSpent={timeSpent}
          streak={3}
          previousScore={65}
          answers={answers}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header Stats */}
        <div className="mb-8 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`size-6 ${
                  i < hearts ? 'fill-red-500 text-red-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xl font-bold text-yellow-500">
            <Zap className="size-5" />
            {xp} XP
          </div>
          <div className="text-lg font-semibold text-primary">
            {score}/{questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Question {currentIndex + 1}/{questions.length}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={answered}
                  className={`w-full rounded-xl border-2 p-4 text-left font-medium transition-all ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : answered && index === currentQuestion.correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white hover:border-primary hover:bg-primary/5'
                  } ${
                    answered && selectedAnswer === index
                      ? 'pointer-events-none'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {answered && selectedAnswer === index && (
                      <>
                        {isCorrect ? (
                          <CheckCircle2 className="size-5 flex-shrink-0 text-green-500" />
                        ) : (
                          <XCircle className="size-5 flex-shrink-0 text-red-500" />
                        )}
                      </>
                    )}
                    {answered &&
                      index === currentQuestion.correct &&
                      selectedAnswer !== index && (
                        <CheckCircle2 className="size-5 flex-shrink-0 text-green-500" />
                      )}
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {answered && currentQuestion.explanation && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">💡 Explication:</p>
                <p className="mt-2">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Button */}
        {answered && (
          <Button
            onClick={handleNext}
            className="w-full py-6 text-lg font-semibold"
            size="lg"
          >
            {currentIndex < questions.length - 1 ? 'Suivant' : 'Voir les résultats'}
          </Button>
        )}
      </div>
    </div>
  )
}
