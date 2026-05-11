import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DoubleSlitControls } from "@/components/doubleslit/DoubleSlitControls";
import { DoubleSlitMeasurements } from "@/components/doubleslit/DoubleSlitMeasurements";
import { DoubleSlitVisualization } from "@/components/doubleslit/DoubleSlitVisualization";
import { DoubleSlitDataTab } from "@/components/doubleslit/DoubleSlitDataTab";
import { DoubleSlitTheoryTab } from "@/components/doubleslit/DoubleSlitTheoryTab";
import { DoubleSlitAssistantTab } from "@/components/doubleslit/DoubleSlitAssistantTab";
import { computeDoubleSlit, type DoubleSlitParams } from "@/lib/physics";

const DoubleSlitExperiment = () => {
  const [params, setParams] = useState<DoubleSlitParams>({
    wavelengthNm: 633,
    slitSepUm: 50,
    slitWidthUm: 10,
    screenDistanceM: 1.5,
    numSlits: 2,
    showEnvelope: true,
    probeMm: 0,
  });

  const derived = useMemo(() => computeDoubleSlit(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-15 · Óptica ondulatória</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Óptica ondulatória · Fenda dupla
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Difração e interferência (fenda dupla)
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Padrão de Young modulado pelo envelope da fenda única. Varie λ, d, a e N para
            transitar entre fenda única, fenda dupla e rede de difração.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <DoubleSlitControls params={params} onChange={setParams} />
            <DoubleSlitMeasurements params={params} derived={derived} />
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
                <DoubleSlitVisualization params={params} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Esquerda: padrão na tela na cor da luz. Direita: I(y)/I₀ com envelope sinc² tracejado.
                  Linha horizontal: ponto de prova.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <DoubleSlitDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <DoubleSlitTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <DoubleSlitAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoubleSlitExperiment;