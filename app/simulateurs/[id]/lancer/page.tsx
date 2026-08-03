'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createSession, getSimulator, getSessionMessages, addMessage, sendChatMessage, evaluateSession } from '@/lib/api'
import type { Simulator, SessionMessage, MistralEvaluationResponse } from '@/lib/types'

export default function LaunchSimulatorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [simulator, setSimulator] = useState<Simulator | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<SessionMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<MistralEvaluationResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function init() {
    try {
      const sim = await getSimulator(params.id)
      if (!sim) {
        setError('Simulateur introuvable')
        setLoading(false)
        return
      }
      setSimulator(sim)

      const session = await createSession(sim.id)
      setSessionId(session.id)

      const existing = await getSessionMessages(session.id)
      setMessages(existing)

      if (existing.length === 0) {
        const greeting = await sendChatMessage(session.id, 'Bonjour, je suis prêt à commencer la simulation.', sim.system_prompt, [])
        setMessages([
          { id: 'init', session_id: session.id, role: 'assistant', content: greeting.reply, created_at: new Date().toISOString() },
        ])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du démarrage de la simulation')
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!input.trim() || !sessionId || !simulator || sending) return
    const userMsg = input.trim()
    setInput('')
    setSending(true)
    setError('')

    setMessages(prev => [...prev, { id: 'temp-user', session_id: sessionId, role: 'user', content: userMsg, created_at: new Date().toISOString() }])

    try {
      const response = await sendChatMessage(sessionId, userMsg, simulator.system_prompt, messages)
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'temp-user'),
        { id: 'temp-assistant', session_id: sessionId, role: 'user', content: userMsg, created_at: new Date().toISOString() },
        { id: 'temp-reply', session_id: sessionId, role: 'assistant', content: response.reply, created_at: new Date().toISOString() },
      ])
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== 'temp-user'))
      setError(err instanceof Error ? err.message : 'Erreur lors de l envoi du message')
    } finally {
      setSending(false)
    }
  }

  async function handleEndSimulation() {
    if (!sessionId || evaluating) return
    setEvaluating(true)
    setError('')
    try {
      const result = await evaluateSession(sessionId)
      setEvaluation(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l évaluation')
    } finally {
      setEvaluating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="size-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Préparation de votre simulation...</p>
        </div>
      </div>
    )
  }

  if (error && !simulator) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertCircle className="size-10 text-destructive mx-auto" />
          <p className="text-foreground">{error}</p>
          <Link href="/simulateurs" className="text-primary hover:underline">Retour aux simulateurs</Link>
        </div>
      </div>
    )
  }

  if (evaluation) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-2">
            <CheckCircle2 className="size-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Évaluation terminée</h1>
            <p className="text-muted-foreground">Voici les résultats de votre simulation</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Score global</p>
              <p className="text-4xl font-bold text-primary">{evaluation.overall_score}/100</p>
            </div>

            <p className="text-sm text-foreground leading-relaxed">{evaluation.summary}</p>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Compétences évaluées</h3>
              {evaluation.skills.map((skill, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{skill.skill_name}</span>
                    <span className="text-muted-foreground">{skill.score}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${skill.score}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{skill.feedback}</p>
                </div>
              ))}
            </div>

            {evaluation.progress_plan.length > 0 && (
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="font-semibold text-foreground">Plan de progression</h3>
                {evaluation.progress_plan.map((plan, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">{plan.skill_name}</span>
                      <span className="text-muted-foreground">{plan.current_score} → {plan.target_score}</span>
                    </div>
                    <ul className="space-y-1">
                      {plan.exercises.map((ex, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.push('/performances')}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition"
              >
                Voir mes performances
              </button>
              <button
                onClick={() => router.push('/simulateurs')}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                Autres simulateurs
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center gap-4">
        <Link href="/simulateurs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="size-4" />
          Retour
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-foreground">{simulator?.title}</h1>
          <p className="text-xs text-muted-foreground">{simulator?.category}</p>
        </div>
        <button
          onClick={handleEndSimulation}
          disabled={evaluating || messages.length < 2}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {evaluating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Évaluation...
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />
              Terminer
            </>
          )}
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border text-foreground rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="size-4" />
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tapez votre réponse..."
            disabled={sending}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="rounded-lg bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Send className="size-4" />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  )
}
