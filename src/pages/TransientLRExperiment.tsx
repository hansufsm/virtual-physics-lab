import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircuitBoard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TransientControls } from "@/components/transient/TransientControls";
import { TransientMeasurements } from "@/components/transient/TransientMeasurements";
import { TransientVisualization } from "@/components/transient/TransientVisualization";
import { TransientDataTab } from "@/components/transient/TransientDataTab";
import { TransientTheoryTab } from "@/components/transient/TransientTheoryTab";
import { TransientAssistantTab } from "@/components/transient/TransientAssistantTab";
import { computeTransient, type TransientParams } from "@/lib/physics";

const TransientLRExperiment = () => {
  const [params, setParams] = useState<TransientParams>({
    mode: "LR",
    phase: "step",
    V0: 12,
    R: 100,
    L: 0.1,        // 100 mH
    C: 1e-6,       // 1 μF
    I_init: 0,
    Vc_init: 0,
    tMax: 0.01,    // 10 ms (≈ 10·τ para LR padrão)
  });

  const results = useMemo(() => computeTransient(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-25 · Circuitos transitórios</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <CircuitBoard className="h-3.5 w-3.5" /> Circuitos · Resposta no domínio do tempo
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Transitório LR e RLC série
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Analise a carga e descarga de um circuito LR (τ = L/R) e, ao adicionar o capacitor,
            os três regimes do RLC série: subamortecido, criticamente amortecido e superamortecido —
            com fator de qualidade Q e frequência natural ω₀.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <TransientControls params={params} onChange={setParams} />
            <TransientMeasurements params={params} results={results} />
          </aside>

          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>

              <TabsContent value="simulacao" className="mt-4 space-y-3">
                <TransientVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  As bolinhas representam o fluxo de corrente: sua velocidade e direção acompanham
                  i(t) em tempo real. Em RLC subamortecido, observe a corrente oscilando e trocando de sinal.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <TransientDataTab params={params} results={results} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <TransientTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <TransientAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TransientLRExperiment;