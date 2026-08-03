import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface OrientationAnswer {
  question: string
  answer: string
}

interface OrientationRequest {
  answers: OrientationAnswer[]
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_MODEL = 'mistral-small-latest'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { answers } = await req.json() as OrientationRequest

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or empty answers array' }),
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

    // Fetch all professions from the database to give Mistral context
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: professions, error: profError } = await supabase
      .from('professions')
      .select('id, title, sector, required_skills, description')

    if (profError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch professions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const professionsList = (professions ?? []).map(p =>
      `- ID: ${p.id} | Titre: ${p.title} | Secteur: ${p.sector} | Competences: ${(p.required_skills ?? []).join(', ')} | Description: ${p.description}`
    ).join('\n')

    const answersText = answers.map(a => `Q: ${a.question}\nR: ${a.answer}`).join('\n\n')

    const systemPrompt = `Tu es un coach d'orientation professionnelle IA pour la plateforme StudieSkills.
Tu recois les reponses d'un jeune a un questionnaire d'orientation et une liste de metiers disponibles.

Tu dois recommander 3 a 5 metiers parmi la liste fournie qui correspondent le mieux au profil du jeune.

Pour chaque recommandation, donne:
- profession_id (l'ID exact de la liste)
- title (le titre du metier)
- sector
- match_score (un pourcentage de compatibilite entre 0 et 100)
- reason (une phrase courte en francais expliquant pourquoi ce metier convient)

Reponds UNIQUEMENT en JSON valide avec ce format:
{
  "recommendations": [
    { "profession_id": "...", "title": "...", "sector": "...", "match_score": 85, "reason": "..." }
  ]
}

Ne inclus aucun texte hors du JSON.`

    const userPrompt = `Reponses du jeune au questionnaire d'orientation:

${answersText}

Metiers disponibles:
${professionsList}

Recommande 3 a 5 metiers adaptes a ce profil.`

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
        temperature: 0.3,
        max_tokens: 800,
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

    // Parse the JSON from Mistral's response
    let recommendations
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : rawContent
      recommendations = JSON.parse(jsonStr)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI recommendations', raw: rawContent }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
