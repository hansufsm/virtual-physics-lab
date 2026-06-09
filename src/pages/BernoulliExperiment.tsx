import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BernoulliControls } from "@/components/bernoulli/BernoulliControls";
import { BernoulliMeasurements } from "@/components/bernoulli/BernoulliMeasurements";
import { BernoulliVisualization } from "@/components/bernoulli/BernoulliVisualization";
import { BernoulliDataTab } from "@/components/bernoulli/BernoulliDataTab";
import { BernoulliTheoryTab } from "@/components/bernoulli/BernoulliTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeBernoulli, type BernoulliParams } from "@/lib/physics";

const BernoulliExperiment = () => {
  const [params, setParams] = useState<BernoulliParams>({
    P1_Pa: 200000, v1_ms: 2, A1_m2: 0.01, A2_m2: 0.0025, rho_kg_m3: 1000, h1_m: 0, h2_m: 0,
  });
  const results = useMemo(() => computeBernoulli(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-54 · Fluidos · Bernoulli</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Waves className="h-3.5 w-3.5" /> Mecânica dos Fluidos
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Bernoulli e tubo de Venturi</h1>
          <p className="mt-2 text-muted-foreground text-balance">Conservação de energia em escoamentos incompressíveis: continuidade A₁v₁=A₂v₂ e queda de pressão na garganta.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <BernoulliControls params={params} onChange={setParams} />
            <BernoulliMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><BernoulliVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><BernoulliDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><BernoulliTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Bernoulli / Venturi"
                  contextSummary={{ v2: results.v2_ms, P2_kPa: results.P2_Pa / 1000, Q_Ls: results.Q_m3s * 1000, Re: results.reynolds }}
                  suggestions={["Por que a pressão cai na garganta?", "Como o Venturi mede vazão?", "Quando Bernoulli falha?", "Como uma asa gera sustentação?"]}
                  placeholder="Pergunte sobre fluidos..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default BernoulliExperiment;