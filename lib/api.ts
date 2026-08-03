import { supabase } from '@/lib/supabase/client'
import type {
  Profile,
  Profession,
  Simulator,
  SimulationSession,
  SessionMessage,
  SkillEvaluation,
  ProgressPlan,
  Certification,
  JobOffer,
  Application,
  MistralChatResponse,
  MistralOrientationResponse,
  MistralEvaluationResponse,
} from '@/lib/types'

// ─── Auth ────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string, fullName: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  return data as Profile | null
}

// ─── Professions ─────────────────────────────────────────────────

export async function getProfessions() {
  const { data, error } = await supabase
    .from('professions')
    .select('*')
    .order('title')
  if (error) throw error
  return data as Profession[]
}

export async function getProfession(id: string) {
  const { data, error } = await supabase
    .from('professions')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Profession | null
}

// ─── Simulators ──────────────────────────────────────────────────

export async function getSimulators() {
  const { data, error } = await supabase
    .from('simulators')
    .select('*, profession:professions(title)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as (Simulator & { profession: { title: string } | null })[]
}

export async function getSimulator(id: string) {
  const { data, error } = await supabase
    .from('simulators')
    .select('*, profession:professions(title, sector)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as (Simulator & { profession: { title: string; sector: string } | null }) | null
}

// ─── Simulation Sessions ─────────────────────────────────────────

export async function createSession(simulatorId: string) {
  const { data, error } = await supabase
    .from('simulation_sessions')
    .insert({ simulator_id: simulatorId })
    .select()
    .single()
  if (error) throw error
  return data as SimulationSession
}

export async function getSession(sessionId: string) {
  const { data, error } = await supabase
    .from('simulation_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle()
  if (error) throw error
  return data as SimulationSession | null
}

export async function getUserSessions() {
  const { data, error } = await supabase
    .from('simulation_sessions')
    .select('*, simulator:simulators(title, category, difficulty)')
    .order('started_at', { ascending: false })
  if (error) throw error
  return data as (SimulationSession & {
    simulator: { title: string; category: string; difficulty: string }
  })[]
}

export async function completeSession(sessionId: string, score: number) {
  const { data, error } = await supabase
    .from('simulation_sessions')
    .update({ status: 'completed', score, completed_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single()
  if (error) throw error
  return data as SimulationSession
}

// ─── Session Messages ────────────────────────────────────────────

export async function getSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('session_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as SessionMessage[]
}

export async function addMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
  const { data, error } = await supabase
    .from('session_messages')
    .insert({ session_id: sessionId, role, content })
    .select()
    .single()
  if (error) throw error
  return data as SessionMessage
}

// ─── Skill Evaluations ───────────────────────────────────────────

export async function getSessionEvaluations(sessionId: string) {
  const { data, error } = await supabase
    .from('skill_evaluations')
    .select('*')
    .eq('session_id', sessionId)
  if (error) throw error
  return data as SkillEvaluation[]
}

export async function addSkillEvaluation(sessionId: string, skillName: string, score: number, feedback: string) {
  const { data, error } = await supabase
    .from('skill_evaluations')
    .insert({ session_id: sessionId, skill_name: skillName, score, feedback })
    .select()
    .single()
  if (error) throw error
  return data as SkillEvaluation
}

// ─── Progress Plans ──────────────────────────────────────────────

export async function getProgressPlans() {
  const { data, error } = await supabase
    .from('progress_plans')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as ProgressPlan[]
}

export async function addProgressPlan(plan: Omit<ProgressPlan, 'id' | 'created_at' | 'user_id'>) {
  const { data, error } = await supabase
    .from('progress_plans')
    .insert(plan)
    .select()
    .single()
  if (error) throw error
  return data as ProgressPlan
}

// ─── Certifications ──────────────────────────────────────────────

export async function getCertifications() {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('issued_at', { ascending: false })
  if (error) throw error
  return data as Certification[]
}

// ─── Job Offers ──────────────────────────────────────────────────

export async function getJobOffers() {
  const { data, error } = await supabase
    .from('job_offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as JobOffer[]
}

export async function getJobOffer(id: string) {
  const { data, error } = await supabase
    .from('job_offers')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as JobOffer | null
}

// ─── Applications ────────────────────────────────────────────────

export async function getUserApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job_offer:job_offers(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as (Application & { job_offer: JobOffer })[]
}

export async function applyToJob(jobOfferId: string, coverMessage: string) {
  const { data, error } = await supabase
    .from('applications')
    .insert({ job_offer_id: jobOfferId, cover_message: coverMessage })
    .select()
    .single()
  if (error) throw error
  return data as Application
}

// ─── Portfolio (aggregate for recruiter view) ────────────────────

export async function getUserPortfolio(userId: string) {
  const [sessionsResult, certsResult, evalsResult] = await Promise.all([
    supabase
      .from('simulation_sessions')
      .select('id, score, status, started_at, simulator:simulators(title, category)')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('started_at', { ascending: false }),
    supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('skill_evaluations')
      .select('skill_name, score, session_id')
      .in('session_id',
        (await supabase
          .from('simulation_sessions')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'completed')
        ).data?.map(s => s.id) ?? []
      ),
  ])

  if (sessionsResult.error) throw sessionsResult.error

  return {
    sessions: sessionsResult.data ?? [],
    certifications: certsResult.data ?? [],
    skillScores: evalsResult.data ?? [],
  }
}

// ─── Mistral AI Edge Function Calls ──────────────────────────────

function getFunctionUrl(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${url}/functions/v1/${slug}`
}

async function callEdgeFunction<T>(slug: string, body: unknown): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
  }

  const response = await fetch(getFunctionUrl(slug), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Edge function ${slug} failed (${response.status}): ${errorText}`)
  }

  return response.json() as Promise<T>
}

export async function sendChatMessage(sessionId: string, userMessage: string, systemPrompt: string, history: SessionMessage[]) {
  return callEdgeFunction<MistralChatResponse>('mistral-chat', {
    session_id: sessionId,
    user_message: userMessage,
    system_prompt: systemPrompt,
    history: history.map(m => ({ role: m.role, content: m.content })),
  })
}

export async function getOrientationRecommendations(answers: { question: string; answer: string }[]) {
  return callEdgeFunction<MistralOrientationResponse>('mistral-orientation', { answers })
}

export async function evaluateSession(sessionId: string) {
  return callEdgeFunction<MistralEvaluationResponse>('mistral-evaluation', { session_id: sessionId })
}
