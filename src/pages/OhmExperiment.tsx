import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CircuitVisualization } from "@/components/ohm/CircuitVisualization";
import { OhmControls } from "@/components/ohm/OhmControls";
import { OhmMeasurements } from "@/components/ohm/OhmMeasurements";
import { OhmDataTab } from "@/components/ohm/OhmDataTab";
import { OhmTheoryTab } from "@/components/ohm/OhmTheoryTab";
import { OhmAssistantTab } from "@/components/ohm/OhmAssistantTab";
import { computeOhm, MATERIALS, type OhmParams } from "@/lib/physics";

const OhmExperiment = () => {
  const [params, setParams] = useState<OhmParams>({
    voltage: 5,
    resistivity: MATERIALS["Níquel-cromo"],
    lengthCm: 100,
    diameterMm: 0.3,
    internalOhm: 0.5,
    noisePct: 0.01,
  });

  const results = useMemo(() => computeOhm(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-02 · Circuitos</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Activity className="h-3.5 w-3.5" /> Eletricidade · Circuitos DC
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Lei de Ohm e resistividade
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Monte um circuito simples com fonte, amperímetro e voltímetro. Varie a tensão e a geometria do fio para
            verificar V = R·I e estimar a resistividade do material.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <OhmControls params={params} onChange={setParams} />
            <OhmMeasurements results={results} />
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
                <CircuitVisualization params={params} results={results} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Os pontos animados representam o sentido convencional da corrente; sua densidade e velocidade
                  são proporcionais a |I|.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <OhmDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <OhmTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <OhmAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OhmExperiment;