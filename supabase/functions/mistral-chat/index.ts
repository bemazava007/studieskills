import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  session_id: string
  user_message: string
  system_prompt: string
  history: ChatMessage[]
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_MODEL = 'mistral-small-latest'
async function fetchMistralWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options)

    if (response.status !== 429) {
      return response
    }

    if (attempt === maxRetries) {
      return response
    }

    const delay = 1000 * Math.pow(2, attempt)

    await new Promise(resolve => setTimeout(resolve, delay))
  }

  throw new Error('Mistral request failed after retries')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { session_id, user_message, system_prompt, history } = await req.json() as ChatRequest

    if (!session_id || !user_message || !system_prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: session_id, user_message, system_prompt' }),
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

    // Build conversation messages for Mistral
    const messages = [
      { role: 'system' as const, content: system_prompt },
      ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: user_message },
    ]

    const mistralResponse = await fetchMistralWithRetry(MISTRAL_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${mistralKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: MISTRAL_MODEL,
    messages,
    temperature: 0.8,
    max_tokens: 500,
  }),
})

   if (!mistralResponse.ok) {
  const errText = await mistralResponse.text()

  const status = mistralResponse.status === 429
    ? 429
    : 502

  return new Response(
    JSON.stringify({
      error: 'Mistral API error',
      status: mistralResponse.status,
      detail: errText,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    },
  )
}

    const mistralData = await mistralResponse.json()
    const reply = mistralData.choices?.[0]?.message?.content ?? ''

    // Persist both messages to the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    await supabase.from('session_messages').insert([
      { session_id, role: 'user', content: user_message },
      { session_id, role: 'assistant', content: reply },
    ])

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
