import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StefanControls } from "@/components/stefan/StefanControls";
import { StefanMeasurements } from "@/components/stefan/StefanMeasurements";
import { StefanVisualization } from "@/components/stefan/StefanVisualization";
import { StefanDataTab } from "@/components/stefan/StefanDataTab";
import { StefanTheoryTab } from "@/components/stefan/StefanTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeStefan, type StefanParams } from "@/lib/physics";

const StefanExperiment = () => {
  const [params, setParams] = useState<StefanParams>({ T1_K: 1200, T2_K: 300, emissivity: 0.9, area_m2: 0.1 });
  const results = useMemo(() => computeStefan(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-53 · Termodinâmica · Radiação</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sun className="h-3.5 w-3.5" /> Stefan-Boltzmann & Wien
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Transferência por radiação</h1>
          <p className="mt-2 text-muted-foreground text-balance">P = εσA T⁴, troca líquida com o ambiente e deslocamento espectral λ_máx = b/T.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <StefanControls params={params} onChange={setParams} />
            <StefanMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><StefanVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><StefanDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><StefanTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Stefan-Boltzmann"
                  contextSummary={{ T1: params.T1_K, T2: params.T2_K, eps: params.emissivity, P_net: results.P_net_W, lambda_max_nm: results.lambda_max_m * 1e9 }}
                  suggestions={["Por que P escala com T⁴?", "O que é a lei de Wien?", "Diferença entre corpo negro e cinza?", "Como o Sol aquece a Terra?"]}
                  placeholder="Pergunte sobre radiação..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default StefanExperiment;