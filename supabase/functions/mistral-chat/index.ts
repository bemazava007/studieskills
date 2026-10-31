import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  session_id: string;
  user_message: string;
  system_prompt: string;
  history: ChatMessage[];
}

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-small-latest";

Deno.serve(async (req: Request) => {
  // IMPORTANT : répondre au preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      session_id,
      user_message,
      system_prompt,
      history,
    } = (await req.json()) as ChatRequest;

    if (!session_id || !user_message || !system_prompt) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: session_id, user_message, system_prompt",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const mistralKey = Deno.env.get("MISTRAL_API_KEY");

    if (!mistralKey) {
      return new Response(
        JSON.stringify({
          error: "MISTRAL_API_KEY is not configured",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const messages = [
      {
        role: "system" as const,
        content: system_prompt,
      },
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user" as const,
        content: user_message,
      },
    ];

    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mistralKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();

      return new Response(
        JSON.stringify({
          error: `Mistral API error: ${mistralResponse.status}`,
          detail: errorText,
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const mistralData = await mistralResponse.json();

    const reply =
      mistralData.choices?.[0]?.message?.content ?? "";

    if (!reply) {
      throw new Error("Mistral returned an empty response");
    }

    // Client Supabase avec service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Supabase environment variables are missing"
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    const { error: insertError } = await supabase
      .from("session_messages")
      .insert([
        {
          session_id,
          role: "user",
          content: user_message,
        },
        {
          session_id,
          role: "assistant",
          content: reply,
        },
      ]);

    if (insertError) {
      throw new Error(
        `Failed to save messages: ${insertError.message}`
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("mistral-chat error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});