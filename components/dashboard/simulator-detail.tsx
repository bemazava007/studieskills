"use client"

import { useState } from "react"
import { Bot, Flame, Trophy, ChevronLeft, ChevronRight, Award, ShieldCheck, Zap } from "lucide-react"
import type { Simulator } from "./simulator-card"

interface SimulatorDetailProps {
  simulator: Simulator
  onBack: () => void
  onStartScenario?: () => void
}

type TabType = 'overview' | 'scenarios' | 'badges' | 'stats'

/* ─── Icon SVGs ─── */

function StarIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

function QuestionIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function UserIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function BotNodeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="9" cy="16" r="1" fill="#ffffff" />
      <circle cx="15" cy="16" r="1" fill="#ffffff" />
      <path d="M12 7v4" />
      <circle cx="12" cy="5" r="2" />
    </svg>
  )
}

function UsersGroupIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function LockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function PhoneIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function TreasureChest() {
  return (
    <svg viewBox="0 0 80 70" fill="none" className="h-16 w-16 drop-shadow-lg md:h-20 md:w-20">
      <rect x="10" y="34" width="60" height="30" rx="5" fill="#8B6914" />
      <rect x="10" y="34" width="60" height="10" rx="3" fill="#A67C1A" />
      <path d="M6 20 C6 12 16 6 40 6 C64 6 74 12 74 20 V34 H6 Z" fill="#C8940F" />
      <path d="M10 22 C10 16 18 11 40 11 C62 11 70 16 70 22" stroke="#E8B84B" strokeWidth="3" fill="none" />
      <rect x="6" y="32" width="68" height="5" rx="2" fill="#8B6914" />
      <rect x="28" y="38" width="24" height="18" rx="4" fill="#F5D76E" />
      <circle cx="40" cy="45" r="4" fill="#8B6914" />
      <rect x="38.5" y="47" width="3" height="6" rx="1.5" fill="#8B6914" />
      <circle cx="40" cy="2" r="2.5" fill="#F5D76E" opacity="0.9" />
      <circle cx="26" cy="5" r="1.5" fill="#F5D76E" opacity="0.6" />
      <circle cx="54" cy="5" r="1.5" fill="#F5D76E" opacity="0.6" />
    </svg>
  )
}

/* ─── Types & data ─── */

type NodeType = "star" | "question" | "user" | "bot" | "users" | "treasure" | "lock" | "phone"
type NodeStatus = "completed" | "current" | "available" | "locked"
type Position = "left" | "center-left" | "center" | "center-right" | "right"

interface PathNode {
  type: NodeType
  status: NodeStatus
  label: string
  position: Position
}

interface LevelData {
  level: number
  title: string
  subtitle: string
  color: string
  nodes: PathNode[]
}

