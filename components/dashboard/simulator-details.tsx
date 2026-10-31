"use client"

import React, { useState } from "react"
import Link from "next/link"

import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"

import { Badge } from "@/components/ui/badge"

// =========================================================
// TYPES
// =========================================================

interface Scenario {
  title: string
  description: string
}

interface BadgeData {
  id: string
  name: string
  description: string | null
  icon: string | null
  requirement_type: string | null
  requirement_value: number | null
}

interface SimulatorDetailsProps {
  id: string

  title: string

  description: string

  level:
    | "Débutant"
    | "Intermédiaire"
    | "Avancé"

  duration: number

  progression: number

  attempts: number

  completedSessions: number

  activeSessions: number

  bestScore: number

  averageScore: number

  category: string

  skillsDeveloped: string[]

  learningObjectives: string[]

  scenarios: Scenario[]

  badges: BadgeData[]
}

// =========================================================
// ICONES DES BADGES
// =========================================================

const badgeIcons = {
  Trophy,
  Award,
  Flame,
  Star,
  Shield,
  Target,
  Zap,
}

function getBadgeIcon(
  icon: string | null
) {
  if (!icon) {
    return Trophy
  }

  return (
    badgeIcons[
      icon as keyof typeof badgeIcons
    ] ?? Trophy
  )
}

// =========================================================
// COMPONENT
// =========================================================

