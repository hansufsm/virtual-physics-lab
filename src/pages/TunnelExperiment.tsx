import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TunnelControls } from "@/components/tunnel/TunnelControls";
import { TunnelMeasurements } from "@/components/tunnel/TunnelMeasurements";
import { TunnelVisualization } from "@/components/tunnel/TunnelVisualization";
import { TunnelDataTab } from "@/components/tunnel/TunnelDataTab";
import { TunnelTheoryTab } from "@/components/tunnel/TunnelTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeTunnel, type TunnelParams } from "@/lib/physics";

const TunnelExperiment = () => {
  const [params, setParams] = useState<TunnelParams>({ V0_eV: 5, a_nm: 0.5, E_eV: 4, mass_me: 1 });
  const results = useMemo(() => computeTunnel(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-40 · Tunelamento Quântico</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Lock className="h-3.5 w-3.5" /> Mecânica quântica
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Tunelamento por barreira de potencial
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            T(E, a, V₀) para uma barreira retangular: sensibilidade exponencial à largura, ressonâncias acima da
            barreira e fundamentos do STM, decaimento α e diodo túnel.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <TunnelControls params={params} onChange={setParams} />
            <TunnelMeasurements params={params} results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><TunnelVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><TunnelDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><TunnelTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Tunelamento quântico"
                  contextSummary={{ V0_eV: params.V0_eV, a_nm: params.a_nm, E_eV: params.E_eV, T: results.T, regime: results.regime }}
                  suggestions={[
                    "Por que T cresce exponencialmente ao reduzir a?",
                    "Como Gamow explicou o decaimento α?",
                    "O que são as ressonâncias acima da barreira?",
                    "Como o STM gera imagens atômicas?",
                  ]}
                  placeholder="Pergunte sobre tunelamento..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default TunnelExperiment;