const allLevels: LevelData[] = [
  {
    level: 1,
    title: "Niveau 1 - Découverte",
    subtitle: "Les bases du service client",
    color: "#1a8fce",
    nodes: [
      { type: "star",     status: "completed", label: "Introduction",      position: "center-left" },
      { type: "question", status: "current",   label: "Questions Clients", position: "center" },
      { type: "user",     status: "available", label: "Profil Client",     position: "center-right" },
      { type: "bot",      status: "available", label: "Chatbot IA",        position: "left" },
      { type: "users",    status: "available", label: "Travail Equipe",    position: "center-right" },
      { type: "treasure", status: "available", label: "Recompense Niv.1",  position: "center-left" },
    ],
  },
  {
    level: 2,
    title: "Niveau 2 - Approfondissement",
    subtitle: "Gestion des situations complexes",
    color: "#27ae60",
    nodes: [
      { type: "phone",    status: "locked", label: "Appel Difficile",    position: "center-left" },
      { type: "question", status: "locked", label: "Escalade",           position: "center-right" },
      { type: "user",     status: "locked", label: "Client VIP",         position: "center" },
      { type: "bot",      status: "locked", label: "Assistance IA",      position: "left" },
      { type: "users",    status: "locked", label: "Jeu de Role",        position: "center-right" },
      { type: "treasure", status: "locked", label: "Recompense Niv.2",   position: "center-left" },
    ],
  },
  {
    level: 3,
    title: "Niveau 3 - Expert",
    subtitle: "Maîtrise des interactions avancées",
    color: "#e67e22",
    nodes: [
      { type: "star",     status: "locked", label: "Cas Critique",       position: "center" },
      { type: "phone",    status: "locked", label: "Multi-appels",       position: "center-right" },
      { type: "user",     status: "locked", label: "Négociation",        position: "left" },
      { type: "bot",      status: "locked", label: "IA Avancée",         position: "center-right" },
      { type: "users",    status: "locked", label: "Leadership",         position: "center-left" },
      { type: "treasure", status: "locked", label: "Recompense Niv.3",   position: "center" },
    ],
  },
  {
    level: 4,
    title: "Niveau 4 - Spécialiste",
    subtitle: "Scénarios réels et évaluations",
    color: "#8e44ad",
    nodes: [
      { type: "phone",    status: "locked", label: "Client Furieux",     position: "center-left" },
      { type: "question", status: "locked", label: "Audit Qualité",      position: "center-right" },
      { type: "star",     status: "locked", label: "Évaluation Live",    position: "center" },
      { type: "users",    status: "locked", label: "Coaching Equipe",    position: "left" },
      { type: "bot",      status: "locked", label: "Analyse IA",         position: "center-right" },
      { type: "treasure", status: "locked", label: "Recompense Niv.4",   position: "center-left" },
    ],
  },
  {
    level: 5,
    title: "Niveau 5 - Certification",
    subtitle: "Examen final et certification professionnelle",
    color: "#c0392b",
    nodes: [
      { type: "star",     status: "locked", label: "Examen Oral",         position: "center" },
      { type: "phone",    status: "locked", label: "Simulation Finale",   position: "center-right" },
      { type: "question", status: "locked", label: "QCM Final",           position: "left" },
      { type: "users",    status: "locked", label: "Jury Professionnel",  position: "center-right" },
      { type: "star",     status: "locked", label: "Certification",       position: "center" },
    ],
  },
]

/* ─── Utility functions ─── */

function getPositionStyle(position: Position): React.CSSProperties {
  switch (position) {
    case "left":          return { marginLeft: "8%",  marginRight: "auto" }
    case "center-left":   return { marginLeft: "20%", marginRight: "auto" }
    case "center":        return { marginLeft: "auto", marginRight: "auto" }
    case "center-right":  return { marginLeft: "auto", marginRight: "15%" }
    case "right":         return { marginLeft: "auto", marginRight: "5%" }
  }
}

function getNodeIcon(type: NodeType) {
  switch (type) {
    case "star":     return <StarIcon size={32} />
    case "question": return <QuestionIcon size={28} />
    case "user":     return <UserIcon size={28} />
    case "bot":      return <BotNodeIcon size={28} />
    case "users":    return <UsersGroupIcon size={28} />
    case "phone":    return <PhoneIcon size={28} />
    case "lock":     return <LockIcon size={24} />
    default:         return <LockIcon size={24} />
  }
}

/* ─── Node bubble ─── */

