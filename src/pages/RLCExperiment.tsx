import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom, Play, Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RLCVisualization } from "@/components/rlc/RLCVisualization";
import { RLCControls } from "@/components/rlc/RLCControls";
import { RLCMeasurements } from "@/components/rlc/RLCMeasurements";
import { RLCDataTab } from "@/components/rlc/RLCDataTab";
import { RLCTheoryTab } from "@/components/rlc/RLCTheoryTab";
import { RLCAssistantTab } from "@/components/rlc/RLCAssistantTab";
import { computeRLC, type RLCParams } from "@/lib/physics";

const RLCExperiment = () => {
  const [params, setParams] = useState<RLCParams>({
    vSourceRms: 5,
    freqHz: 1000,
    resistanceOhm: 50,
    inductanceMh: 10,
    capacitanceUf: 2.5,
  });
  const [running, setRunning] = useState(true);

  const results = useMemo(() => computeRLC(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-07 · Circuitos AC</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Circuitos AC · Ressonância
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Circuito RLC série — ressonância
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Explore reatâncias X_L e X_C, defasagem φ entre tensão e corrente, fator de qualidade Q
            e a curva de ressonância em torno de f₀ = 1/(2π√LC).
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <RLCControls params={params} onChange={setParams} />
            <RLCMeasurements results={results} />
          </aside>

          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>

              <TabsContent value="simulacao" className="mt-4">
                <RLCVisualization params={params} running={running} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    À esquerda, o diagrama de fasores: V_R em fase com a corrente, V_L adiantada 90°,
                    V_C atrasada 90°. À direita, v(t) e i(t) com defasagem φ.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} className="gap-1.5 shrink-0">
                    {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Animar</>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <RLCDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <RLCTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <RLCAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RLCExperiment;