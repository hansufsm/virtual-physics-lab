import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LensControls } from "@/components/lens/LensControls";
import { LensMeasurements } from "@/components/lens/LensMeasurements";
import { LensVisualization } from "@/components/lens/LensVisualization";
import { LensDataTab } from "@/components/lens/LensDataTab";
import { LensTheoryTab } from "@/components/lens/LensTheoryTab";
import { LensAssistantTab } from "@/components/lens/LensAssistantTab";
import { computeThinLens, type ThinLensParams } from "@/lib/physics";

const LensExperiment = () => {
  const [params, setParams] = useState<ThinLensParams>({
    mode: "focal",
    focalCm: 10,
    shape: "biconvex",
    R1cm: 20,
    R2cm: -20,
    nLens: 1.5,
    nMedium: 1.0,
    objectDistanceCm: 25,
    objectHeightCm: 3,
  });

  const results = useMemo(() => computeThinLens(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-19 · Óptica geométrica</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Óptica · Lentes finas
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Lentes finas — equação de Gauss e formação de imagem
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Aplique 1/f = 1/d₀ + 1/dᵢ e a equação dos fabricantes 1/f = (n−1)(1/R₁ − 1/R₂) e
            observe a imagem formada por traçado dos três raios principais.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <LensControls params={params} onChange={setParams} />
            <LensMeasurements results={results} params={params} />
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
                <LensVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Três raios são traçados: paralelo ao eixo (refrata pelo foco), pelo centro óptico (segue reto) e pelo foco do lado do objeto (sai paralelo). Sua interseção marca a imagem.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <LensDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <LensTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <LensAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LensExperiment;