import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PoiseuilleControls } from "@/components/poiseuille/PoiseuilleControls";
import { PoiseuilleMeasurements } from "@/components/poiseuille/PoiseuilleMeasurements";
import { PoiseuilleVisualization } from "@/components/poiseuille/PoiseuilleVisualization";
import { PoiseuilleDataTab } from "@/components/poiseuille/PoiseuilleDataTab";
import { PoiseuilleTheoryTab } from "@/components/poiseuille/PoiseuilleTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computePoiseuille, type PoiseuilleParams } from "@/lib/physics";

const PoiseuilleExperiment = () => {
  const [params, setParams] = useState<PoiseuilleParams>({ deltaP_Pa: 5000, L_m: 1, radius_mm: 2, eta_Pas: 1e-3, rho_kg_m3: 1000 });
  const results = useMemo(() => computePoiseuille(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-56 · Fluidos · Poiseuille</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Activity className="h-3.5 w-3.5" /> Escoamento laminar
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Escoamento de Poiseuille em tubo cilíndrico</h1>
          <p className="mt-2 text-muted-foreground text-balance">Perfil parabólico v(r), vazão Q ∝ R⁴ ΔP/(ηL) e resistência hidráulica.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <PoiseuilleControls params={params} onChange={setParams} />
            <PoiseuilleMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><PoiseuilleVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><PoiseuilleDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><PoiseuilleTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Poiseuille"
                  contextSummary={{ Q_Ls: results.Q_m3s * 1000, v_max: results.v_max, Re: results.reynolds, Rh: results.resistance }}
                  suggestions={["Por que Q escala com R⁴?", "Quando o escoamento deixa de ser laminar?", "Como isso se relaciona com fluxo sanguíneo?", "O que é resistência hidráulica?"]}
                  placeholder="Pergunte sobre Poiseuille..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default PoiseuilleExperiment;