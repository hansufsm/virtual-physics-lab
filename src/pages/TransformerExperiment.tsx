import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom, Play, Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransformerVisualization } from "@/components/transformer/TransformerVisualization";
import { TransformerControls } from "@/components/transformer/TransformerControls";
import { TransformerMeasurements } from "@/components/transformer/TransformerMeasurements";
import { TransformerDataTab } from "@/components/transformer/TransformerDataTab";
import { TransformerTheoryTab } from "@/components/transformer/TransformerTheoryTab";
import { TransformerAssistantTab } from "@/components/transformer/TransformerAssistantTab";
import { computeTransformer, type TransformerParams } from "@/lib/physics";

const TransformerExperiment = () => {
  const [params, setParams] = useState<TransformerParams>({
    vPrimaryRms: 127,
    freqHz: 60,
    n1: 1000,
    n2: 100,
    loadOhm: 10,
    coupling: 0.99,
    r1Ohm: 0.5,
    r2Ohm: 0.05,
  });
  const [running, setRunning] = useState(true);

  const results = useMemo(() => computeTransformer(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-06 · Indução</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Indução · Circuitos AC
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Transformador
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Razão de transformação a = N₁/N₂, acoplamento magnético k e rendimento η em função das perdas e da carga.
            Compare formas de onda V₁(t) × V₂(t) e faça varreduras de N₂.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <TransformerControls params={params} onChange={setParams} />
            <TransformerMeasurements results={results} />
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
                <TransformerVisualization params={params} running={running} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    O fluxo magnético circula no núcleo (linhas tracejadas). A intensidade de cor de cada
                    enrolamento acompanha a tensão instantânea. A carga R_L é desenhada à direita.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} className="gap-1.5 shrink-0">
                    {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Animar</>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <TransformerDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <TransformerTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <TransformerAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TransformerExperiment;