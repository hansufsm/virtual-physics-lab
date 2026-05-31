import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HydrogenControls } from "@/components/hydrogen/HydrogenControls";
import { HydrogenMeasurements } from "@/components/hydrogen/HydrogenMeasurements";
import { HydrogenVisualization } from "@/components/hydrogen/HydrogenVisualization";
import { HydrogenDataTab } from "@/components/hydrogen/HydrogenDataTab";
import { HydrogenTheoryTab } from "@/components/hydrogen/HydrogenTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeHydrogen, type HydrogenParams } from "@/lib/physics";

const HydrogenExperiment = () => {
  const [params, setParams] = useState<HydrogenParams>({ seriesIndex: 1, nMax: 8 });
  const results = useMemo(() => computeHydrogen(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-39 · Hidrogênio · Rydberg</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Física atômica
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Átomo de hidrogênio e séries espectrais
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Níveis E_n = −13,6/n² eV. As transições emitem fótons com comprimentos dados pela fórmula de Rydberg,
            organizados em séries: Lyman, Balmer, Paschen, Brackett e Pfund.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <HydrogenControls params={params} onChange={setParams} />
            <HydrogenMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><HydrogenVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><HydrogenDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><HydrogenTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Átomo de hidrogênio"
                  contextSummary={{ serie: results.series.name, linhas: results.lines.length, visiveis: results.lines.filter(l => l.visible).length }}
                  suggestions={[
                    "Por que Balmer cai no visível?",
                    "De onde vem o fator 13,6 eV?",
                    "Qual o limite (n→∞) de cada série?",
                    "Como Bohr quantizou as órbitas?",
                  ]}
                  placeholder="Pergunte sobre o átomo de H..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default HydrogenExperiment;
