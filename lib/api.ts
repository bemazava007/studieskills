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
  ChatResponse,
  OrientationAnswer,
  OrientationRecommendation,
  OrientationResponse
} from '@/lib/types'




// ─── Auth ────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
 const result = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (result.error) {
    console.error('❌ Login error:', {
      message: result.error.message,
      status: result.error.status,
    })
  } else {
    console.log('✅ Login successful:', result.data.user?.id)
    console.log('✅ Session created:', !!result.data.session)
  }

  return result
}

export async function signUp({
  email,
  password,
  fullName,
  phone,
  address,
  birthDate,
  idNumber,
  postalCode,
  gender,
}: {
  email: string
  password: string
  fullName: string
  phone: string
  address: string
  birthDate: string
  idNumber: string
  postalCode: string
  gender: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
        phone,
        address,
        birth_date: birthDate,
        id_number: idNumber,
        postal_code: postalCode,
        gender,
      },
    },
  })

  console.log("🟢 SIGNUP DATA:", data)
  console.log("🔴 SIGNUP ERROR:", error)

  return { data, error }
}

// export async function signUp(
//   email: string,
//   password: string,
//   fullName: string,
//   phone: string,
//   address: string,
//   birthDate: string,
//   idNumber: string,
//   postalCode: string,
//   gender: string
// ) {
//   try {
//     const result = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           phone,
//           address,
//           birth_date: birthDate,
//           id_number: idNumber,
//           postal_code: postalCode,
//           gender,
//         },
//       },
//     });
    
//     // Log détaillé pour le débogage
//     if (result.error) {
//       console.error('Supabase signup error details:', {
//         message: result.error.message,
//         status: result.error.status,
//         details: result.error.message,
//         hint: result.error.cause,
//         code: result.error.code
//       });
//     }
    
//     return result;
//   } catch (error) {
//     console.error('Unexpected error during signup:', error);
//     throw error;
//   }
// }
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



export async function getSimulators() {
  const { data, error } = await supabase
    .from("simulators")
    .select(`
      *,
      profession:professions(
        title,
        sector
      )
    `)
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    console.error("❌ getSimulators error:", error)
    throw error
  }

  console.log("✅ SIMULATORS:", data)

  return data as (Simulator & {
    profession: {
      title: string
      sector: string
    } | null
  })[]
}

