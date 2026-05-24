import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Radiation } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DecayControls } from "@/components/decay/DecayControls";
import { DecayMeasurements } from "@/components/decay/DecayMeasurements";
import { DecayVisualization } from "@/components/decay/DecayVisualization";
import { DecayDataTab } from "@/components/decay/DecayDataTab";
import { DecayTheoryTab } from "@/components/decay/DecayTheoryTab";
import { DecayAssistantTab } from "@/components/decay/DecayAssistantTab";
import { computeRadioactiveDecay, RADIO_ISOTOPES, type DecayParams } from "@/lib/physics";

const RadioactiveDecayExperiment = () => {
  const iodo = RADIO_ISOTOPES.find((i) => i.name === "I-131")!;
  const [params, setParams] = useState<DecayParams>({
    isotopeName: iodo.name,
    halfLifeS: iodo.halfLifeS,
    N0: 1000,
    timeS: iodo.halfLifeS, // começa em t = T½
    tMaxMultiplier: 6,
  });

  const results = useMemo(() => computeRadioactiveDecay(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-24 · Física nuclear</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Radiation className="h-3.5 w-3.5" /> Física nuclear · Decaimento exponencial
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Decaimento radioativo
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Explore a lei N(t) = N₀ e^(−λt): escolha um isótopo, ajuste N₀ e o instante de
            observação, e compare a curva analítica com a simulação estocástica núcleo a núcleo.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <DecayControls params={params} onChange={setParams} />
            <DecayMeasurements params={params} results={results} />
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
                <DecayVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Cada ponto é um núcleo. A cada passo Δt, cada núcleo decai com probabilidade
                  p = 1 − e^(−λΔt). A linha cheia mostra a previsão analítica N₀ e^(−λt).
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <DecayDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <DecayTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <DecayAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RadioactiveDecayExperiment;