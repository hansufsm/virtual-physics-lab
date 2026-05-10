import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PotentialControls } from "@/components/potential/PotentialControls";
import { PotentialMeasurements } from "@/components/potential/PotentialMeasurements";
import { PotentialVisualization } from "@/components/potential/PotentialVisualization";
import { PotentialDataTab } from "@/components/potential/PotentialDataTab";
import { PotentialTheoryTab } from "@/components/potential/PotentialTheoryTab";
import { PotentialAssistantTab } from "@/components/potential/PotentialAssistantTab";
import { computePotential, type PotentialParams } from "@/lib/physics";

const PotentialExperiment = () => {
  const [params, setParams] = useState<PotentialParams>({
    preset: "dipole",
    qNc: 20,
    sepCm: 6,
    probeXcm: 8,
    probeYcm: 4,
    showField: true,
    showEquip: true,
    numLevels: 8,
  });

  const derived = useMemo(() => computePotential(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-14 · Eletrostática</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Eletrostática · Potencial elétrico
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Potencial elétrico e equipotenciais
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Visualize V(r) e os mapas de equipotenciais para distribuições típicas de cargas, e
            confirme a relação E = −∇V.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <PotentialControls params={params} onChange={setParams} />
            <PotentialMeasurements params={params} derived={derived} />
          </aside>

          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>

              <TabsContent value="simulacao" className="mt-4">
                <PotentialVisualization params={params} charges={derived.charges} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Mapa de cores: vermelho V &gt; 0, azul V &lt; 0. Linhas: equipotenciais (E ⊥ a elas).
                  Setas: campo E. Disco com anel: ponto de prova P.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <PotentialDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <PotentialTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <PotentialAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PotentialExperiment;