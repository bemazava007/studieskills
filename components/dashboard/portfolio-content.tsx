"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download,
  Pencil,
  Briefcase,
  GraduationCap,
  Plus,
  X,
  Save,
  Loader2,
  Award,
  TrendingUp,
  Target,
} from "lucide-react"
import { getUserSessions, getCertifications } from "@/lib/api"
import type { SimulationSession, Certification } from "@/lib/types"

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface Competence {
  label: string
  color: string
}

interface Experience {
  title: string
  company: string
  date: string
  tasks: string[]
}

interface Formation {
  diplome: string
  institution: string
  specialisation: string
  period: string
}

interface CustomSection {
  title: string
  content: string
}

interface PersonalInfo {
  nom: string
  email: string
  telephone: string
  localisation: string
  statut: string
  cin: string
}

/* ------------------------------------------------------------------ */
/*  INITIAL DATA                                                       */
/* ------------------------------------------------------------------ */

const INITIAL_COMPETENCES: Competence[] = [
  { label: "Ecoute active et sens de la negociation", color: "bg-emerald-500" },
  {
    label:
      "Maitrise des outils numeriques de communication (marketing, reseaux sociaux, plateformes collaboratives)",
    color: "bg-primary",
  },
  {
    label: "Communication interpersonnelle et organisationnelle",
    color: "bg-red-400",
  },
]

const INITIAL_EXPERIENCES: Experience[] = [
  {
    title: "Assistant Communication - Association Etudiante",
    company: "Association Etudiante",
    date: "Avril 2025",
    tasks: [
      "Realisation et diffusion de communications internes et externes.",
      "Gestion des reseaux sociaux et animation de la communaute etudiante.",
      "Organisation d'evenements (conferences, ateliers, journees portes ouvertes).",
    ],
  },
  {
    title: "Stagiaire en Communication - Entreprise locale de telecommunications",
    company: "Entreprise locale de telecommunications",
    date: "Mars 2025",
    tasks: [
      "Contribution a la conception et mise en oeuvre de campagnes de communication.",
      "Creation de supports numeriques (affiches, presentations, newsletters).",
      "Coordination avec les equipes technique et commerciale pour la diffusion d'informations.",
    ],
  },
]

const INITIAL_FORMATIONS: Formation[] = [
  {
    diplome: "Licence en Informatique",
    institution: "Universite X Antsiranana 2024-2025",
    specialisation: "Telecommunications",
    period: "2024-2025",
  },
]

const INITIAL_PERSONAL_INFO: PersonalInfo = {
  nom: "Anderson",
  email: "anderson@gmail.com",
  telephone: "+26832550715",
  localisation: "Antsiranana, Madagascar",
  statut: "En Recherche d'Emploi",
  cin: "71001842606",
}

