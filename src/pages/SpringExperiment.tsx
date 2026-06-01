import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SpringControls } from "@/components/spring/SpringControls";
import { SpringMeasurements } from "@/components/spring/SpringMeasurements";
import { SpringVisualization } from "@/components/spring/SpringVisualization";
import { SpringDataTab } from "@/components/spring/SpringDataTab";
import { SpringTheoryTab } from "@/components/spring/SpringTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeSpring, type SpringParams } from "@/lib/physics";

const SpringExperiment = () => {
  const [params, setParams] = useState<SpringParams>({ k_N_per_m: 50, k2_N_per_m: 50, assoc: "single", mass_kg: 0.5, amplitude_m: 0.10, time_s: 0.2, g: 9.81 });
  const results = useMemo(() => computeSpring(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-45 · Lei de Hooke · MHS</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Waves className="h-3.5 w-3.5" /> Mecânica · Oscilações
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Lei de Hooke e movimento harmônico simples
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            F = −k·x conduz a x(t) = A·cos(ωt) com T = 2π√(m/k). Energia ½kA² oscila entre cinética e potencial.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <SpringControls params={params} onChange={setParams} />
            <SpringMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><SpringVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><SpringDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><SpringTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Mola e MHS"
                  contextSummary={{ k_eq: results.k_eq_N_per_m, T_s: results.T_s, assoc: params.assoc, m: params.mass_kg, A_m: params.amplitude_m }}
                  suggestions={["Por que o período não depende da amplitude?","Como série e paralelo afetam k_eq?","Onde a velocidade é máxima?","g afeta o período?"]}
                  placeholder="Pergunte sobre mola e MHS..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default SpringExperiment;