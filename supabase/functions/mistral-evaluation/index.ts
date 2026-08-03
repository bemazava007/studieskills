import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface EvaluationRequest {
  session_id: string
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_MODEL = 'mistral-small-latest'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { session_id } = await req.json() as EvaluationRequest

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing session_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const mistralKey = Deno.env.get('MISTRAL_API_KEY')
    if (!mistralKey) {
      return new Response(
        JSON.stringify({ error: 'Mistral API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch session, simulator, and messages
    const { data: session, error: sessionErr } = await supabase
      .from('simulation_sessions')
      .select('*, simulator:simulators(title, skills_evaluated, system_prompt)')
      .eq('id', session_id)
      .maybeSingle()

    if (sessionErr || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { data: messages } = await supabase
      .from('session_messages')
      .select('role, content')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true })

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages to evaluate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const skills = session.simulator?.skills_evaluated ?? ['Communication', 'Empathie', 'Resolution']
    const conversation = messages.map(m => `${m.role === 'user' ? 'Conseiller' : 'Client'}: ${m.content}`).join('\n\n')

    const systemPrompt = `Tu es un evaluateur IA pour la plateforme StudieSkills.
Tu analyses une conversation de simulation professionnelle entre un jeune (le conseiller) et un client IA.

Tu dois evaluer les competences du jeune sur les axes suivants: ${skills.join(', ')}.

Pour chaque competence, donne:
- skill_name: le nom de la competence
- score: un score de 0 a 100
- feedback: un commentaire constructif court en francais

Donne aussi:
- overall_score: un score global de 0 a 100
- summary: un resume de la performance en 2-3 phrases en francais
- progress_plan: pour chaque competence en dessous de 80, propose un plan d'amelioration avec:
  - skill_name
  - current_score
  - target_score (80 par defaut)
  - exercises: un tableau de 2-3 exercices concrets en francais

Reponds UNIQUEMENT en JSON valide avec ce format:
{
  "overall_score": 75,
  "skills": [{ "skill_name": "...", "score": 80, "feedback": "..." }],
  "summary": "...",
  "progress_plan": [{ "skill_name": "...", "current_score": 50, "target_score": 80, "exercises": ["...", "..."] }]
}

Ne inclus aucun texte hors du JSON.`

    const userPrompt = `Simulation: ${session.simulator?.title ?? 'Session'}
Competences evaluees: ${skills.join(', ')}

Conversation:
${conversation}

Evalue la performance du jeune (le conseiller) sur ces competences.`

    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    })

    if (!mistralResponse.ok) {
      const errText = await mistralResponse.text()
      return new Response(
        JSON.stringify({ error: `Mistral API error: ${mistralResponse.status}`, detail: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const mistralData = await mistralResponse.json()
    const rawContent = mistralData.choices?.[0]?.message?.content ?? ''

    let evaluation
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : rawContent
      evaluation = JSON.parse(jsonStr)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI evaluation', raw: rawContent }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Persist the evaluation results to the database
    // 1. Update session with score and completed status
    await supabase
      .from('simulation_sessions')
      .update({
        status: 'completed',
        score: evaluation.overall_score ?? 0,
        completed_at: new Date().toISOString(),
      })
      .eq('id', session_id)

    // 2. Insert skill evaluations
    if (evaluation.skills && Array.isArray(evaluation.skills)) {
      const evalRows = evaluation.skills.map((s: any) => ({
        session_id,
        skill_name: s.skill_name,
        score: Math.max(0, Math.min(100, s.score)),
        feedback: s.feedback ?? '',
      }))
      await supabase.from('skill_evaluations').insert(evalRows)
    }

    // 3. Insert progress plans
    if (evaluation.progress_plan && Array.isArray(evaluation.progress_plan)) {
      // Get user_id from the session
      const planRows = evaluation.progress_plan.map((p: any) => ({
        session_id,
        user_id: session.user_id,
        skill_name: p.skill_name,
        current_score: p.current_score ?? 0,
        target_score: p.target_score ?? 80,
        exercises: p.exercises ?? [],
      }))
      await supabase.from('progress_plans').insert(planRows)
    }

    return new Response(
      JSON.stringify(evaluation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
