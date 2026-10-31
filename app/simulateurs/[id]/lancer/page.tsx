'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Send,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react'

import {
  createSession,
  getSimulator,
  getSessionMessages,
  sendChatMessage,
  evaluateSession,
} from '@/lib/api'

import type {
  Simulator,
  SessionMessage,
  MistralEvaluationResponse,
} from '@/lib/types'

import { supabase } from '@/lib/supabase/client'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'


// ============================================================
// CONFIGURATION
// ============================================================

// Temps maximum autorisé pour répondre à chaque message du client
const RESPONSE_TIME_LIMIT = 120 // 2 minutes

// Temps à partir duquel on affiche l'avertissement
const WARNING_TIME = 30


export default function LaunchSimulatorPage() {

  const params = useParams<{ id: string }>()
  const router = useRouter()

  // ==========================================================
  // SESSION / SIMULATEUR
  // ==========================================================

  const [simulator, setSimulator] =
    useState<Simulator | null>(null)

  const [sessionId, setSessionId] =
    useState<string | null>(null)

  const [messages, setMessages] =
    useState<SessionMessage[]>([])


  // ==========================================================
  // INPUT
  // ==========================================================

  const [input, setInput] =
    useState('')


  // ==========================================================
  // LOADING / STATES
  // ==========================================================

  const [sending, setSending] =
    useState(false)

  const [evaluating, setEvaluating] =
    useState(false)

  const [evaluation, setEvaluation] =
    useState<MistralEvaluationResponse | null>(null)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(true)


  // ==========================================================
  // TIMER
  // ==========================================================

  const [timeLeft, setTimeLeft] =
    useState(RESPONSE_TIME_LIMIT)

  const [timerActive, setTimerActive] =
    useState(false)

  const [timeExpired, setTimeExpired] =
    useState(false)


  // ==========================================================
  // REFS
  // ==========================================================

  const scrollRef =
    useRef<HTMLDivElement>(null)

  const evaluationStartedRef =
    useRef(false)


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  useEffect(() => {

    init()

  }, [])


  // ==========================================================
  // AUTO SCROLL
  // ==========================================================

  useEffect(() => {

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })

  }, [messages])


  // ==========================================================
  // FORMAT TIMER
  // ==========================================================

  function formatTime(seconds: number) {

    const minutes =
      Math.floor(seconds / 60)

    const secs =
      seconds % 60

    return `${minutes
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }


  // ==========================================================
  // START TIMER
  // ==========================================================

  const startResponseTimer = useCallback(() => {

    setTimeLeft(RESPONSE_TIME_LIMIT)

    setTimeExpired(false)

    setTimerActive(true)

  }, [])


  // ==========================================================
  // EVALUATION AUTOMATIQUE
  // ==========================================================

  const handleTimeExpired = useCallback(async () => {

    if (
      !sessionId ||
      evaluating ||
      evaluation ||
      evaluationStartedRef.current
    ) {
      return
    }

    // Empêcher plusieurs évaluations simultanées
    evaluationStartedRef.current = true

    console.log(
      '⏰ TEMPS DE RÉPONSE DÉPASSÉ'
    )

    // Arrêter complètement la simulation
    setTimerActive(false)

    setTimeExpired(true)

    // Désactiver les interactions
    setInput('')

    setEvaluating(true)

    setError('')


    try {

      console.log(
        '📊 Lancement de l’évaluation automatique...'
      )

      const result =
        await evaluateSession(sessionId)

      console.log(
        '✅ Évaluation terminée:',
        result
      )

      setEvaluation(result)

    } catch (err) {

      console.error(
        '❌ ERREUR ÉVALUATION:',
        err
      )

      evaluationStartedRef.current = false

      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'évaluation"
      )

    } finally {

      setEvaluating(false)

    }

  }, [
    sessionId,
    evaluating,
    evaluation,
  ])


  // ==========================================================
  // TIMER ENGINE
  // ==========================================================

  useEffect(() => {

    if (
      !timerActive ||
      sending ||
      evaluating ||
      evaluation
    ) {
      return
    }


    // --------------------------------------------------------
    // TIMER ARRIVÉ À 0
    // --------------------------------------------------------

    if (timeLeft <= 0) {

      handleTimeExpired()

      return
    }


    // --------------------------------------------------------
    // DÉCRÉMENTATION
    // --------------------------------------------------------

    const interval =
      setInterval(() => {

        setTimeLeft(prev => {

          if (prev <= 1) {
            return 0
          }

          return prev - 1

        })

      }, 1000)


    return () => {

      clearInterval(interval)

    }

  }, [
    timerActive,
    timeLeft,
    sending,
    evaluating,
    evaluation,
    handleTimeExpired,
  ])


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  async function init() {

    try {

      // ------------------------------------------------------
      // Vérification Supabase
      // ------------------------------------------------------

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()


      console.log(
        '🔐 SESSION:',
        session
      )

      console.log(
        '🔐 SESSION ERROR:',
        sessionError
      )


      if (!session) {

        throw new Error(
          'Session Supabase absente. Veuillez vous reconnecter.'
        )
      }


      // ------------------------------------------------------
      // Récupérer le simulateur
      // ------------------------------------------------------

      const sim =
        await getSimulator(params.id)


      if (!sim) {

        setError(
          'Simulateur introuvable'
        )

        return
      }


      setSimulator(sim)


      // ------------------------------------------------------
      // Créer la session
      // ------------------------------------------------------

      const sessionData =
        await createSession(sim.id)


      setSessionId(sessionData.id)


      // ------------------------------------------------------
      // Récupérer les messages
      // ------------------------------------------------------

      const existing =
        await getSessionMessages(
          sessionData.id
        )


      setMessages(existing)


      // ------------------------------------------------------
      // Première interaction
      // ------------------------------------------------------

      if (existing.length === 0) {

        const greeting =
          await sendChatMessage(
            sessionData.id,
            'Bonjour, je suis prêt à commencer la simulation.',
            sim.system_prompt,
            []
          )


        const greetingMessage:
          SessionMessage = {

          id: 'init',

          session_id:
            sessionData.id,

          role: 'assistant',

          content:
            greeting.reply,

          created_at:
            new Date().toISOString(),

        }


        setMessages([
          greetingMessage,
        ])


        // Le client vient de parler
        // Le conseiller a 2 minutes
        startResponseTimer()

      } else {

        // ----------------------------------------------------
        // Session existante
        // ----------------------------------------------------

        const lastMessage =
          existing[existing.length - 1]


        if (
          lastMessage?.role === 'assistant'
        ) {

          startResponseTimer()

        }

      }

    } catch (err) {

      console.error(
        '❌ INIT ERROR:',
        err
      )


      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du démarrage de la simulation'
      )

    } finally {

      setLoading(false)

    }

  }


  // ==========================================================
  // TEXTAREA
  // ==========================================================

  function handleInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {

    const textarea =
      e.target


    setInput(
      textarea.value
    )


    // Reset hauteur
    textarea.style.height =
      'auto'


    // Hauteur dynamique
    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        160
      )}px`

  }


  // ==========================================================
  // ENVOYER MESSAGE
  // ==========================================================

  async function handleSend() {

    // --------------------------------------------------------
    // Vérifications
    // --------------------------------------------------------

    if (

      !input.trim() ||

      !sessionId ||

      !simulator ||

      sending ||

      evaluating ||

      evaluation ||

      timeExpired ||

      timeLeft <= 0

    ) {

      return

    }


    const userMsg =
      input.trim()


    // --------------------------------------------------------
    // Arrêter le timer
    // --------------------------------------------------------

    setTimerActive(false)

    setTimeExpired(false)


    // --------------------------------------------------------
    // Reset input
    // --------------------------------------------------------

    setInput('')

    setSending(true)

    setError('')


    // --------------------------------------------------------
    // Message utilisateur
    // --------------------------------------------------------

    const userMessage:
      SessionMessage = {

      id:
        crypto.randomUUID(),

      session_id:
        sessionId,

      role:
        'user',

      content:
        userMsg,

      created_at:
        new Date().toISOString(),

    }


    // --------------------------------------------------------
    // Affichage optimiste
    // --------------------------------------------------------

    setMessages(
      prev => [
        ...prev,
        userMessage,
      ]
    )


    try {

      // ------------------------------------------------------
      // Historique
      // ------------------------------------------------------

      const history = [
        ...messages,
        userMessage,
      ]


      // ------------------------------------------------------
      // Appel IA
      // ------------------------------------------------------

      const response =
        await sendChatMessage(
          sessionId,
          userMsg,
          simulator.system_prompt,
          history
        )


      // ------------------------------------------------------
      // Message IA
      // ------------------------------------------------------

      const assistantMessage:
        SessionMessage = {

        id:
          crypto.randomUUID(),

        session_id:
          sessionId,

        role:
          'assistant',

        content:
          response.reply,

        created_at:
          new Date().toISOString(),

      }


      setMessages(
        prev => [
          ...prev,
          assistantMessage,
        ]
      )


      // ------------------------------------------------------
      // Nouveau tour
      //
      // Le client IA vient de répondre.
      // Le conseiller récupère 2 minutes.
      // ------------------------------------------------------

      startResponseTimer()


    } catch (err) {

      console.error(
        '❌ SEND ERROR:',
        err
      )


      // ------------------------------------------------------
      // Supprimer message optimiste
      // ------------------------------------------------------

      setMessages(
        prev =>
          prev.filter(
            message =>
              message.id !==
              userMessage.id
          )
      )


      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi du message"
      )


      // ------------------------------------------------------
      // Relancer le timer
      // ------------------------------------------------------

      startResponseTimer()

    } finally {

      setSending(false)

    }

  }


  // ==========================================================
  // TERMINER MANUELLEMENT
  // ==========================================================

  async function handleEndSimulation() {

    if (

      !sessionId ||

      evaluating ||

      evaluation

    ) {

      return

    }


    setTimerActive(false)

    setEvaluating(true)

    setError('')


    try {

      const result =
        await evaluateSession(
          sessionId
        )


      setEvaluation(
        result
      )

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'évaluation"
      )

    } finally {

      setEvaluating(false)

    }

  }


  // ==========================================================
  // TIMER STYLE
  // ==========================================================

  function getTimerContainerClass() {

    if (timeExpired) {

      return `
        border-destructive/30
        bg-destructive/10
        text-destructive
      `

    }


    if (timeLeft <= WARNING_TIME) {

      return `
        border-orange-500/30
        bg-orange-500/10
        text-orange-600
      `

    }


    return `
      border-border
      bg-background
      text-foreground
    `

  }


  function getTimerDotClass() {

    if (timeExpired) {

      return `
        bg-destructive
        animate-pulse
      `

    }


    if (timeLeft <= WARNING_TIME) {

      return `
        bg-orange-500
        animate-pulse
      `

    }


    return `
      bg-green-500
    `

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <DashboardShell title="Simulation">

        <div className="flex h-screen items-center justify-center bg-background">

          <div className="text-center space-y-4">

            <Loader2
              className="
                size-10
                animate-spin
                text-primary
                mx-auto
              "
            />

            <p className="text-muted-foreground">

              Préparation de votre simulation...

            </p>

          </div>

        </div>

      </DashboardShell>

    )

  }


  // ==========================================================
  // ERREUR INITIALISATION
  // ==========================================================

  if (
    error &&
    !simulator
  ) {

    return (

      <DashboardShell title="Simulation">

        <div className="flex h-screen items-center justify-center bg-background">

          <div className="text-center space-y-4">

            <AlertCircle
              className="
                size-10
                text-destructive
                mx-auto
              "
            />

            <p className="text-foreground">
              {error}
            </p>

            <Link
              href="/simulateurs"
              className="
                text-primary
                hover:underline
              "
            >
              Retour aux simulateurs
            </Link>

          </div>

        </div>

      </DashboardShell>

    )

  }


  // ==========================================================
  // ÉVALUATION
  // ==========================================================

  if (evaluation) {

    return (

      <DashboardShell title="Simulation">

        <div className="flex h-screen items-center justify-center bg-background p-4">

          <div className="max-w-2xl w-full space-y-6">

            {/* HEADER */}

            <div className="text-center space-y-2">

              <CheckCircle2
                className="
                  size-12
                  text-green-500
                  mx-auto
                "
              />

              <h1 className="
                text-2xl
                font-bold
                text-foreground
              ">
                Évaluation terminée
              </h1>

              <p className="text-muted-foreground">

                {timeExpired
                  ? 'La simulation a été arrêtée car le temps de réponse a été dépassé.'
                  : 'Voici les résultats de votre simulation.'
                }

              </p>

            </div>


            {/* SCORE */}

            <div className="
              rounded-xl
              border
              border-border
              bg-card
              p-6
              space-y-4
            ">

              <div className="text-center">

                <p className="
                  text-sm
                  text-muted-foreground
                  mb-1
                ">
                  Score global
                </p>

                <p className="
                  text-4xl
                  font-bold
                  text-primary
                ">
                  {evaluation.overall_score}/100
                </p>

              </div>


              {/* SUMMARY */}

              <p className="
                text-sm
                text-foreground
                leading-relaxed
              ">
                {evaluation.summary}
              </p>


              {/* SKILLS */}

              <div className="space-y-3">

                <h3 className="
                  font-semibold
                  text-foreground
                ">
                  Compétences évaluées
                </h3>


                {evaluation.skills.map(
                  (skill, i) => (

                    <div
                      key={i}
                      className="space-y-1"
                    >

                      <div className="
                        flex
                        justify-between
                        text-sm
                      ">

                        <span className="
                          font-medium
                          text-foreground
                        ">
                          {skill.skill_name}
                        </span>

                        <span className="
                          text-muted-foreground
                        ">
                          {skill.score}/100
                        </span>

                      </div>


                      <div className="
                        h-2
                        rounded-full
                        bg-secondary
                        overflow-hidden
                      ">

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-primary
                            transition-all
                          "
                          style={{
                            width:
                              `${skill.score}%`,
                          }}
                        />

                      </div>


                      <p className="
                        text-xs
                        text-muted-foreground
                      ">
                        {skill.feedback}
                      </p>

                    </div>

                  )
                )}

              </div>


              {/* PROGRESS PLAN */}

              {evaluation.progress_plan.length > 0 && (

                <div className="
                  space-y-3
                  border-t
                  border-border
                  pt-4
                ">

                  <h3 className="
                    font-semibold
                    text-foreground
                  ">
                    Plan de progression
                  </h3>


                  {evaluation.progress_plan.map(
                    (plan, i) => (

                      <div
                        key={i}
                        className="
                          rounded-lg
                          border
                          border-border
                          p-3
                          space-y-2
                        "
                      >

                        <div className="
                          flex
                          justify-between
                          text-sm
                        ">

                          <span className="
                            font-medium
                            text-foreground
                          ">
                            {plan.skill_name}
                          </span>

                          <span className="
                            text-muted-foreground
                          ">
                            {plan.current_score}
                            {' → '}
                            {plan.target_score}
                          </span>

                        </div>


                        <ul className="space-y-1">

                          {plan.exercises.map(
                            (ex, j) => (

                              <li
                                key={j}
                                className="
                                  text-xs
                                  text-muted-foreground
                                  flex
                                  items-start
                                  gap-2
                                "
                              >

                                <span className="
                                  text-primary
                                  mt-0.5
                                ">
                                  •
                                </span>

                                {ex}

                              </li>

                            )
                          )}

                        </ul>

                      </div>

                    )
                  )}

                </div>

              )}


              {/* ACTIONS */}

              <div className="
                flex
                gap-3
                pt-2
              ">

                <button
                  onClick={() =>
                    router.push('/performances')
                  }
                  className="
                    flex-1
                    rounded-lg
                    border
                    border-border
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-foreground
                    hover:bg-secondary
                    transition
                  "
                >
                  Voir mes performances
                </button>


                <button
                  onClick={() =>
                    router.push('/simulateurs')
                  }
                  className="
                    flex-1
                    rounded-lg
                    bg-primary
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-primary-foreground
                    hover:bg-primary/90
                    transition
                  "
                >
                  Autres simulateurs
                </button>

              </div>

            </div>

          </div>

        </div>

      </DashboardShell>

    )

  }


  // ==========================================================
  // INTERFACE PRINCIPALE
  // ==========================================================

  return (

    <DashboardShell title="Simulation">

      <div className="
        flex
        h-[calc(100vh-80px)]
        min-h-0
        flex-col
        bg-background
      ">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="
          shrink-0
          border-b
          border-border
          bg-card
          px-4
          py-3
          flex
          items-center
          gap-4
        ">


          {/* RETOUR */}

          <Link
            href="/simulateurs"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-muted-foreground
              hover:text-foreground
              transition
            "
          >

            <ArrowLeft className="size-4" />

            <span className="hidden sm:inline">
              Retour
            </span>

          </Link>


          {/* TITRE */}

          <div className="
            flex-1
            min-w-0
          ">

            <h1 className="
              font-bold
              text-foreground
              truncate
            ">
              {simulator?.title}
            </h1>

            <p className="
              text-xs
              text-muted-foreground
            ">
              {simulator?.category}
            </p>

          </div>


          {/* ==================================================
              TIMER
          ================================================== */}

          <div
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              border
              px-3
              py-2
              transition-colors
              ${getTimerContainerClass()}
            `}
          >

            <Clock
              className={`
                size-4
                ${
                  timeLeft <= WARNING_TIME ||
                  timeExpired
                    ? 'animate-pulse'
                    : ''
                }
              `}
            />


            <div className="text-right">

              <p className="
                text-[10px]
                uppercase
                tracking-wide
                text-muted-foreground
              ">
                Temps de réponse
              </p>

              <p className="
                font-mono
                text-sm
                font-bold
              ">
                {formatTime(timeLeft)}
              </p>

            </div>


            <div
              className={`
                size-2
                rounded-full
                ${getTimerDotClass()}
              `}
            />

          </div>


          {/* ==================================================
              TERMINER
          ================================================== */}

          <button
            onClick={
              handleEndSimulation
            }
            disabled={
              evaluating ||
              messages.length < 2 ||
              timeExpired
            }
            className="
              rounded-lg
              bg-primary
              px-4
              py-2
              text-sm
              font-semibold
              text-primary-foreground
              hover:bg-primary/90
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
              flex
              items-center
              gap-2
            "
          >

            {evaluating ? (

              <>

                <Loader2
                  className="
                    size-4
                    animate-spin
                  "
                />

                Évaluation...

              </>

            ) : (

              <>

                <CheckCircle2
                  className="size-4"
                />

                <span className="hidden sm:inline">
                  Terminer
                </span>

              </>

            )}

          </button>

        </header>


        {/* ====================================================
            CONVERSATION
        ==================================================== */}

        <div
          ref={scrollRef}
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            space-y-4
          "
        >


          {/* ==================================================
              AVERTISSEMENT
          ================================================== */}

          {timerActive &&
            timeLeft <= WARNING_TIME &&
            timeLeft > 0 && (

              <div className="
                flex
                justify-center
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-orange-500/30
                  bg-orange-500/10
                  px-4
                  py-2
                  text-sm
                  text-orange-600
                ">

                  <AlertCircle
                    className="size-4"
                  />

                  <span>
                    Attention : il vous reste
                  </span>

                  <strong>
                    {formatTime(timeLeft)}
                  </strong>

                </div>

              </div>

            )}


          {/* ==================================================
              TEMPS DÉPASSÉ / ÉVALUATION
          ================================================== */}

          {timeExpired && evaluating && (

            <div className="
              flex
              justify-center
            ">

              <div className="
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-destructive/30
                bg-destructive/10
                px-4
                py-3
                text-sm
                text-destructive
              ">

                <Loader2
                  className="
                    size-5
                    animate-spin
                  "
                />

                <div>

                  <p className="
                    font-semibold
                  ">
                    Temps de réponse dépassé
                  </p>

                  <p className="
                    text-xs
                    opacity-80
                  ">
                    La simulation est terminée.
                    Évaluation en cours...
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ==================================================
              MESSAGES
          ================================================== */}

          {messages.map(
            (msg) => (

              <div
                key={msg.id}
                className={`
                  flex
                  ${
                    msg.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }
                `}
              >

                <div
                  className={`
                    max-w-[75%]
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    leading-relaxed

                    ${
                      msg.role === 'user'
                        ? `
                          bg-primary
                          text-primary-foreground
                          rounded-br-md
                        `
                        : `
                          bg-card
                          border
                          border-border
                          text-foreground
                          rounded-bl-md
                        `
                    }
                  `}
                >

                  <p className="
                    whitespace-pre-wrap
                  ">
                    {msg.content}
                  </p>

                </div>

              </div>

            )
          )}


          {/* ==================================================
              IA EN TRAIN DE RÉPONDRE
          ================================================== */}

          {sending && (

            <div className="
              flex
              justify-start
            ">

              <div className="
                bg-card
                border
                border-border
                rounded-2xl
                rounded-bl-md
                px-4
                py-3
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <Loader2
                    className="
                      size-4
                      animate-spin
                      text-muted-foreground
                    "
                  />

                  <span className="
                    text-xs
                    text-muted-foreground
                  ">
                    Le client réfléchit...
                  </span>

                </div>

              </div>

            </div>

          )}


          {/* ==================================================
              ERREUR
          ================================================== */}

          {error && (

            <div className="
              flex
              justify-center
            ">

              <div className="
                rounded-lg
                border
                border-destructive/20
                bg-destructive/5
                px-4
                py-2
                text-sm
                text-destructive
                flex
                items-center
                gap-2
              ">

                <AlertCircle
                  className="size-4"
                />

                {error}

              </div>

            </div>

          )}

        </div>


        {/* ====================================================
            INPUT
        ==================================================== */}

        <div className="
          shrink-0
          border-t
          border-border
          bg-card
          p-4
        ">

          <div className="
            flex
            w-full
            max-w-4xl
            mx-auto
            items-end
            gap-3
          ">


            {/* TEXTAREA */}

            <textarea
              value={input}
              onChange={
                handleInputChange
              }
              onKeyDown={(e) => {

                if (
                  e.key === 'Enter' &&
                  !e.shiftKey
                ) {

                  e.preventDefault()

                  handleSend()

                }

              }}
              placeholder={
                timeExpired
                  ? 'Simulation terminée'
                  : 'Tapez votre réponse...'
              }
              disabled={
                sending ||
                evaluating ||
                evaluation !== null ||
                timeExpired ||
                timeLeft <= 0
              }
              rows={1}
              className="
                flex-1
                resize-none
                overflow-y-auto
                rounded-lg
                border
                border-input
                bg-background
                px-4
                py-2.5
                text-sm
                leading-relaxed
                text-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-primary/20
                focus:border-primary
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            />


            {/* SEND */}

            <button
              onClick={
                handleSend
              }
              disabled={
                !input.trim() ||
                sending ||
                evaluating ||
                evaluation !== null ||
                timeExpired ||
                timeLeft <= 0
              }
              className="
                shrink-0
                rounded-lg
                bg-primary
                px-4
                py-2.5
                text-primary-foreground
                hover:bg-primary/90
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
                flex
                items-center
                gap-2
              "
            >

              <Send
                className="size-4"
              />

              <span className="
                hidden
                sm:inline
              ">
                Envoyer
              </span>

            </button>

          </div>

        </div>

      </div>

    </DashboardShell>

  )

}