import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BlackbodyControls } from "@/components/blackbody/BlackbodyControls";
import { BlackbodyMeasurements } from "@/components/blackbody/BlackbodyMeasurements";
import { BlackbodyVisualization } from "@/components/blackbody/BlackbodyVisualization";
import { BlackbodyDataTab } from "@/components/blackbody/BlackbodyDataTab";
import { BlackbodyTheoryTab } from "@/components/blackbody/BlackbodyTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeBlackbody, type BlackbodyParams } from "@/lib/physics";

const BlackbodyExperiment = () => {
  const [params, setParams] = useState<BlackbodyParams>({ T_K: 5778, lambdaMin_nm: 50, lambdaMax_nm: 5000 });
  const results = useMemo(() => computeBlackbody(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-38 · Corpo Negro · Planck</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Flame className="h-3.5 w-3.5" /> Física quântica · Termodinâmica
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Radiação de corpo negro e lei de Planck
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            O espectro B(λ,T) depende apenas de T. A lei de Planck (E = hf) resolveu a catástrofe do UV e inaugurou
            a mecânica quântica. Compare Planck com Rayleigh–Jeans e Wien.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <BlackbodyControls params={params} onChange={setParams} />
            <BlackbodyMeasurements params={params} results={results} />
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
                <BlackbodyVisualization results={results} />
              </TabsContent>
              <TabsContent value="dados" className="mt-4"><BlackbodyDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><BlackbodyTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Corpo negro / Planck"
                  contextSummary={{ T_K: params.T_K, peak_nm: results.peak_nm, total_Wm2: results.total_Wm2 }}
                  suggestions={[
                    "Por que Rayleigh–Jeans falha no UV?",
                    "Como a hipótese de Planck resolveu o problema?",
                    "Como derivar a lei de Wien a partir de Planck?",
                    "Por que o Sol parece amarelo se λ_max ≈ verde?",
                  ]}
                  placeholder="Pergunte sobre Planck, Wien, Stefan..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default BlackbodyExperiment;