/* ------------------------------------------------------------------ */
/*  SHARED INPUT CLASSES                                               */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-card-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-ring"

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export function PortfolioContent() {
  const [editing, setEditing] = useState(false)
  const [sessions, setSessions] = useState<SimulationSession[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [proofsLoading, setProofsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [userSessions, certData] = await Promise.all([getUserSessions(), getCertifications()])
        setSessions(userSessions.filter(s => s.status === "completed"))
        setCerts(certData)
      } catch (err) {
        console.error("Failed to load portfolio proofs:", err)
      } finally {
        setProofsLoading(false)
      }
    })()
  }, [])

  /* State */
  const [bio, setBio] = useState(
    "Etudiant en telecommunications passionne par les reseaux et les systemes de communication. Fort d'une experience pratique acquise grace aux simulateurs StudieSkills, je cherche a integrer une equipe dynamique afin de mettre en pratique mes competences et contribuer a des projets innovants dans le domaine des technologies de l'information et de la communication."
  )
  const [formations, setFormations] = useState<Formation[]>(INITIAL_FORMATIONS)
  const [competences, setCompetences] = useState<Competence[]>(INITIAL_COMPETENCES)
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES)
  const [customSections, setCustomSections] = useState<CustomSection[]>([])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(INITIAL_PERSONAL_INFO)

  /* Helpers */
  const COMP_COLORS = ["bg-emerald-500", "bg-primary", "bg-red-400", "bg-amber-500", "bg-cyan-500"]

  function addFormation() {
    setFormations([...formations, { diplome: "", institution: "", specialisation: "", period: "" }])
  }
  function removeFormation(i: number) {
    setFormations(formations.filter((_, idx) => idx !== i))
  }
  function updateFormation(i: number, key: keyof Formation, val: string) {
    const copy = [...formations]
    copy[i] = { ...copy[i], [key]: val }
    setFormations(copy)
  }

  function addCompetence() {
    setCompetences([
      ...competences,
      { label: "", color: COMP_COLORS[competences.length % COMP_COLORS.length] },
    ])
  }
  function removeCompetence(i: number) {
    setCompetences(competences.filter((_, idx) => idx !== i))
  }
  function updateCompetence(i: number, val: string) {
    const copy = [...competences]
    copy[i] = { ...copy[i], label: val }
    setCompetences(copy)
  }

  function addExperience() {
    setExperiences([...experiences, { title: "", company: "", date: "", tasks: [""] }])
  }
  function removeExperience(i: number) {
    setExperiences(experiences.filter((_, idx) => idx !== i))
  }
  function updateExperience(i: number, key: keyof Omit<Experience, "tasks">, val: string) {
    const copy = [...experiences]
    copy[i] = { ...copy[i], [key]: val }
    setExperiences(copy)
  }
  function addTask(expIdx: number) {
    const copy = [...experiences]
    copy[expIdx] = { ...copy[expIdx], tasks: [...copy[expIdx].tasks, ""] }
    setExperiences(copy)
  }
  function removeTask(expIdx: number, taskIdx: number) {
    const copy = [...experiences]
    copy[expIdx] = {
      ...copy[expIdx],
      tasks: copy[expIdx].tasks.filter((_, idx) => idx !== taskIdx),
    }
    setExperiences(copy)
  }
  function updateTask(expIdx: number, taskIdx: number, val: string) {
    const copy = [...experiences]
    const tasks = [...copy[expIdx].tasks]
    tasks[taskIdx] = val
    copy[expIdx] = { ...copy[expIdx], tasks }
    setExperiences(copy)
  }

  function addCustomSection() {
    setCustomSections([...customSections, { title: "", content: "" }])
  }
  function removeCustomSection(i: number) {
    setCustomSections(customSections.filter((_, idx) => idx !== i))
  }
  function updateCustomSection(i: number, key: keyof CustomSection, val: string) {
    const copy = [...customSections]
    copy[i] = { ...copy[i], [key]: val }
    setCustomSections(copy)
  }

  function updatePersonal(key: keyof PersonalInfo, val: string) {
    setPersonalInfo({ ...personalInfo, [key]: val })
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="flex flex-col gap-6">
      {/* Blue Welcome Banner */}
      <div className="rounded-xl bg-primary px-6 py-5 text-primary-foreground">
        <h2 className="text-lg font-bold">Votre Portfolio</h2>
        <p className="mt-1 text-sm text-primary-foreground/80">
          {"Continuez votre parcours d'apprentissage professionnel"}
        </p>
      </div>

      {/* Title row with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-card-foreground">
          Mon Portfolio Professionnel
        </h2>
        <div className="flex items-center gap-2">
          {editing ? (
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setEditing(false)}
            >
              <Save className="size-4" />
              Sauvegarder
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-4" />
                Exporter
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
                Modifier
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* ========================================================= */}
        {/*  LEFT COLUMN                                               */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* ---- StudieSkills Proofs (real data) ---- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground flex items-center gap-2">
                <Award className="size-4 text-primary" />
                Preuves de compétences StudieSkills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proofsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Chargement...
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune simulation terminée. Completez des simulations pour afficher vos preuves ici.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border p-3 text-center">
                      <TrendingUp className="size-4 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
                      <p className="text-xs text-muted-foreground">Simulations</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                      <Target className="size-4 text-green-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Score moyen</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                      <Award className="size-4 text-orange-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{certs.length}</p>
                      <p className="text-xs text-muted-foreground">Certifications</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {sessions.slice(0, 5).map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {(s as any).simulator?.title ?? "Simulation"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.completed_at ?? s.started_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary">{s.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ---- A propos de moi ---- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">
                A propos de moi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>
              )}
            </CardContent>
          </Card>

          {/* ---- Formation ---- */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Formation
              </CardTitle>
              {editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary hover:text-primary"
                  onClick={addFormation}
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                {formations.map((f, i) => (
                  <div key={i} className="relative">
                    {editing ? (
                      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
                        {formations.length > 1 && (
                          <button
                            onClick={() => removeFormation(i)}
                            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Supprimer formation"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Diplome
                          </label>
                          <input
                            value={f.diplome}
                            onChange={(e) => updateFormation(i, "diplome", e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Licence en Informatique"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Institution
                          </label>
                          <input
                            value={f.institution}
                            onChange={(e) => updateFormation(i, "institution", e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Universite X"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Specialisation
                          </label>
                          <input
                            value={f.specialisation}
                            onChange={(e) => updateFormation(i, "specialisation", e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Telecommunications"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Periode
                          </label>
                          <input
                            value={f.period}
                            onChange={(e) => updateFormation(i, "period", e.target.value)}
                            className={inputClass}
                            placeholder="Ex: 2024-2025"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <GraduationCap className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-card-foreground">{f.diplome}</p>
                          <p className="text-sm text-muted-foreground">{f.institution}</p>
                          <p className="text-sm text-muted-foreground">
                            {"Specialisation : " + f.specialisation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ---- Competences Acquises ---- */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Competences Acquises
              </CardTitle>
              {editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary hover:text-primary"
                  onClick={addCompetence}
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {competences.map((comp, i) =>
                  editing ? (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${comp.color}`}
                        aria-hidden
                      />
                      <input
                        value={comp.label}
                        onChange={(e) => updateCompetence(i, e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder="Competence..."
                      />
                      <button
                        onClick={() => removeCompetence(i)}
                        className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                        aria-label="Supprimer competence"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className={`rounded-lg px-4 py-3 text-sm font-medium text-white ${comp.color}`}
                    >
                      {comp.label}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* ---- Experience ---- */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Experience
              </CardTitle>
              {editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary hover:text-primary"
                  onClick={addExperience}
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                {experiences.map((exp, i) =>
                  editing ? (
                    <div
                      key={i}
                      className="relative flex flex-col gap-3 rounded-lg border border-border p-4"
                    >
                      <button
                        onClick={() => removeExperience(i)}
                        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Supprimer experience"
                      >
                        <X className="size-4" />
                      </button>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Titre/poste
                        </label>
                        <input
                          value={exp.title}
                          onChange={(e) => updateExperience(i, "title", e.target.value)}
                          className={inputClass}
                          placeholder="Ex: Assistant Communication"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Entreprise
                        </label>
                        <input
                          value={exp.company}
                          onChange={(e) => updateExperience(i, "company", e.target.value)}
                          className={inputClass}
                          placeholder="Ex: Association Etudiante"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Date/dates
                        </label>
                        <input
                          value={exp.date}
                          onChange={(e) => updateExperience(i, "date", e.target.value)}
                          className={inputClass}
                          placeholder="Ex: Avril 2025"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-xs font-medium text-muted-foreground">
                            Taches et responsabilites
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto gap-1 px-2 py-1 text-xs text-primary hover:text-primary"
                            onClick={() => addTask(i)}
                          >
                            <Plus className="size-3" /> Tache
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {exp.tasks.map((task, ti) => (
                            <div key={ti} className="flex items-center gap-2">
                              <input
                                value={task}
                                onChange={(e) => updateTask(i, ti, e.target.value)}
                                className={`${inputClass} flex-1`}
                                placeholder="Description de la tache..."
                              />
                              {exp.tasks.length > 1 && (
                                <button
                                  onClick={() => removeTask(i, ti)}
                                  className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                                  aria-label="Supprimer tache"
                                >
                                  <X className="size-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Briefcase className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">{exp.title}</p>
                        <p className="mb-1.5 text-sm text-muted-foreground">{exp.date}</p>
                        <ul className="flex flex-col gap-1">
                          {exp.tasks.map((t, ti) => (
                            <li key={ti} className="text-sm leading-relaxed text-muted-foreground">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* ---- Custom Sections (edit-only creation) ---- */}
          {(editing || customSections.length > 0) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold text-card-foreground">
                  Sections Personnalisees
                </CardTitle>
                {editing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-primary hover:text-primary"
                    onClick={addCustomSection}
                  >
                    <Plus className="size-4" /> Nouvelle Section
                  </Button>
                )}
              </CardHeader>
              {customSections.length > 0 && (
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {customSections.map((sec, i) =>
                      editing ? (
                        <div
                          key={i}
                          className="relative flex flex-col gap-3 rounded-lg border border-border p-4"
                        >
                          <button
                            onClick={() => removeCustomSection(i)}
                            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Supprimer section"
                          >
                            <X className="size-4" />
                          </button>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                              Titre de la section
                            </label>
                            <input
                              value={sec.title}
                              onChange={(e) => updateCustomSection(i, "title", e.target.value)}
                              className={inputClass}
                              placeholder="Titre..."
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                              Contenu
                            </label>
                            <textarea
                              value={sec.content}
                              onChange={(e) => updateCustomSection(i, "content", e.target.value)}
                              rows={3}
                              className={`${inputClass} resize-y`}
                              placeholder="Contenu..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div key={i}>
                          <h4 className="mb-1 font-semibold text-card-foreground">{sec.title}</h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">{sec.content}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* ========================================================= */}
        {/*  RIGHT COLUMN - Personal Info                              */}
        {/* ========================================================= */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Nom complet */}
                <PersonalField
                  label="Nom complet"
                  value={personalInfo.nom}
                  editing={editing}
                  onChange={(v) => updatePersonal("nom", v)}
                />
                {/* Email */}
                <PersonalField
                  label="Email"
                  value={personalInfo.email}
                  editing={editing}
                  onChange={(v) => updatePersonal("email", v)}
                  type="email"
                />
                {/* Telephone */}
                <PersonalField
                  label="Telephone"
                  value={personalInfo.telephone}
                  editing={editing}
                  onChange={(v) => updatePersonal("telephone", v)}
                  type="tel"
                />
                {/* Localisation */}
                <PersonalField
                  label="Localisation"
                  value={personalInfo.localisation}
                  editing={editing}
                  onChange={(v) => updatePersonal("localisation", v)}
                />
                {/* Statut professionnel */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                    Statut professionnel
                  </label>
                  <div className="relative">
                    <select
                      value={personalInfo.statut}
                      disabled={!editing}
                      onChange={(e) => updatePersonal("statut", e.target.value)}
                      className={`${inputClass} appearance-none ${!editing ? "bg-muted/40" : ""}`}
                    >
                      <option>{"En Recherche d'Emploi"}</option>
                      <option>Employe</option>
                      <option>Freelance</option>
                      <option>Etudiant</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg
                        className="size-4 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* CIN */}
                <PersonalField
                  label="CIN"
                  value={personalInfo.cin}
                  editing={editing}
                  onChange={(v) => updatePersonal("cin", v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Personal Field helper                                              */
/* ------------------------------------------------------------------ */

function PersonalField({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  editing: boolean
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={!editing}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${!editing ? "bg-muted/40" : ""}`}
      />
    </div>
  )
}
