const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Msg { role: "user" | "assistant"; content: string }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json() as { messages: Msg[]; context?: Record<string, unknown> };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ctxStr = context ? JSON.stringify(context, null, 2) : "(sem contexto)";
    const expName = (context && typeof (context as any).experimento === "string")
      ? (context as any).experimento
      : "experimento atual";
    const systemPrompt = `Você é um tutor de Física Geral em nível universitário (graduação), integrado a um Laboratório Virtual.

Domínio: toda a Física Geral universitária, incluindo Mecânica (cinemática, dinâmica, leis de Newton, trabalho e energia, momento linear e angular, rotação, gravitação), Oscilações e Ondas (MHS, ondas mecânicas, som), Fluidos, Termodinâmica (calor, gases ideais, leis da termodinâmica, entropia), Eletricidade e Magnetismo (eletrostática, lei de Gauss, potencial, capacitores, corrente, circuitos DC/AC, RC/RL/RLC, campo magnético, lei de Ampère, indução de Faraday, equações de Maxwell), Óptica (geométrica, ondulatória, interferência, difração, polarização) e introdução à Física Moderna (relatividade restrita, quântica básica, física atômica e nuclear).

Estilo: claro, didático, em português do Brasil. Use notação matemática simples (ex.: F = m·a, V = R·I, λ = h/p, PV = nRT). Conecte o experimento atual a conceitos fundamentais e, quando relevante, sugira variações de parâmetros e analogias com outros tópicos da Física Geral.

Contexto atual do experimento (${expName}):
${ctxStr}

Responda de forma concisa (máx. ~6 parágrafos curtos). Você pode responder a qualquer dúvida de Física Geral em nível universitário, mesmo que vá além do experimento atual. Se o estudante perguntar algo totalmente fora do escopo de Física, redirecione gentilmente.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace para continuar." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lab-assistant error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});