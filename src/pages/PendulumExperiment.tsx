import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PendulumControls } from "@/components/pendulum/PendulumControls";
import { PendulumMeasurements } from "@/components/pendulum/PendulumMeasurements";
import { PendulumVisualization } from "@/components/pendulum/PendulumVisualization";
import { PendulumDataTab } from "@/components/pendulum/PendulumDataTab";
import { PendulumTheoryTab } from "@/components/pendulum/PendulumTheoryTab";
import { PendulumAssistantTab } from "@/components/pendulum/PendulumAssistantTab";
import { simulatePendulum, type PendulumParams } from "@/lib/physics";

const PendulumExperiment = () => {
  const [params, setParams] = useState<PendulumParams>({
    length: 1.0,
    mass: 1.0,
    gravity: 9.80665,
    angle0Deg: 20,
    omega0: 0,
    damping: 0,
    duration: 20,
    nonlinear: true,
  });

  const results = useMemo(() => simulatePendulum(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-17 · Oscilações</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Oscilações · MHS
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Pêndulo simples e MHS
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Compare a equação não-linear θ̈ + (g/L) sin θ = 0 com a aproximação linear, observe o
            efeito do amortecimento e valide T = 2π√(L/g).
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <PendulumControls params={params} onChange={setParams} />
            <PendulumMeasurements results={results} />
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
                <PendulumVisualization results={results} params={params} />
                <p className="text-xs text-muted-foreground">
                  A massa oscila em torno do equilíbrio sob ação do torque −m g L sin θ. O traço pontilhado mostra o arco percorrido.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <PendulumDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <PendulumTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <PendulumAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PendulumExperiment;