import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IdealGasControls } from "@/components/idealgas/IdealGasControls";
import { IdealGasMeasurements } from "@/components/idealgas/IdealGasMeasurements";
import { IdealGasVisualization } from "@/components/idealgas/IdealGasVisualization";
import { IdealGasDataTab } from "@/components/idealgas/IdealGasDataTab";
import { IdealGasTheoryTab } from "@/components/idealgas/IdealGasTheoryTab";
import { IdealGasAssistantTab } from "@/components/idealgas/IdealGasAssistantTab";
import { simulateIdealGas, type IdealGasParams } from "@/lib/physics";

const IdealGasExperiment = () => {
  const [params, setParams] = useState<IdealGasParams>({
    process: "isothermal",
    moles: 1,
    gamma: 7 / 5,
    T1: 300,
    V1: 24.5,
    V2: 12,
    T2: 600,
    steps: 120,
  });

  const results = useMemo(() => simulateIdealGas(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-18 · Termodinâmica</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Termodinâmica · Gás ideal
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Gás ideal — equação PVT e processos
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Aplique PV = nRT e siga processos isotérmico, isobárico, isocórico e adiabático em um cilindro com pistão.
            Compare W, Q, ΔU e ΔS no diagrama P × V.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <IdealGasControls params={params} onChange={setParams} />
            <IdealGasMeasurements results={results} />
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
                <IdealGasVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  As partículas representam o movimento térmico do gás: a velocidade média cresce com T e a densidade muda com V.
                  O ponto destacado no diagrama P × V acompanha o estado atual ao longo do processo.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <IdealGasDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <IdealGasTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <IdealGasAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default IdealGasExperiment;