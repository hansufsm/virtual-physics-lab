import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { RLCParams, RLCResults } from "@/lib/physics";

interface Msg { role: "user" | "assistant"; content: string }

interface Props { params: RLCParams; results: RLCResults }

const SUGGESTIONS = [
  "O que acontece com Q se eu reduzir R pela metade?",
  "Por que V_L pode ser maior que a tensão da fonte?",
  "Como escolher L e C para sintonizar 1 kHz?",
  "Qual a diferença entre ressonância série e paralela?",
];

export const RLCAssistantTab = ({ params, results }: Props) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lab-assistant`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            experimento: "Circuito RLC série",
            parametros: params,
            resultados: {
              f0_Hz: results.f0,
              f_atual_Hz: params.freqHz,
              XL_ohm: results.xL,
              XC_ohm: results.xC,
              Z_ohm: results.impedance,
              fase_graus: results.phaseDeg,
              I_rms_A: results.currentRms,
              VR_V: results.vR, VL_V: results.vL, VC_V: results.vC,
              Q: results.Q,
              banda_Hz: results.bandwidthHz,
            },
          },
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Limite de requisições atingido. Aguarde um instante.");
        else if (resp.status === 402) toast.error("Créditos de IA esgotados.");
        else toast.error("Falha ao consultar o assistente.");
        setLoading(false);
        return;
      }

      let assistant = "";
      setMessages((p) => [...p, { role: "assistant", content: "" }]);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      while (!done) {
        const { value, done: rDone } = await reader.read();
        if (rDone) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistant += delta;
              setMessages((p) => p.map((m, i) => i === p.length - 1 ? { ...m, content: assistant } : m));
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro de rede ao consultar o assistente.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-gradient-subtle">
        <Sparkles className="h-4 w-4 text-primary" />
        <div>
          <h3 className="font-display font-semibold text-sm leading-tight">Assistente IA</h3>
          <p className="text-xs text-muted-foreground">Conhece os parâmetros do RLC série</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Pergunte sobre ressonância, fator Q, defasagem ou aplicações em filtros.
            </p>
            <div className="grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm rounded-lg border border-border bg-background hover:bg-secondary hover:border-primary/40 transition-smooth px-3 py-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-secondary text-secondary-foreground rounded-bl-sm"
            }`}>
              {m.content || (loading && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : null)}
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 p-3 border-t border-border bg-background"
        onSubmit={(e) => { e.preventDefault(); send(input); }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo sobre o circuito RLC..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="icon">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};