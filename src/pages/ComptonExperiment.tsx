import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ComptonControls } from "@/components/compton/ComptonControls";
import { ComptonMeasurements } from "@/components/compton/ComptonMeasurements";
import { ComptonVisualization } from "@/components/compton/ComptonVisualization";
import { ComptonDataTab } from "@/components/compton/ComptonDataTab";
import { ComptonTheoryTab } from "@/components/compton/ComptonTheoryTab";
import { ComptonAssistantTab } from "@/components/compton/ComptonAssistantTab";
import { computeCompton, type ComptonParams } from "@/lib/physics";

const ComptonExperiment = () => {
  const [params, setParams] = useState<ComptonParams>({ E0_keV: 511, thetaDeg: 90 });
  const results = useMemo(() => computeCompton(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-27 · Espalhamento Compton</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Física quântica · Natureza corpuscular da luz
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Espalhamento Compton
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Um fóton de raios-X colide com um elétron livre e é espalhado com comprimento de onda maior:
            Δλ = (h/m_e c)(1 − cos θ). A demonstração definitiva de que a luz carrega momento p = h/λ.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ComptonControls params={params} onChange={setParams} />
            <ComptonMeasurements params={params} results={results} />
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
                <ComptonVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Fóton incidente em vermelho; fóton espalhado em verde a θ; elétron recua a φ (azul).
                  A cor do fóton espalhado escurece à medida que ele perde energia.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <ComptonDataTab params={params} results={results} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <ComptonTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <ComptonAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ComptonExperiment;