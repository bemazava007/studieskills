'use client'

import { X, Clock, Zap, Award, Target, Users, AlertCircle } from 'lucide-react'
import type { Simulator } from './simulator-card'

interface SimulatorDetailsModalProps {
  simulator: Simulator
  onClose: () => void
  onLaunch: () => void
}

export function SimulatorDetailsModal({ simulator, onClose, onLaunch }: SimulatorDetailsModalProps) {
  const simulatorDetails: Record<string, any> = {
    1: {
      objectives: [
        'Maîtriser les techniques d\'accueil client',
        'Gérer les appels entrants avec professionnalisme',
        'Résoudre les problèmes courants',
      ],
      duration: '25-30 minutes par scénario',
      difficulty: 'Débutant',
      scenarios: 5,
      skills: ['Empathie', 'Écoute', 'Clarté', 'Patience'],
      prerequisite: 'Aucun',
    },
    2: {
      objectives: [
        'Approfondissement des techniques d\'accueil',
        'Gestion des clients difficiles',
        'Techniques de vente croisée',
      ],
      duration: '30-40 minutes par scénario',
      difficulty: 'Intermédiaire',
      scenarios: 5,
      skills: ['Empathie', 'Négociation', 'Persuasion', 'Résolution'],
      prerequisite: 'Niveau 1 complété',
    },
  }

  const details = simulatorDetails[simulator.id] || simulatorDetails[1]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{simulator.name}</h2>
            <p className="text-muted-foreground text-sm mt-1">{simulator.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg text-muted-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary rounded-lg p-4">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Durée</p>
              <p className="font-semibold text-foreground text-sm">{details.duration}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <Zap className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Difficulté</p>
              <p className="font-semibold text-foreground text-sm">{details.difficulty}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <Target className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Scénarios</p>
              <p className="font-semibold text-foreground text-sm">{details.scenarios}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <Award className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Certificat</p>
              <p className="font-semibold text-foreground text-sm">Oui</p>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Objectifs d&apos;apprentissage
            </h3>
            <ul className="space-y-2">
              {details.objectives.map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Compétences à développer
            </h3>
            <div className="flex flex-wrap gap-2">
              {details.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {details.prerequisite && (
            <div className="bg-secondary/50 border border-border rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Prérequis</p>
                <p className="text-sm text-muted-foreground">{details.prerequisite}</p>
              </div>
            </div>
          )}

          {/* What You'll Learn */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Ce que vous apprendrez</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                À travers des simulations réalistes, vous pratiquerez les situations que vous rencontrez quotidiennement dans votre travail. Chaque scénario est conçu pour améliorer vos compétences en service client et vendre plus efficacement.
              </p>
              <p>
                Vous recevrez des retours personnalisés après chaque scénario avec des conseils d&apos;amélioration et des points positifs à consolider.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 bg-secondary/50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{simulator.progress}%</p>
              <p className="text-xs text-muted-foreground">Progression</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{simulator.level}</p>
              <p className="text-xs text-muted-foreground">Niveau actuel</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 5) + 1}</p>
              <p className="text-xs text-muted-foreground">Scénarios faits</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary border-t border-border p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-input hover:bg-background text-foreground font-semibold py-2.5 px-4 rounded-lg transition"
          >
            Fermer
          </button>
          <button
            onClick={onLaunch}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition"
          >
            Commencer la formation
          </button>
        </div>
      </div>
    </div>
  )
}
