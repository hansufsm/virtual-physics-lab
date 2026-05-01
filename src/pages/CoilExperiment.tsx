import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Magnet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CoilVisualization } from "@/components/coil/CoilVisualization";
import { CoilControls } from "@/components/coil/CoilControls";
import { CoilMeasurements } from "@/components/coil/CoilMeasurements";
import { CoilDataTab } from "@/components/coil/CoilDataTab";
import { CoilTheoryTab } from "@/components/coil/CoilTheoryTab";
import { CoilAssistantTab } from "@/components/coil/CoilAssistantTab";
import { computeCoil, type CoilParams } from "@/lib/physics";

const CoilExperiment = () => {
  const [params, setParams] = useState<CoilParams>({
    type: "helmholtz",
    current: 1,
    turns: 100,
    radiusCm: 5,
    lengthCm: 20,
  });

  const results = useMemo(() => computeCoil(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-04 · Magnetismo</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Magnet className="h-3.5 w-3.5" /> Magnetismo · Biot–Savart
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Campo magnético de bobinas
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Compare espira única, solenoide finito e par de Helmholtz. Visualize o campo no plano (r, z) e
            analise o perfil Bz ao longo do eixo.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <CoilControls params={params} onChange={setParams} />
            <CoilMeasurements params={params} results={results} />
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
                <CoilVisualization params={params} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Visualização no plano meridional (r, z). Os vetores indicam direção e magnitude relativa de B
                  (escala logarítmica). Os símbolos ⊙ / ⊗ marcam a corrente saindo / entrando do plano.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <CoilDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <CoilTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <CoilAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CoilExperiment;