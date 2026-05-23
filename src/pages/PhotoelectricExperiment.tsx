import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PhotoelectricControls } from "@/components/photoelectric/PhotoelectricControls";
import { PhotoelectricMeasurements } from "@/components/photoelectric/PhotoelectricMeasurements";
import { PhotoelectricVisualization } from "@/components/photoelectric/PhotoelectricVisualization";
import { PhotoelectricDataTab } from "@/components/photoelectric/PhotoelectricDataTab";
import { PhotoelectricTheoryTab } from "@/components/photoelectric/PhotoelectricTheoryTab";
import { PhotoelectricAssistantTab } from "@/components/photoelectric/PhotoelectricAssistantTab";
import { computePhotoelectric, type PhotoelectricParams } from "@/lib/physics";

const PhotoelectricExperiment = () => {
  const [params, setParams] = useState<PhotoelectricParams>({
    wavelengthNm: 405,
    intensity: 5,
    voltage: 0,
    materialName: "Sódio",
    phiEv: 2.36,
    quantumEfficiency: 0.05,
    areaCm2: 1.0,
  });

  const results = useMemo(() => computePhotoelectric(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-23 · Física quântica</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Física quântica · Quantização da luz
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Efeito fotoelétrico
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Verifique a equação de Einstein hf = φ + K_máx: varie λ, a intensidade e o material
            do cátodo, levante a curva I × V, encontre a tensão de frenagem e estime h pela
            inclinação de V_s × f.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <PhotoelectricControls params={params} onChange={setParams} />
            <PhotoelectricMeasurements params={params} results={results} />
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
                <PhotoelectricVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Fótons (cor da luz) incidem no cátodo. Acima do limiar f₀, elétrons são ejetados
                  com K ≤ K_máx = hf − φ. O ânodo coleta os elétrons; tensão V &lt; 0 freia o feixe
                  e em V = −V_s a corrente cessa.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <PhotoelectricDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <PhotoelectricTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <PhotoelectricAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PhotoelectricExperiment;