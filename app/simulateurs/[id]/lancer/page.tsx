'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Send,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { createSession, getSimulator, getSessionMessages, addMessage, sendChatMessage, evaluateSession } from '@/lib/api'
import type { Simulator, SessionMessage, MistralEvaluationResponse, SpeechEventLike,SpeechRecognitionLike, SpeechResultLike, SpeechWindow } from '@/lib/types'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

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
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

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

  function speakText(text: string) {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window) ||
    !voiceEnabled
  ) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = 1
  utterance.pitch = 1

  window.speechSynthesis.speak(utterance)
}
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  const textarea = e.currentTarget

  setInput(textarea.value)

  // Réinitialise la hauteur pour recalculer correctement
  textarea.style.height = "auto"

  // Hauteur dynamique avec maximum de 160px
  textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`

  // Active le scroll interne uniquement au-delà de 160px
  textarea.style.overflowY =
    textarea.scrollHeight > 160 ? "auto" : "hidden"
}
  // async function handleSend() {
  //   if (!input.trim() || !sessionId || !simulator || sending) return
  //   const userMsg = input.trim()
  //   setInput('')
  //   setSending(true)
  //   setError('')

  //   setMessages(prev => [...prev, { id: 'temp-user', session_id: sessionId, role: 'user', content: userMsg, created_at: new Date().toISOString() }])

  //   try {
  //     const response = await sendChatMessage(sessionId, userMsg, simulator.system_prompt, messages)
  //     setMessages(prev => [
  //       ...prev.filter(m => m.id !== 'temp-user'),
  //       { id: 'temp-assistant', session_id: sessionId, role: 'user', content: userMsg, created_at: new Date().toISOString() },
  //       { id: 'temp-reply', session_id: sessionId, role: 'assistant', content: response.reply, created_at: new Date().toISOString() },
  //     ])
  //   } catch (err) {
  //     setMessages(prev => prev.filter(m => m.id !== 'temp-user'))
  //     setError(err instanceof Error ? err.message : 'Erreur lors de l envoi du message')
  //   } finally {
  //     setSending(false)
  //   }
  // }

async function handleSendText(text: string) {
  if (!text.trim() || !sessionId || !simulator || sending) return

  const userMsg = text.trim()
  setInput('')
  setSending(true)
  setError('')

  const now = new Date().toISOString()

  setMessages(prev => [
    ...prev,
    {
      id: 'temp-user',
      session_id: sessionId,
      role: 'user',
      content: userMsg,
      created_at: now,
    },
  ])

  try {
    const response = await sendChatMessage(
      sessionId,
      userMsg,
      simulator.system_prompt,
      messages
    )

    setMessages(prev => [
      ...prev.filter(m => m.id !== 'temp-user'),
      {
        id: `user-${Date.now()}`,
        session_id: sessionId,
        role: 'user',
        content: userMsg,
        created_at: now,
      },
      {
        id: `assistant-${Date.now()}`,
        session_id: sessionId,
        role: 'assistant',
        content: response.reply,
        created_at: new Date().toISOString(),
      },
    ])

    speakText(response.reply)
  } catch (err) {
    setMessages(prev => prev.filter(m => m.id !== 'temp-user'))
    setError(
      err instanceof Error
        ? err.message
        : "Erreur lors de l'envoi du message"
    )
  } finally {
    setSending(false)
  }
}

function handleSend() {
  void handleSendText(input)
}

function startListening() {
  if (sending || isListening) return

  const speechWindow = window as SpeechWindow
  const SpeechRecognition =
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition

  if (!SpeechRecognition) {
    setError(
      'La reconnaissance vocale n’est pas disponible dans ce navigateur. Utilisez la saisie texte.'
    )
    return
  }

  setError('')

  const recognition = new SpeechRecognition()
  recognition.lang = 'fr-FR'
  recognition.continuous = false
  recognition.interimResults = true

  recognitionRef.current = recognition
  let messageSent = false

  recognition.onresult = event => {
    const results = Array.from(event.results)
    const transcript = results
      .map(result => result[0].transcript)
      .join(' ')
      .trim()

    setInput(transcript)

    const finalTranscript = results
      .filter(result => result.isFinal)
      .map(result => result[0].transcript)
      .join(' ')
      .trim()

    if (finalTranscript && !messageSent) {
      messageSent = true
      recognition.stop()
      void handleSendText(finalTranscript)
    }
  }

  recognition.onerror = event => {
    if (event.error !== 'aborted' && event.error !== 'no-speech') {
      setError(`Erreur de reconnaissance vocale : ${event.error}`)
    }
  }

  recognition.onend = () => {
    setIsListening(false)
    recognitionRef.current = null
  }

  try {
    recognition.start()
    setIsListening(true)
  } catch {
    setIsListening(false)
    setError("Impossible de démarrer le microphone. Réessayez.")
  }
}

function stopListening() {
  recognitionRef.current?.stop()
  setIsListening(false)
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

  if (!simulator) {
    return null
  }

  return (
  <DashboardShell title={simulator.title}>
    <div className="flex h-full min-h-0 flex-col overflow-hidden  bg-background">

      {/* ================= HEADER ================= */}
      <header className="shrink-0">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center rounded-lg bg-gradient-to-r from-primary to-primary/80 gap-3 text-white px-4 sm:px-6">

          {/* Retour */}
          <Link
            href="/simulateurs"
            className="
              group flex shrink-0 items-center gap-2
              rounded-lg px-2.5 py-2
              text-sm text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
          >
            <ArrowLeft className="size-4 transition-transform text-white group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline text-white">Retour</span>
          </Link>

          {/* Séparateur */}
          <div className="h-7 w-px bg-border text-white" />

          {/* Informations simulateur */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">
              {simulator.title}
            </h1>

            <div className="mt-0.5 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              <p className="truncate text-xs text-white">
                {simulator.category}
              </p>
            </div>
          </div>
         
          {/* Bouton terminer */}
         <button
  onClick={handleEndSimulation}
  disabled={evaluating || messages.length < 2}
  className="
    shrink-0
    rounded-lg
    border border-border
    bg-white
    px-3 py-2
    text-sm font-medium
    text-gray-900
    shadow-sm
    transition-all
    hover:bg-gray-50
    hover:border-gray-300
    disabled:cursor-not-allowed
    disabled:opacity-50
    flex items-center gap-2
  "
>
  {evaluating ? (
    <>
      <Loader2 className="size-4 animate-spin" />
      <span className="hidden sm:inline">
        Évaluation...
      </span>
    </>
  ) : (
    <>
      <CheckCircle2 className="size-4" />
      <span className="hidden sm:inline">
        Terminer
      </span>
    </>
  )}
</button>
        </div>
      </header>

      {/* ================= MESSAGES ================= */}
     {/* ================= MESSAGES ================= */}
<div
  ref={scrollRef}
  className="
    min-h-0
    flex-1
    overflow-y-auto
    overscroll-contain
    scroll-smooth
  "
>
  <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">

    {/* Petit indicateur de contexte */}
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm">
        <span className="size-1.5 rounded-full bg-primary" />
        Simulation en cours
      </div>
    </div>

    {/* Liste des messages */}
    <div className="space-y-5">

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`
              group
              max-w-[85%]
              sm:max-w-[75%]
              rounded-2xl
              px-4 py-3
              text-sm
              leading-6
              shadow-sm
              ${
                msg.role === "user"
                  ? `
                    rounded-br-md
                    bg-primary
                    text-primary-foreground
                  `
                  : `
                    rounded-bl-md
                    border
                    border-border
                    bg-card
                    text-foreground
                  `
              }
            `}
          >
            <p className="whitespace-pre-wrap break-words">
              {msg.content}
            </p>
          </div>
        </div>
      ))}

      {/* Loading */}
      {sending && (
        <div className="flex justify-start">
          <div className="
            flex items-center gap-2
            rounded-2xl
            rounded-bl-md
            border border-border
            bg-card
            px-4 py-3
            shadow-sm
          ">
            <span className="flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </span>

            <span className="text-xs text-muted-foreground">
              Le client réfléchit...
            </span>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="flex justify-center pt-2">
          <div className="
            flex max-w-md items-center gap-2
            rounded-lg
            border border-destructive/20
            bg-destructive/5
            px-4 py-2.5
            text-xs
            text-destructive
          ">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

    </div>
  </div>
</div>

      {/* ================= INPUT FIXE ================= */}
      <div
        className="
          shrink-0 
        "
      >
        <div className="mx-auto max-w-3xl px-4 py-2 sm:px-6 sm:py-4">

          <div
            className="
              flex
              items-end
              gap-2
              rounded-2xl
              border
              border-input
              bg-background
              p-1.5
              shadow-sm
              transition-all
              focus-within:border-primary/50
              focus-within:ring-2
              focus-within:ring-primary/10
            "
          >

            {/* Textarea */}
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)

                const textarea = e.currentTarget

                textarea.style.height = "auto"

                const maxHeight = 160

                textarea.style.height = `${Math.min(
                  textarea.scrollHeight,
                  maxHeight
                )}px`

                textarea.style.overflowY =
                  textarea.scrollHeight > maxHeight
                    ? "auto"
                    : "hidden"
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Écrivez votre réponse..."
              disabled={sending}
              rows={1}
              className="
                min-h-[42px]
                max-h-[160px]
                min-w-0
                flex-1
                resize-none
                overflow-y-hidden
                border-0
                bg-transparent
                px-3
                py-2.5
                text-sm
                leading-5
                text-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-0
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />

            {/* Bouton envoyer */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              aria-label="Envoyer"
              className="
                flex
                h-[42px]
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                px-3.5
                text-sm
                font-medium
                text-primary-foreground
                shadow-sm
                transition-all
                hover:bg-primary/90
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:px-4
              "
            >
              <Send className="size-4" />

             
            </button>

            
<button
  type="button"
  onClick={isListening ? stopListening : startListening}
  disabled={sending}
  aria-label={
    isListening ? "Arrêter le microphone" : "Parler"
  }
  title={isListening ? "Arrêter l'écoute" : "Parler"}
  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-input hover:bg-secondary disabled:opacity-40"
>
  {isListening ? (
    <MicOff className="size-4 text-destructive" />
  ) : (
    <Mic className="size-4" />
  )}
</button>

<button
  type="button"
  onClick={() => {
    setVoiceEnabled(prev => {
      if (prev && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      return !prev
    })
  }}
  aria-label={
    voiceEnabled ? "Désactiver la voix" : "Activer la voix"
  }
  title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-input hover:bg-secondary"
>
  {voiceEnabled ? (
    <Volume2 className="size-4" />
  ) : (
    <VolumeX className="size-4" />
  )}
</button>


          </div>

          {/* Aide clavier */}
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">
              Enter
            </kbd>
            <span>pour envoyer</span>

            <span className="mx-1 text-border">•</span>

            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">
              Shift + Enter
            </kbd>
            <span>pour une nouvelle ligne</span>
          </div>

        </div>
      </div>

    </div>
  </DashboardShell>
)
}
