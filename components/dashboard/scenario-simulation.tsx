"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Phone, PhoneOff, X } from "lucide-react"

interface ScenarioSimulationProps {
  simulatorName: string
  category: string
  onQuit: () => void
}

interface ClientProfile {
  name: string
  phone: string
  mood: string
  moodColor: string
  motif: string
  avatar: string
}

const clients: ClientProfile[] = [
  {
    name: "Marie Dubois",
    phone: "+33 1 23 45 67 89",
    mood: "Tres mecontent(e)",
    moodColor: "bg-[#fdedec] text-[#e74c3c] border-[#e74c3c]",
    motif: "Facturation incorrecte",
    avatar: "/images/client-avatar.jpg",
  },
  {
    name: "Jean Martin",
    phone: "+33 6 78 90 12 34",
    mood: "Neutre",
    moodColor: "bg-[#edf2f7] text-[#4a5568] border-[#4a5568]",
    motif: "Activation forfait",
    avatar: "/images/client-avatar.jpg",
  },
  {
    name: "Sophie Laurent",
    phone: "+33 7 65 43 21 09",
    mood: "Impatient(e)",
    moodColor: "bg-[#fef3e7] text-[#e67e22] border-[#e67e22]",
    motif: "Probleme de connexion",
    avatar: "/images/client-avatar.jpg",
  },
]

