import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StandingWaveControls } from "@/components/standingwave/StandingWaveControls";
import { StandingWaveMeasurements } from "@/components/standingwave/StandingWaveMeasurements";
import { StandingWaveVisualization } from "@/components/standingwave/StandingWaveVisualization";
import { StandingWaveDataTab } from "@/components/standingwave/StandingWaveDataTab";
import { StandingWaveTheoryTab } from "@/components/standingwave/StandingWaveTheoryTab";
import { StandingWaveAssistantTab } from "@/components/standingwave/StandingWaveAssistantTab";
import { computeStandingWave, type StandingWaveParams } from "@/lib/physics";

const StandingWaveExperiment = () => {
  const [params, setParams] = useState<StandingWaveParams>({
    L: 1.0,
    T: 80,
    mu: 0.005,
    mode: 1,
    amplitude: 0.05,
    boundary: "fixed-fixed",
    damping: 0,
  });

  const results = useMemo(() => computeStandingWave(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-21 · Ondas</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Ondas mecânicas · Modos normais
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Ondas estacionárias em corda
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Varie tração, densidade linear e modo: visualize os harmônicos, identifique nós e ventres
            e verifique fₙ = (n/2L)·√(T/μ) para corda fixa-fixa ou (2n−1)·v/(4L) para fixa-livre.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <StandingWaveControls params={params} onChange={setParams} />
            <StandingWaveMeasurements results={results} />
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
                <StandingWaveVisualization params={params} />
                <p className="text-xs text-muted-foreground">
                  A curva colorida é a corda em um instante t; as linhas cinza são o envelope ±A|sin(kx)|.
                  Pontos pretos marcam os nós e linhas tracejadas indicam os ventres.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <StandingWaveDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <StandingWaveTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <StandingWaveAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StandingWaveExperiment;