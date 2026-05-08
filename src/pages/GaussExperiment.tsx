import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GaussControls } from "@/components/gauss/GaussControls";
import { GaussMeasurements } from "@/components/gauss/GaussMeasurements";
import { GaussVisualization } from "@/components/gauss/GaussVisualization";
import { GaussDataTab } from "@/components/gauss/GaussDataTab";
import { GaussTheoryTab } from "@/components/gauss/GaussTheoryTab";
import { GaussAssistantTab } from "@/components/gauss/GaussAssistantTab";
import { computeGauss, type GaussParams } from "@/lib/physics";

const GaussExperiment = () => {
  const [params, setParams] = useState<GaussParams>({
    geometry: "point",
    Q: 10e-9,
    sourceRadiusCm: 5,
    lambda: 50e-9,
    sigma: 200e-9,
    surface: "sphere",
    surfaceRadiusCm: 8,
    surfaceLengthCm: 20,
    probeRcm: 8,
  });

  const derived = useMemo(() => computeGauss(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-12 · Eletrostática</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Eletrostática · Lei de Gauss
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Lei de Gauss — fluxo elétrico
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Explore o fluxo de E através de superfícies gaussianas (esfera, cilindro, pillbox) para
            cargas pontuais, esferas, fios e planos infinitos.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <GaussControls params={params} onChange={setParams} />
            <GaussMeasurements params={params} derived={derived} />
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
                <GaussVisualization params={params} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Linhas em azul: campo E. Tracejado: superfície gaussiana. Vermelho/azul indicam
                  carga positiva/negativa.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <GaussDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <GaussTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <GaussAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GaussExperiment;