export function ScenarioSimulation({
  simulatorName,
  category,
  onQuit,
}: ScenarioSimulationProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [callState, setCallState] = useState<"waiting" | "ringing" | "active" | "ended">("waiting")
  const [timer, setTimer] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)

  const totalScenarios = 5
  const client = clients[currentScenario % clients.length]

  /* Timer */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (callState === "active") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callState])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }, [])

  const handlePickUp = () => {
    if (callState === "waiting") {
      setCallState("ringing")
      setTimeout(() => setCallState("active"), 1500)
    }
  }

  const handleHangUp = () => {
    setCallState("ended")
    const randomScore = Math.floor(Math.random() * 40) + 60
    setScore(randomScore)
    setShowFeedback(true)
  }

  const handleNextScenario = () => {
    if (currentScenario < totalScenarios - 1) {
      setCurrentScenario((c) => c + 1)
      setCallState("waiting")
      setTimer(0)
      setShowFeedback(false)
      setScore(0)
    }
  }

  /* Level / difficulty badges */
  const levelBadge = "Niveau 1"
  const difficultyBadge = "Facile"

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* ─── Top bar ─── */}
      <header className="relative flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-8">
        <div className="flex flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <h1 className="text-center text-sm font-bold text-foreground md:text-base">
            {simulatorName}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#1a8fce] px-3 py-0.5 text-[11px] font-semibold text-[#ffffff]">
              {category}
            </span>
            <span className="rounded-full bg-[#2c3e50] px-3 py-0.5 text-[11px] font-semibold text-[#ffffff]">
              {levelBadge}
            </span>
            <span className="rounded-full bg-[#27ae60] px-3 py-0.5 text-[11px] font-semibold text-[#ffffff]">
              {difficultyBadge}
            </span>
          </div>
        </div>
        <button
          onClick={onQuit}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-xl border-2 border-destructive px-4 py-2 text-sm font-bold text-destructive transition-colors hover:bg-destructive hover:text-[#ffffff]"
        >
          <X className="hidden h-4 w-4 sm:block" />
          Quitter
        </button>
      </header>

      {/* ─── Main content ─── */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto">
        <div className="flex w-full max-w-lg flex-col items-center px-4 py-8 md:py-12">
          {/* Progress bar */}
          <div className="mb-10 w-full">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Progression</span>
              <span className="text-sm font-semibold text-muted-foreground">
                {currentScenario}/{totalScenarios}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#e74c3c] to-[#c0392b] transition-all duration-500"
                style={{
                  width: `${(currentScenario / totalScenarios) * 100}%`,
                }}
              />
              {currentScenario === 0 && (
                <div className="relative -top-2.5 left-0 h-2.5 w-2.5 rounded-full bg-[#e74c3c]" />
              )}
            </div>
          </div>

          {/* Feedback overlay */}
          {showFeedback ? (
            <div className="flex w-full flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-lg">
              {/* Score circle */}
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="absolute inset-0 h-32 w-32" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke={score >= 80 ? "#27ae60" : score >= 60 ? "#f39c12" : "#e74c3c"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 352} 352`}
                    transform="rotate(-90 64 64)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="text-3xl font-black text-foreground">{score}%</span>
              </div>

              <div className="text-center">
                <h2 className="mb-1 text-xl font-bold text-foreground">
                  {score >= 80 ? "Excellent travail !" : score >= 60 ? "Bien joue !" : "Courage, continuez !"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {score >= 80
                    ? "Votre approche client etait professionnelle et empathique."
                    : score >= 60
                      ? "Quelques points a ameliorer pour la prochaine fois."
                      : "Revoyez les bonnes pratiques et reessayez."}
                </p>
              </div>

              {/* Feedback metrics */}
              <div className="grid w-full grid-cols-3 gap-3">
                {[
                  { label: "Empathie", value: Math.min(100, score + Math.floor(Math.random() * 10)) },
                  { label: "Clarte", value: Math.min(100, score - 5 + Math.floor(Math.random() * 15)) },
                  { label: "Resolution", value: Math.min(100, score + Math.floor(Math.random() * 5)) },
                ].map((metric) => (
                  <div key={metric.label} className="flex flex-col items-center gap-1 rounded-xl bg-muted/60 p-3">
                    <span className="text-lg font-bold text-foreground">{metric.value}%</span>
                    <span className="text-[11px] font-medium text-muted-foreground">{metric.label}</span>
                  </div>
                ))}
              </div>

              {/* XP earned */}
              <div className="flex items-center gap-2 rounded-full bg-[#fef9e7] px-5 py-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f39c12">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span className="text-sm font-bold text-[#d4a017]">+{Math.floor(score * 1.5)} XP gagnes</span>
              </div>

              {/* Actions */}
              <div className="flex w-full gap-3">
                <button
                  onClick={onQuit}
                  className="flex-1 rounded-xl border-2 border-border px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  Retour
                </button>
                {currentScenario < totalScenarios - 1 ? (
                  <button
                    onClick={handleNextScenario}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#1a8fce] to-[#0b6aad] px-4 py-3 text-sm font-bold text-[#ffffff] shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    Scenario suivant
                  </button>
                ) : (
                  <button
                    onClick={onQuit}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#27ae60] to-[#219a52] px-4 py-3 text-sm font-bold text-[#ffffff] shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    Terminer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Client card */}
              <div className="flex w-full flex-col items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-border bg-muted shadow-lg md:h-32 md:w-32">
                    <Image
                      src={client.avatar}
                      alt={client.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Ringing indicator */}
                  {callState === "ringing" && (
                    <span className="absolute inset-0 animate-ping rounded-full border-4 border-[#27ae60]/40" />
                  )}
                  {/* Active call indicator */}
                  {callState === "active" && (
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#27ae60] shadow-md">
                      <Phone className="h-3 w-3 text-[#ffffff]" />
                    </span>
                  )}
                </div>

                {/* Client info */}
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground md:text-2xl">{client.name}</h2>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                  <span
                    className={`rounded-full border px-4 py-1 text-xs font-semibold ${client.moodColor}`}
                  >
                    {client.mood}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Motif: <span className="font-medium text-foreground">{client.motif}</span>
                  </p>
                </div>

                {/* Timer */}
                <div className="mt-4 flex flex-col items-center gap-2">
                  <span className="font-mono text-4xl font-black tracking-wider text-foreground md:text-5xl">
                    {formatTime(timer)}
                  </span>
                  <p className="text-sm font-medium text-muted-foreground">
                    {callState === "waiting" && "Appel entrant..."}
                    {callState === "ringing" && "Connexion en cours..."}
                    {callState === "active" && "En communication"}
                    {callState === "ended" && "Appel termine"}
                  </p>
                </div>

                {/* Call action buttons */}
                <div className="mt-6 flex items-center gap-6">
                  {callState !== "active" && callState !== "ended" && (
                    <button
                      onClick={handlePickUp}
                      className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#27ae60] to-[#219a52] shadow-lg shadow-[#27ae60]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#27ae60]/40 active:scale-95 md:h-20 md:w-20"
                      aria-label="Decrocher"
                    >
                      <Phone className="h-7 w-7 text-[#ffffff] transition-transform group-hover:rotate-12 md:h-8 md:w-8" />
                    </button>
                  )}
                  {callState === "active" && (
                    <button
                      onClick={handleHangUp}
                      className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e74c3c] to-[#c0392b] shadow-lg shadow-[#e74c3c]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#e74c3c]/40 active:scale-95 md:h-20 md:w-20"
                      aria-label="Raccrocher"
                    >
                      <PhoneOff className="h-7 w-7 text-[#ffffff] transition-transform group-hover:rotate-12 md:h-8 md:w-8" />
                    </button>
                  )}
                </div>

                {/* Call state hint */}
                {callState === "waiting" && (
                  <p className="mt-2 animate-pulse text-center text-xs text-muted-foreground">
                    {"Cliquez sur le bouton vert pour decrocher l'appel"}
                  </p>
                )}
                {callState === "active" && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Raccrochez quand vous avez fini la conversation
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
