'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  options: string[]
  correct: number
  explanation?: string
}

interface SimulatorForm {
  title: string
  description: string
  category: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  duration: number
  questions: Question[]
}

export function SimulatorCreator() {
  const [form, setForm] = useState<SimulatorForm>({
    title: '',
    description: '',
    category: '',
    level: 'Débutant',
    duration: 30,
    questions: [
      {
        id: '1',
        text: '',
        options: ['', '', '', ''],
        correct: 0,
      },
    ],
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = form.questions[currentQuestionIndex]

  const handleFormChange = (
    field: keyof SimulatorForm,
    value: any
  ) => {
    setForm({ ...form, [field]: value })
  }

  const handleQuestionChange = (field: string, value: any) => {
    const updated = [...form.questions]
    if (field === 'text') {
      updated[currentQuestionIndex].text = value
    } else if (field === 'correct') {
      updated[currentQuestionIndex].correct = value
    } else if (field === 'explanation') {
      updated[currentQuestionIndex].explanation = value
    }
    setForm({ ...form, questions: updated })
  }

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...form.questions]
    updated[currentQuestionIndex].options[index] = value
    setForm({ ...form, questions: updated })
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: String(form.questions.length + 1),
      text: '',
      options: ['', '', '', ''],
      correct: 0,
    }
    setForm({
      ...form,
      questions: [...form.questions, newQuestion],
    })
    setCurrentQuestionIndex(form.questions.length)
  }

  const removeQuestion = (index: number) => {
    if (form.questions.length > 1) {
      const updated = form.questions.filter((_, i) => i !== index)
      setForm({ ...form, questions: updated })
      setCurrentQuestionIndex(Math.max(0, index - 1))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Simulateur créé:', form)
    // Handle submission to API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/simulateurs" className="mb-2 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="size-4" />
            Retour aux simulateurs
          </Link>
          <h1 className="text-3xl font-bold">Créer un nouveau simulateur</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Titre du simulateur</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                placeholder="Ex: Call Center Orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                placeholder="Décrivez le simulateur..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium">Catégorie</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                  placeholder="Ex: Centre d'appels"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Niveau</label>
                <select
                  value={form.level}
                  onChange={(e) =>
                    handleFormChange(
                      'level',
                      e.target.value as
                        | 'Débutant'
                        | 'Intermédiaire'
                        | 'Avancé'
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                >
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Durée (minutes)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                  min="5"
                  max="180"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Questions List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions ({form.questions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {form.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-full rounded-lg p-3 text-left text-sm font-medium transition-all ${
                      currentQuestionIndex === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Q{index + 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeQuestion(index)
                        }}
                        className="rounded p-1 hover:bg-destructive/20"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={addQuestion}
                >
                  <Plus className="size-4" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Question Editor */}
          <div className="md:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Énoncé</label>
                  <textarea
                    value={currentQuestion.text}
                    onChange={(e) => handleQuestionChange('text', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                    placeholder="Posez votre question..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Options</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="radio"
                        name="correct"
                        value={index}
                        checked={currentQuestion.correct === index}
                        onChange={(e) =>
                          handleQuestionChange('correct', parseInt(e.target.value))
                        }
                        className="mt-2"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium">Explication (optionnel)</label>
                  <textarea
                    value={currentQuestion.explanation || ''}
                    onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
                    placeholder="Expliquez la réponse correcte..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/simulateurs" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Annuler
            </Button>
          </Link>
          <Button type="submit" className="flex-1">
            Créer le simulateur
          </Button>
        </div>
      </form>
    </div>
  )
}