function PathNodeBubble({
  node,
  index,
  levelColor,
  onClickNode,
}: {
  node: PathNode
  index: number
  levelColor: string
  onClickNode?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isFirstStar = index === 0 && node.type === "star"
  const isTreasure = node.type === "treasure"
  const isLocked = node.status === "locked"
  const isCurrent = node.status === "current"
  const isCompleted = node.status === "completed"

  if (isTreasure) {
    return (
      <div
        className="relative flex w-fit flex-col items-center"
        style={getPositionStyle(node.position)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`transition-transform duration-200 ${isLocked ? "cursor-not-allowed opacity-40 grayscale" : "cursor-pointer hover:scale-110 active:scale-95"}`}>
          <TreasureChest />
        </div>
        {hovered && (
          <div className="absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1e293b] px-3 py-1 text-xs font-semibold text-[#ffffff] shadow-lg">
            {node.label}
          </div>
        )}
      </div>
    )
  }

  const outerSize = isFirstStar ? "h-20 w-20 md:h-24 md:w-24" : "h-14 w-14 md:h-16 md:w-16"
  const bgColor = isLocked ? "bg-[#b0bec5]" : `bg-[${levelColor}]`

  return (
    <div
      className="relative flex w-fit flex-col items-center"
      style={getPositionStyle(node.position)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isFirstStar && !isLocked && (
        <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-32 md:w-32" style={{ backgroundColor: `${levelColor}15` }} />
      )}

      <button
        onClick={!isLocked ? onClickNode : undefined}
        className={`relative z-10 flex items-center justify-center rounded-full ${outerSize} border-4 transition-all duration-200 ${
          isLocked ? "cursor-not-allowed border-[#cfd8dc] bg-[#b0bec5] shadow-md" : "cursor-pointer shadow-lg hover:scale-110 active:scale-95"
        } ${isFirstStar && !isLocked ? "border-[#d6eaf8]/60" : !isLocked ? "border-transparent" : ""}`}
        style={!isLocked ? { backgroundColor: levelColor, boxShadow: `0 8px 24px ${levelColor}33` } : undefined}
        aria-label={node.label}
      >
        {isLocked ? <LockIcon size={isFirstStar ? 28 : 22} /> : getNodeIcon(node.type)}

        {isCurrent && (
          <span className="absolute inset-0 animate-ping rounded-full opacity-25" style={{ backgroundColor: levelColor }} />
        )}

        {isCompleted && (
          <span className="absolute -bottom-1 -right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#ffffff] bg-[#27ae60] shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </button>

      {hovered && (
        <div className="absolute -bottom-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1e293b] px-3 py-1.5 text-xs font-semibold text-[#ffffff] shadow-lg">
          {node.label}
        </div>
      )}
    </div>
  )
}

/* ─── Dotted connector ─── */

function DottedCurve({ from, to }: { from: Position; to: Position }) {
  const getX = (pos: Position) => {
    switch (pos) {
      case "left":         return 15
      case "center-left":  return 30
      case "center":       return 50
      case "center-right": return 72
      case "right":        return 85
    }
  }
  const x1 = getX(from)
  const x2 = getX(to)

  return (
    <div className="pointer-events-none -my-1 h-12 w-full md:h-14">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
        <path
          d={`M ${x1} 0 C ${x1} 20, ${x2} 20, ${x2} 40`}
          stroke="#c8d6e0"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/* ─── Level progress badge ─── */

function LevelProgressBadge({ level, isActive, isCompleted, color }: { level: number; isActive: boolean; isCompleted: boolean; color: string }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
      isCompleted
        ? "bg-[#27ae60] text-[#ffffff]"
        : isActive
          ? "text-[#ffffff] shadow-md"
          : "bg-muted text-muted-foreground"
    }`}
    style={isActive && !isCompleted ? { backgroundColor: color } : undefined}
    >
      {isCompleted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        level
      )}
    </div>
  )
}

/* ─── Main export ─── */

export function SimulatorDetail({ simulator, onStartScenario }: SimulatorDetailProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const activeLevel = allLevels[currentLevel]

  const goNext = () => setCurrentLevel((p) => Math.min(p + 1, allLevels.length - 1))
  const goPrev = () => setCurrentLevel((p) => Math.max(p - 1, 0))

  const isLastLevel = currentLevel === allLevels.length - 1
  const isCertLevel = activeLevel.level === 5

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left: Learning path - Fixed header + scrollable content */}
      <div className="min-w-0 flex-1">
        {/* === FIXED HEADER ZONE (ne scroll pas) === */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
          {/* Banner */}
          <div className="relative flex flex-col mb-4 overflow-hidden rounded-2xl px-6 py-5 shadow-lg md:px-8 md:py-6"
            style={{ background: `linear-gradient(135deg, ${activeLevel.color}dd, ${activeLevel.color})` }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-block rounded-lg bg-[#ffffff]/15 px-3 py-1 text-xs font-semibold text-[#ffffff]">
                  5 Niveaux, 5 Scénarios chacun
                </p>
                <h2 className="mt-2 text-balance text-base font-bold leading-snug text-[#ffffff] md:text-lg">
                  {activeLevel.title}
                </h2>
                <p className="mt-0.5 text-xs text-[#ffffff]/80">{activeLevel.subtitle}</p>
              </div>
              <button className="w-fit rounded-xl border-2 border-[#ffffff]/80 bg-[#ffffff] px-6 py-2 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all hover:shadow-lg active:scale-95"
                style={{ color: activeLevel.color }}
              >
                Guide
              </button>
            </div>
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#ffffff]/5" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#ffffff]/5" />
          </div>

          {/* Level progress indicator */}
          <div className="mb-3 flex items-center justify-center gap-2">
            {allLevels.map((lvl, i) => (
              <div key={lvl.level} className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentLevel(i)}
                  className="transition-transform hover:scale-110"
                  aria-label={`Niveau ${lvl.level}`}
                >
                  <LevelProgressBadge
                    level={lvl.level}
                    isActive={i === currentLevel}
                    isCompleted={i < 1}
                    color={lvl.color}
                  />
                </button>
                {i < allLevels.length - 1 && (
                  <div className={`h-0.5 w-5 rounded-full ${i < 1 ? "bg-[#27ae60]" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          {/* <div className="mb-4 flex gap-6 border-b border-[#c8d6e0] px-2">
            {(['overview', 'scenarios', 'badges', 'stats'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative whitespace-nowrap px-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'overview' && 'Vue d\'ensemble'}
                {tab === 'scenarios' && 'Scénarios'}
                {tab === 'badges' && 'Badges'}
                {tab === 'stats' && 'Statistiques'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div> */}

          {/* Action button - fixed */}
          {activeTab === 'overview' && (
            <div className="mb-3 flex justify-center">
              <button
                onClick={currentLevel === 0 ? onStartScenario : undefined}
                className={`rounded-full px-12 py-2.5 text-xs font-extrabold uppercase tracking-[0.15em] text-[#ffffff] shadow-lg transition-all hover:shadow-xl active:scale-95 ${
                  currentLevel > 0 ? "cursor-not-allowed opacity-60" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${activeLevel.color}, ${activeLevel.color}cc)`,
                  boxShadow: `0 8px 24px ${activeLevel.color}44`,
                }}
              >
                {currentLevel === 0 ? "Commencer" : "Avancer"}
              </button>
            </div>
          )}
        </div>

        {/* === SCROLLABLE CONTENT ZONE === */}
        <div className="max-h-[calc(100vh-380px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4 mb-4">
              {/* Description détaillée */}
              {/* <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                <h3 className="text-sm font-bold text-foreground mb-2">Description Détaillée</h3>
                <p className="text-xs text-foreground leading-relaxed">
                  Dans ce simulateur immersif, vous serez confronté à diverses situations de service client. Vous apprendrez à écouter attentivement, à identifier les besoins sous-jacents des clients, et à proposer des solutions créatives. Le simulateur utilise l'intelligence artificielle pour adapter les réponses en fonction de vos actions.
                </p>
              </div> */}

              {/* Objectifs d'apprentissage */}
              {/* <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                <h3 className="text-sm font-bold text-foreground mb-2">Objectifs d'Apprentissage</h3>
                <div className="space-y-2">
                  {[
                    'Maîtriser les techniques d\'écoute active',
                    'Développer l\'empathie et la patience',
                    'Apprendre à désamorcer les situations tendues',
                    'Proposer des solutions créatives',
                    'Gérer le stress dans les situations difficiles'
                  ].map((objective, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-pink-100 p-1 flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <p className="text-xs text-foreground">{objective}</p>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Compétences développées */}
              {/* <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                <h3 className="text-sm font-bold text-foreground mb-2">Compétences Développées</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Communication', 'Empathie', 'Résolution de problèmes', 'Gestion du stress', 'Écoute active'].map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-full bg-slate-600 text-white text-[10px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div> */}

              {/* S-curve path */}
              <div className="relative mx-auto w-full max-w-sm px-2 py-3 md:max-w-md">
                {activeLevel.nodes.map((node, idx) => (
                  <div key={`node-${idx}`}>
                    {idx > 0 && (
                      <DottedCurve
                        from={activeLevel.nodes[idx - 1].position}
                        to={node.position}
                      />
                    )}
                    <PathNodeBubble
                      node={node}
                      index={idx}
                      levelColor={activeLevel.color}
                      onClickNode={!node.status.includes("locked") ? onStartScenario : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Certification banner for level 5 */}
              {isCertLevel && (
                <div className="mx-auto max-w-sm rounded-2xl border-2 border-dashed border-[#f39c12] bg-gradient-to-r from-[#fef9e7] to-[#fdebd0] p-4 text-center shadow-md md:max-w-md">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f39c12] to-[#e67e22] shadow-lg">
                    <Award className="h-6 w-6 text-[#ffffff]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1e293b]">Certification Professionnelle</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                    Complétez tous les scénarios du Niveau 5 pour obtenir votre certification professionnelle reconnue.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#ffffff] px-3 py-2 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-[#27ae60]" />
                    <span className="text-xs font-semibold text-[#1e293b]">Certificat délivré par StudieSkills</span>
                  </div>
                </div>
              )}

              {/* Next level preview divider */}
              {!isLastLevel && (
                <>
                  <div className="mx-auto my-4 flex max-w-sm items-center gap-3 px-4 md:max-w-md">
                    <div className="h-px flex-1 border-t-2 border-dashed border-[#c8d6e0]" />
                    <span className="font-serif text-base italic text-muted-foreground">
                      Niveau {activeLevel.level + 1}
                    </span>
                    <div className="h-px flex-1 border-t-2 border-dashed border-[#c8d6e0]" />
                  </div>

                  <div className="relative mx-auto w-full max-w-sm px-2 pb-4 opacity-30 md:max-w-md">
                    {allLevels[currentLevel + 1].nodes.slice(0, 3).map((node, idx) => (
                      <div key={`preview-${idx}`}>
                        {idx > 0 && (
                          <DottedCurve
                            from={allLevels[currentLevel + 1].nodes[idx - 1].position}
                            to={node.position}
                          />
                        )}
                        <PathNodeBubble node={{ ...node, status: "locked" }} index={idx + 100} levelColor="#b0bec5" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Scenarios Tab - Scrollable */}
          {activeTab === 'scenarios' && (
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-3 mb-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Scénarios Disponibles</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {['Appel Client Difficile', 'Gestion de Réclamation', 'Vente Croisée', 'Communication Difficile', 'Résolution de Conflit', 'Service Premium'].map((scenario, idx) => (
                  <div key={idx} className="rounded-lg border border-[#e2e8f0] p-3 hover:bg-muted transition-colors">
                    <h4 className="text-xs font-semibold text-foreground">{scenario}</h4>
                    <p className="mt-1 text-[10px] text-muted-foreground">Explorez ce scénario et améliorez vos compétences</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges Tab - Scrollable */}
          {activeTab === 'badges' && (
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4 text-center mb-4">
              <Zap className="size-10 mx-auto mb-3 opacity-50" />
              <p className="text-xs text-muted-foreground">Complétez les scénarios avec succès pour déverrouiller des badges exclusifs !</p>
              <div className="mt-3 flex justify-center gap-3">
                <div className="flex flex-col items-center opacity-30">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <span className="text-[10px] text-muted-foreground mt-1">⭐ Niv.1</span>
                </div>
                <div className="flex flex-col items-center opacity-30">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <span className="text-[10px] text-muted-foreground mt-1">⚡ Niv.2</span>
                </div>
                <div className="flex flex-col items-center opacity-30">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <span className="text-[10px] text-muted-foreground mt-1">🏆 Niv.3</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Tab - Scrollable */}
          {activeTab === 'stats' && (
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-3 mb-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Vos Statistiques</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <p className="text-xl font-bold text-primary">85%</p>
                  <p className="text-[10px] text-muted-foreground">Meilleur Score</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <p className="text-xl font-bold text-primary">5</p>
                  <p className="text-[10px] text-muted-foreground">Tentatives</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <p className="text-xl font-bold text-primary">450</p>
                  <p className="text-[10px] text-muted-foreground">XP Gagnés</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Niveau actuel</span>
                  <span className="font-semibold">{activeLevel.level} / 5</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Scénarios complétés</span>
                  <span className="font-semibold">3 / 25</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Temps total</span>
                  <span className="font-semibold">2h 35min</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation arrows - fixed at bottom of scrollable area */}
          <div className="flex items-center justify-center gap-3 py-3 sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-[#e2e8f0] -mx-1 px-2">
            <button
              onClick={goPrev}
              disabled={currentLevel === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[#ffffff] shadow transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: activeLevel.color, backgroundColor: activeLevel.color }}
              aria-label="Niveau précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-muted-foreground">
              {activeLevel.level} / 5
            </span>
            <button
              onClick={goNext}
              disabled={isLastLevel}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[#ffffff] shadow transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: activeLevel.color, backgroundColor: activeLevel.color }}
              aria-label="Niveau suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar - toujours visible, non scrollable */}
      <aside className="flex w-full flex-col gap-4 lg:w-72 xl:w-80">
        {/* Promo card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className="p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold leading-snug text-card-foreground">
                Essaie Studieskills gratuitement
              </h3>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a8fce] to-[#0b6aad] shadow-md">
                <Bot className="h-7 w-7 text-[#ffffff]" />
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Sans publicité, 100% personnalisé, et un accès illimité aux Défis Légendaires.
            </p>
            <button className="w-full rounded-xl bg-gradient-to-r from-[#1a8fce] to-[#0b6aad] px-3 py-2.5 text-xs font-bold text-[#ffffff] shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
              Essayer le Niveau 1 gratuitement
            </button>
          </div>
        </div>

        {/* Progress overview card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="mb-3 text-sm font-bold text-card-foreground">
            Progression Globale
          </h3>
          <div className="space-y-2">
            {allLevels.map((lvl, i) => {
              const isUnlocked = i === 0
              const progress = i === 0 ? 20 : 0
              return (
                <div key={lvl.level} className="flex items-center gap-2">
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#ffffff]"
                    style={{ backgroundColor: isUnlocked ? lvl.color : "#b0bec5" }}
                  >
                    {lvl.level}
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex items-center justify-between">
                      <span className={`text-[10px] font-semibold ${isUnlocked ? "text-card-foreground" : "text-muted-foreground"}`}>
                        Niv. {lvl.level}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: lvl.color }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/50 p-2">
            <Award className="h-4 w-4 text-[#f39c12]" />
            <span className="text-[10px] font-semibold text-card-foreground">
              Certification à 100% du Niveau 5
            </span>
          </div>
        </div>

        {/* Daily challenge */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-card-foreground">Challenge du jour</h3>
            <button className="text-[10px] font-bold uppercase tracking-wide text-[#1a8fce] transition-colors hover:text-[#0b6aad]">
              Afficher tout
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fdedec] to-[#fde2e1]">
              <Flame className="h-5 w-5 text-[#e67e22]" />
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="flex h-full items-center justify-center rounded-full bg-gradient-to-r from-[#27ae60] to-[#2ecc71] text-[10px] font-bold text-[#ffffff] transition-all"
                  style={{ width: "60%" }}
                >
                  3 / 5
                </div>
              </div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fef9e7] to-[#fcf3cf]">
              <Trophy className="h-5 w-5 text-[#f39c12]" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-0.5">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <div key={d + i} className="flex flex-col items-center gap-0.5">
                <span className="text-[8px] font-medium text-muted-foreground">{d}</span>
                <div className={`h-5 w-5 rounded-full ${i < 3 ? "bg-[#27ae60]" : i === 3 ? "border-2 border-[#27ae60] bg-card" : "bg-muted"}`}>
                  {i < 3 && (
                    <svg className="h-full w-full p-0.5" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlock levels */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="mb-2 text-sm font-bold text-card-foreground">
            Déverrouiller les Niveaux
          </h3>
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a8fce]/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#1a8fce]">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              5 niveaux à conquérir pour obtenir votre certification professionnelle
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}