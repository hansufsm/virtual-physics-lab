import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AmpereControls } from "@/components/ampere/AmpereControls";
import { AmpereMeasurements } from "@/components/ampere/AmpereMeasurements";
import { AmpereVisualization } from "@/components/ampere/AmpereVisualization";
import { AmpereDataTab } from "@/components/ampere/AmpereDataTab";
import { AmpereTheoryTab } from "@/components/ampere/AmpereTheoryTab";
import { AmpereAssistantTab } from "@/components/ampere/AmpereAssistantTab";
import { computeAmpere, type AmpereParams } from "@/lib/physics";

const AmpereExperiment = () => {
  const [params, setParams] = useState<AmpereParams>({
    geometry: "parallel",
    I1: 10,
    I2: 10,
    separationCm: 4,
    wireLengthM: 1,
    N: 500,
    rMeanCm: 8,
    aMinorCm: 1.5,
    probeXcm: 3,
    probeYcm: 3,
  });

  const derived = useMemo(() => computeAmpere(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-11 · Magnetostática</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Magnetostática · Lei de Ampère
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Lei de Ampère — fios e toroide
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Calcule B em torno de fios retilíneos, a força entre dois fios paralelos e o campo confinado em
            um toroide enrolado com N espiras.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <AmpereControls params={params} onChange={setParams} />
            <AmpereMeasurements params={params} derived={derived} />
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
                <AmpereVisualization params={params} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Símbolos: ⊙ corrente saindo do plano · ⊗ corrente entrando. A seta no ponto de prova
                  mostra a direção e magnitude relativa de B.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <AmpereDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <AmpereTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <AmpereAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AmpereExperiment;