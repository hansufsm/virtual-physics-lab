import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Triangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InclineControls } from "@/components/incline/InclineControls";
import { InclineMeasurements } from "@/components/incline/InclineMeasurements";
import { InclineVisualization } from "@/components/incline/InclineVisualization";
import { InclineDataTab } from "@/components/incline/InclineDataTab";
import { InclineTheoryTab } from "@/components/incline/InclineTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeIncline, type InclineParams } from "@/lib/physics";

const InclineExperiment = () => {
  const [params, setParams] = useState<InclineParams>({ angle_deg: 30, mass_kg: 2, mu_s: 0.45, mu_k: 0.30, g: 9.81, length_m: 3 });
  const results = useMemo(() => computeIncline(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-44 · Plano inclinado</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Triangle className="h-3.5 w-3.5" /> Mecânica · Dinâmica
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Plano inclinado com atrito
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Decomponha o peso em F∥ = mg sin θ e F⊥ = mg cos θ. Compare atrito estático e cinético e encontre o ângulo crítico θ_c = arctan(μ_s).
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <InclineControls params={params} onChange={setParams} />
            <InclineMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><InclineVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><InclineDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><InclineTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Plano inclinado"
                  contextSummary={{ angle_deg: params.angle_deg, mu_s: params.mu_s, mu_k: params.mu_k, willMove: results.willMove, a_m_s2: results.acceleration_m_s2, angle_crit_deg: results.angle_critical_deg }}
                  suggestions={["Por que μ_s > μ_k?","Como medir μ_s experimentalmente?","Qual é o ângulo crítico aqui?","O que muda em Marte?"]}
                  placeholder="Pergunte sobre o plano inclinado..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default InclineExperiment;