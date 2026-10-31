// Auto-generated-like types for the StudieSkills schema.
// Kept in sync with the Supabase migration.

export type UserRole = 'student' | 'admin' | 'recruiter'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  location: string | null
  role: UserRole
  target_profession_id: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Profession {
  id: string
  title: string
  description: string
  sector: string
  required_skills: string[]
  icon: string
  created_at: string
}

export type SimulatorDifficulty = 'debutant' | 'intermediaire' | 'avance'

export interface Simulator {
  id: string
  profession_id: string | null
  title: string
  description: string
  category: string
  difficulty: SimulatorDifficulty
  system_prompt: string
  skills_evaluated: string[]
  duration_minutes: number
  created_at: string
}

export type SessionStatus = 'active' | 'completed' | 'abandoned'

export interface SimulationSession {
  id: string
  user_id: string
  simulator_id: string
  status: SessionStatus
  score: number
  started_at: string
  completed_at: string | null
}

export interface SessionMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface SkillEvaluation {
  id: string
  session_id: string
  skill_name: string
  score: number
  feedback: string
  created_at: string
}

export interface ProgressPlan {
  id: string
  user_id: string
  session_id: string | null
  skill_name: string
  current_score: number
  target_score: number
  exercises: string[]
  created_at: string
}

export interface Certification {
  id: string
  user_id: string
  profession_id: string | null
  title: string
  issuer: string
  score: number
  issued_at: string
}

export interface RecruiterProfile {
  id: string
  user_id: string
  company_name: string
  industry: string
  website: string
  description: string
  created_at: string
}

export type JobOfferType = 'CDI' | 'CDD' | 'Stage' | 'Alternance'

export interface JobOffer {
  id: string
  recruiter_id: string
  title: string
  company: string
  location: string
  type: JobOfferType
  salary: string
  description: string
  required_skills: string[]
  is_active: boolean
  created_at: string
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'

export interface Application {
  id: string
  user_id: string
  job_offer_id: string
  status: ApplicationStatus
  cover_message: string
  recruiter_feedback: string
  created_at: string
}


export interface ChatResponse { reply: string } 
export interface OrientationAnswer { question: string; answer: string } 
export interface OrientationResponse { recommendations: unknown[] }
// ─── Edge function response types ───────────────────────────────

export interface MistralChatResponse {
  reply: string
}

export interface OrientationRecommendation {
  profession_id: string
  title: string
  sector: string
  match_score: number
  reason: string
}

export interface MistralOrientationResponse {
  recommendations: OrientationRecommendation[]
}

export interface SkillScore {
  skill_name: string
  score: number
  feedback: string
}

export interface MistralEvaluationResponse {
  overall_score: number
  skills: SkillScore[]
  summary: string
  progress_plan: {
    skill_name: string
    current_score: number
    target_score: number
    exercises: string[]
  }[]
}
