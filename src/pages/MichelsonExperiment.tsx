import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MichelsonControls } from "@/components/michelson/MichelsonControls";
import { MichelsonMeasurements } from "@/components/michelson/MichelsonMeasurements";
import { MichelsonVisualization } from "@/components/michelson/MichelsonVisualization";
import { MichelsonDataTab } from "@/components/michelson/MichelsonDataTab";
import { MichelsonTheoryTab } from "@/components/michelson/MichelsonTheoryTab";
import { MichelsonAssistantTab } from "@/components/michelson/MichelsonAssistantTab";
import { computeMichelson, type MichelsonParams } from "@/lib/physics";

const MichelsonExperiment = () => {
  const [params, setParams] = useState<MichelsonParams>({
    mode: "circular",
    wavelengthNm: 632.8,    // HeNe
    L1mm: 100,
    L2mm: 100.001,          // 1 μm de diferença → vários anéis
    tiltMrad: 0.5,
    visibility: 0.95,
    screenSizeMm: 20,
    apertureMm: 18,
  });

  const results = useMemo(() => computeMichelson(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-26 · Interferômetro de Michelson</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Eye className="h-3.5 w-3.5" /> Óptica · Interferência por divisão de amplitude
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Interferômetro de Michelson
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Um divisor 50/50 reparte o feixe em dois braços terminados por espelhos M₁ e M₂.
            Ao recombinar, a diferença de caminho Δ = 2(L₂ − L₁) produz franjas circulares (igual inclinação)
            ou retilíneas (com leve inclinação de um espelho). Cada λ/2 deslocado em M₂ desloca uma franja inteira.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <MichelsonControls params={params} onChange={setParams} />
            <MichelsonMeasurements params={params} results={results} />
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
                <MichelsonVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  À esquerda: esquema óptico (fonte, divisor, M₁ fixo e M₂ móvel). À direita: padrão no anteparo.
                  Deslize L₂ e veja franjas “correrem” — cada λ/2 deslocado equivale a uma franja inteira.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <MichelsonDataTab params={params} results={results} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <MichelsonTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <MichelsonAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MichelsonExperiment;