export function SimulatorDetails({
  id,
  title,
  description,
  level,
  duration,
  progression,
  attempts,
  completedSessions,
  activeSessions,
  bestScore,
  averageScore,
  category,
  skillsDeveloped,
  learningObjectives,
  scenarios,
  badges,
}: SimulatorDetailsProps) {
  // =======================================================
  // TAB
  // =======================================================

  const [activeTab, setActiveTab] =
    useState<
      | "overview"
      | "scenarios"
      | "badges"
      | "stats"
    >("overview")

  // =======================================================
  // COULEURS NIVEAU
  // =======================================================

  const levelColors: Record<
    string,
    string
  > = {
    Débutant:
      "bg-green-100 text-green-800",

    Intermédiaire:
      "bg-yellow-100 text-yellow-800",

    Avancé:
      "bg-red-100 text-red-800",
  }

  // =======================================================
  // TABS
  // =======================================================

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
    },
    {
      id: "scenarios",
      label: "Scénarios",
    },
    {
      id: "badges",
      label: "Badges",
    },
    {
      id: "stats",
      label: "Statistiques",
    },
  ]

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="space-y-8">

      {/* ================================================= */}
      {/* RETOUR */}
      {/* ================================================= */}

      <Link
        href="/simulateurs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Retour aux simulateurs
      </Link>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-white shadow-lg">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex-1 space-y-4">

            {/* BADGES HEADER */}

            <div className="flex flex-wrap items-center gap-2">

              <Badge className="bg-white/20 text-white hover:bg-white/30">
                {category}
              </Badge>

              <Badge
                className={
                  levelColors[level] ??
                  "bg-white/20 text-white"
                }
              >
                {level}
              </Badge>

              <Badge className="bg-white/20 text-white hover:bg-white/30">

                <Clock className="mr-1 size-3" />

                {duration} min

              </Badge>

            </div>

            {/* TITRE */}

            <h1 className="text-3xl font-bold">
              {title}
            </h1>

            {/* DESCRIPTION */}

            <p className="max-w-3xl text-primary-foreground/90">
              {description}
            </p>

          </div>

          {/* BOUTON */}

          <Link
            href={`/simulateurs/${id}/lancer`}
          >
            <Button
              size="lg"
              variant="secondary"
              className="shrink-0 gap-2"
            >
              <Play className="size-5" />

              LANCER LA SIMULATION
            </Button>
          </Link>

        </div>
      </div>

      {/* ================================================= */}
      {/* PROGRESSION */}
      {/* ================================================= */}

      <section className="space-y-4">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Votre progression
            </h2>

            <p className="text-sm text-muted-foreground">
              Votre progression est calculée à partir de vos compétences évaluées.
            </p>

          </div>

          <span className="text-2xl font-bold">
            {progression}%
          </span>

        </div>

        <Progress
          value={progression}
          className="h-3"
        />

        {/* STATISTIQUES RAPIDES */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* TENTATIVES */}

          <Card>

            <CardContent className="p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="size-5 text-blue-600" />
                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Tentatives
                  </p>

                  <p className="text-xl font-bold">
                    {attempts}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* TERMINÉES */}

          <Card>

            <CardContent className="p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="size-5 text-green-600" />
                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Terminées
                  </p>

                  <p className="text-xl font-bold">
                    {completedSessions}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* ACTIVES */}

          <Card>

            <CardContent className="p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-orange-100 p-2">
                  <Clock className="size-5 text-orange-600" />
                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    En cours
                  </p>

                  <p className="text-xl font-bold">
                    {activeSessions}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* MEILLEUR SCORE */}

          <Card>

            <CardContent className="p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-purple-100 p-2">
                  <Trophy className="size-5 text-purple-600" />
                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Meilleur score
                  </p>

                  <p className="text-xl font-bold">
                    {bestScore > 0
                      ? `${bestScore}/100`
                      : "—"}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* ================================================= */}
      {/* TABS */}
      {/* ================================================= */}

      <div className="flex gap-6 overflow-x-auto border-b border-border">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as typeof activeTab
              )
            }
            className={`relative whitespace-nowrap px-2 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >

            {tab.label}

            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            )}

          </button>

        ))}

      </div>

      {/* ================================================= */}
      {/* OVERVIEW */}
      {/* ================================================= */}

      {activeTab === "overview" && (

        <div className="space-y-8">

          {/* DESCRIPTION */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <BookOpen className="size-5" />

                À propos de ce simulateur

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="leading-relaxed">
                {description}
              </p>

            </CardContent>

          </Card>

          {/* OBJECTIFS */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Target className="size-5" />

                Objectifs d'apprentissage

              </CardTitle>

            </CardHeader>

            <CardContent>

              {learningObjectives.length > 0 ? (

                <div className="space-y-4">

                  {learningObjectives.map(
                    (
                      objective,
                      index
                    ) => (

                      <div
                        key={`${objective}-${index}`}
                        className="flex items-start gap-3"
                      >

                        <div className="mt-1 rounded-full bg-green-100 p-1.5">

                          <CheckCircle2 className="size-4 text-green-600" />

                        </div>

                        <p>
                          {objective}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-sm text-muted-foreground">
                  Aucun objectif renseigné.
                </p>

              )}

            </CardContent>

          </Card>

          {/* COMPÉTENCES */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Zap className="size-5" />

                Compétences évaluées

              </CardTitle>

            </CardHeader>

            <CardContent>

              {skillsDeveloped.length > 0 ? (

                <div className="flex flex-wrap gap-2">

                  {skillsDeveloped.map(
                    (skill, index) => (

                      <Badge
                        key={`${skill}-${index}`}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill}
                      </Badge>

                    )
                  )}

                </div>

              ) : (

                <p className="text-sm text-muted-foreground">
                  Aucune compétence renseignée.
                </p>

              )}

            </CardContent>

          </Card>

        </div>

      )}

      {/* ================================================= */}
      {/* SCÉNARIOS */}
      {/* ================================================= */}

      {activeTab === "scenarios" && (

        <Card>

          <CardHeader>

            <CardTitle>
              Déroulement de la simulation
            </CardTitle>

          </CardHeader>

          <CardContent>

            {scenarios.length > 0 ? (

              <div className="space-y-4">

                {scenarios.map(
                  (
                    scenario,
                    index
                  ) => (

                    <div
                      key={`${scenario.title}-${index}`}
                      className="flex gap-4 rounded-lg border p-4"
                    >

                      {/* NUMÉRO */}

                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>

                      {/* CONTENU */}

                      <div className="flex-1">

                        <p className="font-medium">
                          {scenario.title}
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {scenario.description}
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Étape {index + 1} de la simulation
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="py-10 text-center">

                <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground opacity-40" />

                <p className="text-sm text-muted-foreground">
                  Aucun scénario renseigné.
                </p>

              </div>

            )}

          </CardContent>

        </Card>

      )}

      {/* ================================================= */}
      {/* BADGES */}
      {/* ================================================= */}

      {activeTab === "badges" && (

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Trophy className="size-5" />

              Badges du simulateur

            </CardTitle>

          </CardHeader>

          <CardContent>

            {badges.length > 0 ? (

              <div className="grid gap-4 md:grid-cols-2">

                {badges.map((badge) => {

                  const Icon =
                    getBadgeIcon(
                      badge.icon
                    )

                  return (

                    <div
                      key={badge.id}
                      className="flex gap-4 rounded-lg border p-5"
                    >

                      {/* ICÔNE */}

                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100">

                        <Icon className="size-6 text-yellow-600" />

                      </div>

                      {/* INFORMATIONS */}

                      <div className="flex-1">

                        <h3 className="font-semibold">
                          {badge.name}
                        </h3>

                        {badge.description && (

                          <p className="mt-1 text-sm text-muted-foreground">
                            {badge.description}
                          </p>

                        )}

                        {badge.requirement_type && (

                          <div className="mt-3">

                            <Badge variant="outline">

                              {badge.requirement_type}

                              {badge.requirement_value !==
                                null &&
                                ` : ${badge.requirement_value}`}

                            </Badge>

                          </div>

                        )}

                      </div>

                    </div>

                  )
                })}

              </div>

            ) : (

              <div className="py-10 text-center">

                <Trophy className="mx-auto mb-4 size-12 text-muted-foreground opacity-40" />

                <p className="text-sm text-muted-foreground">
                  Aucun badge disponible pour ce simulateur.
                </p>

              </div>

            )}

          </CardContent>

        </Card>

      )}

      {/* ================================================= */}
      {/* STATISTIQUES */}
      {/* ================================================= */}

      {activeTab === "stats" && (

        <div className="space-y-6">

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <BarChart3 className="size-5" />

                Statistiques

              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* PROGRESSION */}

                <div className="rounded-lg border p-5">

                  <p className="text-sm text-muted-foreground">
                    Progression
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {progression}%
                  </p>

                </div>

                {/* SCORE MOYEN */}

                <div className="rounded-lg border p-5">

                  <p className="text-sm text-muted-foreground">
                    Score moyen
                  </p>

                  <p className="mt-2 text-3xl font-bold">

                    {averageScore > 0
                      ? `${averageScore}/100`
                      : "—"}

                  </p>

                </div>

                {/* MEILLEUR SCORE */}

                <div className="rounded-lg border p-5">

                  <p className="text-sm text-muted-foreground">
                    Meilleur score
                  </p>

                  <p className="mt-2 text-3xl font-bold">

                    {bestScore > 0
                      ? `${bestScore}/100`
                      : "—"}

                  </p>

                </div>

                {/* SESSIONS */}

                <div className="rounded-lg border p-5">

                  <p className="text-sm text-muted-foreground">
                    Sessions terminées
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {completedSessions}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* RÉSUMÉ */}

          <Card>

            <CardHeader>

              <CardTitle>
                Résumé de votre activité
              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="space-y-5">

                {/* PROGRESSION */}

                <div>

                  <div className="mb-2 flex justify-between">

                    <span className="text-sm font-medium">
                      Progression pédagogique
                    </span>

                    <span className="text-sm font-medium">
                      {progression}%
                    </span>

                  </div>

                  <Progress
                    value={progression}
                  />

                </div>

                {/* ACTIVITÉ */}

                <div className="grid gap-4 sm:grid-cols-3">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Tentatives
                    </p>

                    <p className="text-xl font-bold">
                      {attempts}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Terminées
                    </p>

                    <p className="text-xl font-bold">
                      {completedSessions}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      En cours
                    </p>

                    <p className="text-xl font-bold">
                      {activeSessions}
                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>
  )
}