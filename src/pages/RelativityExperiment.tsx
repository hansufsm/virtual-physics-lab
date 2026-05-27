import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Rocket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RelativityControls } from "@/components/relativity/RelativityControls";
import { RelativityMeasurements } from "@/components/relativity/RelativityMeasurements";
import { RelativityVisualization } from "@/components/relativity/RelativityVisualization";
import { RelativityDataTab } from "@/components/relativity/RelativityDataTab";
import { RelativityTheoryTab } from "@/components/relativity/RelativityTheoryTab";
import { RelativityAssistantTab } from "@/components/relativity/RelativityAssistantTab";
import { computeRelativity, type RelativityParams } from "@/lib/physics";

const RelativityExperiment = () => {
  const [params, setParams] = useState<RelativityParams>({
    beta: 0.8,
    scenario: "dilation",
    L0_m: 30,
    dt0_s: 1,
    u_over_c: 0.5,
    travelDistanceLy: 4.37, // Proxima Centauri
  });
  const results = useMemo(() => computeRelativity(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-28 · Relatividade especial</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Rocket className="h-3.5 w-3.5" /> Relatividade · Transformações de Lorentz
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Relatividade especial
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            γ = 1/√(1−β²) governa a dilatação do tempo Δt = γΔt₀, a contração de Lorentz L = L₀/γ,
            a soma relativística de velocidades e o paradoxo dos gêmeos.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <RelativityControls params={params} onChange={setParams} />
            <RelativityMeasurements params={params} results={results} />
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
                <RelativityVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Nave de comprimento próprio L₀ vista do referencial do laboratório: contraída por 1/γ.
                  Relógios próprio (a bordo) e do laboratório avançam em ritmos diferentes.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <RelativityDataTab params={params} results={results} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <RelativityTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <RelativityAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RelativityExperiment;