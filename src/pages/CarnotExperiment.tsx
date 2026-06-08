import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CarnotControls } from "@/components/carnot/CarnotControls";
import { CarnotMeasurements } from "@/components/carnot/CarnotMeasurements";
import { CarnotVisualization } from "@/components/carnot/CarnotVisualization";
import { CarnotDataTab } from "@/components/carnot/CarnotDataTab";
import { CarnotTheoryTab } from "@/components/carnot/CarnotTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeCarnot, type CarnotParams } from "@/lib/physics";

const CarnotExperiment = () => {
  const [params, setParams] = useState<CarnotParams>({ moles: 1, gamma: 1.4, Th_K: 600, Tc_K: 300, V1_L: 5, V2_L: 15 });
  const results = useMemo(() => computeCarnot(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-50 · Termodinâmica · Ciclo de Carnot</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Flame className="h-3.5 w-3.5" /> Maquinas termicas
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Ciclo de Carnot</h1>
          <p className="mt-2 text-muted-foreground text-balance">Duas isotermas + duas adiabáticas entre Th e Tc. η = 1 − Tc/Th.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <CarnotControls params={params} onChange={setParams} />
            <CarnotMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><CarnotVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><CarnotDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><CarnotTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Ciclo de Carnot"
                  contextSummary={{ Th: params.Th_K, Tc: params.Tc_K, eta: results.efficiency, W: results.Wnet_J }}
                  suggestions={["Por que η Carnot é o máximo?", "Como Otto se compara a Carnot?", "Por que Tc=0 é impossível?", "O que é trabalho líquido?"]}
                  placeholder="Pergunte sobre o ciclo..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default CarnotExperiment;