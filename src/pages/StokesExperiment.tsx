import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Circle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StokesControls } from "@/components/stokes/StokesControls";
import { StokesMeasurements } from "@/components/stokes/StokesMeasurements";
import { StokesVisualization } from "@/components/stokes/StokesVisualization";
import { StokesDataTab } from "@/components/stokes/StokesDataTab";
import { StokesTheoryTab } from "@/components/stokes/StokesTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeStokes, type StokesParams } from "@/lib/physics";

const StokesExperiment = () => {
  const [params, setParams] = useState<StokesParams>({ radius_mm: 1, rho_sphere: 7800, rho_fluid: 1260, eta_Pas: 1.4 });
  const results = useMemo(() => computeStokes(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-55 · Fluidos · Stokes</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Circle className="h-3.5 w-3.5" /> Viscosidade · Arrasto laminar
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Lei de Stokes — esfera em fluido viscoso</h1>
          <p className="mt-2 text-muted-foreground text-balance">Arrasto F = 6πηrv, velocidade terminal e validade do regime laminar (Re ≪ 1).</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <StokesControls params={params} onChange={setParams} />
            <StokesMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><StokesVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><StokesDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><StokesTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Lei de Stokes"
                  contextSummary={{ v_t: results.v_terminal, Re: results.reynolds, tau: results.tau_s }}
                  suggestions={["Quando a lei de Stokes falha?", "Como medir viscosidade com este método?", "Conexão com o experimento de Millikan?", "O que é número de Reynolds?"]}
                  placeholder="Pergunte sobre viscosidade..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default StokesExperiment;