export async function getSimulator(id: string) {
  const { data, error } = await supabase
    .from("simulators")
    .select(`
      *,
      profession:professions (
        id,
        title
      ),
      badges (
        id,
        name,
        description,
        icon,
        requirement_type,
        requirement_value
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(
      "❌ SIMULATOR ERROR:",
      error
    )

    throw error
  }

  return data
}

// export async function createSession(simulatorId: string) {
//   // 1. Vérifier l'utilisateur authentifié
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser()

//   if (authError) {
//     console.error('❌ Supabase Auth error:', {
//       name: authError.name,
//       message: authError.message,
//       status: authError.status,
//       code: authError.code,
//     })

//     throw new Error(
//       `Erreur d'authentification: ${authError.message}`
//     )
//   }

//   if (!user) {
//     console.error('❌ Aucun utilisateur authentifié')

//     throw new Error(
//       'Vous devez être connecté pour démarrer une simulation.'
//     )
//   }

//   console.log('✅ Utilisateur authentifié:', user.id)

//   // 2. Vérifier que le simulateur existe
//   const { data: simulator, error: simulatorError } = await supabase
//     .from('simulators')
//     .select('id')
//     .eq('id', simulatorId)
//     .single()

//   if (simulatorError) {
//     console.error('❌ Simulator error:', simulatorError)

//     throw new Error(
//       `Impossible de récupérer le simulateur: ${simulatorError.message}`
//     )
//   }

//   if (!simulator) {
//     throw new Error('Simulateur introuvable.')
//   }

//   // 3. Créer la session
//   const { data, error } = await supabase
//     .from('simulation_sessions')
//     .insert({
//       simulator_id: simulator.id,
//       user_id: user.id,
//     })
//     .select()
//     .single()

//   if (error) {
//     console.error('❌ createSession DB error:', {
//       message: error.message,
//       code: error.code,
//       details: error.details,
//       hint: error.hint,
//     })

//     throw new Error(
//       `Impossible de créer la session: ${error.message}`
//     )
//   }

//   console.log('✅ Session créée:', data.id)

//   return data as SimulationSession
// }




export async function createSession(simulatorId: string) {


  console.log('🔵 createSession() démarrée')
  console.log('🔵 simulatorId:', simulatorId)

  // 1. Vérifier la session Supabase
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  console.log('🔐 Session:', session)
  console.log('🔐 Session error:', sessionError)

  if (sessionError) {
    throw new Error(
      `Erreur récupération session: ${sessionError.message}`
    )
  }

  if (!session) {
    throw new Error(
      'Auth session missing! Veuillez vous reconnecter.'
    )
  }

  // 2. Récupérer l'utilisateur
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  console.log('👤 User:', user)
  console.log('👤 User error:', userError)

  if (userError) {
    throw new Error(
      `Erreur récupération utilisateur: ${userError.message}`
    )
  }

  if (!user) {
    throw new Error('Utilisateur non authentifié')
  }

  console.log('✅ User ID:', user.id)

  // 3. Créer la session
  const { data, error } = await supabase
    .from('simulation_sessions')
    .insert({
      user_id: user.id,
      simulator_id: simulatorId,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ INSERT simulation_sessions:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(
      `Impossible de créer la session: ${error.message}`
    )
  }

  console.log('✅ Simulation session créée:', data)

  return data as SimulationSession
}


// export async function createSession(simulatorId: string) {
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser()

//   if (authError || !user) {
//     console.error("❌ Auth error:", {
//       message: authError?.message,
//       status: authError?.status,
//     })

//     throw new Error(
//       "Vous devez être connecté pour lancer une simulation."
//     )
//   }

//   console.log("👤 Utilisateur connecté :", user.id)
//   console.log("🎮 Simulator ID :", simulatorId)

//   const { data, error } = await supabase
//     .from("simulation_sessions")
//     .insert({
//       user_id: user.id,
//       simulator_id: simulatorId,
//       status: "active",
//     })
//     .select()
//     .single()

//   if (error) {
//     console.error("❌ createSession DB error:", {
//       message: error.message,
//       details: error.details,
//       hint: error.hint,
//       code: error.code,
//     })

//     throw error
//   }

//   console.log("✅ Session créée :", data)

//   return data as SimulationSession
// }
// ─── Simulation Sessions ─────────────────────────────────────────
// export async function createSession(simulatorId: string) {
//   // Récupérer l'utilisateur actuellement connecté
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser()

//   console.log("👤 Utilisateur pour création session :", user)

//   if (authError) {
//     console.error("❌ Auth error:", {
//       message: authError.message,
//       status: authError.status,
//     })

//     throw authError
//   }

//   if (!user) {
//     throw new Error(
//       "Vous devez être connecté pour démarrer une simulation."
//     )
//   }

//   // Créer la session
//   const { data, error } = await supabase
//     .from("simulation_sessions")
//     .insert({
//       simulator_id: simulatorId,
//       user_id: user.id,
//       status: "active",
//     })
//     .select()
//     .single()

//   if (error) {
//     console.error("❌ createSession error:", {
//       message: error.message,
//       details: error.details,
//       hint: error.hint,
//       code: error.code,
//     })

//     throw error
//   }

//   console.log("✅ Session créée :", data)

//   return data as SimulationSession
// }

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



/* ============================================================
   Types
   ============================================================ */


/* ============================================================
   Configuration
   ============================================================ */



/**
 * Types des réponses des Edge Functions
 */



/**
 * Appelle une Edge Function Supabase de manière sécurisée.
 *
 * L'authentification est récupérée directement depuis
 * le client Supabase. supabase.functions.invoke()
 * s'occupe de construire correctement la requête.
 */
async function callEdgeFunction<TResponse, TBody extends object>(
  functionName: string,
  body: TBody
): Promise<TResponse> {
  console.log('========================================')
  console.log('🔵 EDGE FUNCTION')
  console.log('Function:', functionName)
  console.log('Body:', body)

  /**
   * Vérification de la session avant l'appel.
   */
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('❌ Session error:', sessionError)
    throw new Error(
      `Erreur de session Supabase: ${sessionError.message}`
    )
  }

  if (!session) {
    console.error('❌ Aucune session Supabase')
    throw new Error(
      'Session Supabase absente. Veuillez vous reconnecter.'
    )
  }

  console.log('✅ Session présente')
  console.log('👤 User ID:', session.user.id)
  console.log(
    '🔑 Access token présent:',
    Boolean(session.access_token)
  )

  /**
   * Appel officiel Supabase Edge Function.
   *
   * Ne plus utiliser fetch() manuellement ici.
   */
  const { data, error } = await supabase.functions.invoke<TResponse>(
    functionName,
    {
      body,
    }
  )

  if (error) {
    console.error(
      `❌ Edge Function "${functionName}" error:`,
      error
    )

    throw new Error(
      `Edge Function "${functionName}" : ${error.message}`
    )
  }

  if (!data) {
    console.error(
      `❌ Edge Function "${functionName}" n'a retourné aucune donnée`
    )

    throw new Error(
      `Edge Function "${functionName}" n'a retourné aucune donnée.`
    )
  }

  console.log(
    `✅ Edge Function "${functionName}" réussie`
  )

  console.log('Response:', data)
  console.log('========================================')

  return data
}

/**
 * Envoie un message à l'IA Mistral.
 */
export async function sendChatMessage(
  sessionId: string,
  userMessage: string,
  systemPrompt: string,
  history: SessionMessage[]
): Promise<MistralChatResponse> {
  return callEdgeFunction<MistralChatResponse, {
    session_id: string
    user_message: string
    system_prompt: string
    history: Array<{
      role: SessionMessage['role']
      content: string
    }>
  }>(
    'mistral-chat',
    {
      session_id: sessionId,
      user_message: userMessage,
      system_prompt: systemPrompt,
      history: history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }
  )
}

/**
 * Obtient les recommandations d'orientation.
 */
export async function getOrientationRecommendations(
  answers: {
    question: string
    answer: string
  }[]
): Promise<OrientationRecommendation> {
  return callEdgeFunction<
    OrientationRecommendation,
    {
      answers: {
        question: string
        answer: string
      }[]
    }
  >(
    'mistral-orientation',
    {
      answers,
    }
  )
}

/**
 * Évalue une session de simulation.
 */
export async function evaluateSession(
  sessionId: string
): Promise<MistralEvaluationResponse> {
  return callEdgeFunction<
    MistralEvaluationResponse,
    {
      session_id: string
    }
  >(
    'mistral-evaluation',
    {
      session_id: sessionId,
    }
  )
}
