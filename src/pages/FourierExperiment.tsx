import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Thermometer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FourierControls } from "@/components/fourier/FourierControls";
import { FourierMeasurements } from "@/components/fourier/FourierMeasurements";
import { FourierVisualization } from "@/components/fourier/FourierVisualization";
import { FourierDataTab } from "@/components/fourier/FourierDataTab";
import { FourierTheoryTab } from "@/components/fourier/FourierTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeFourier, type FourierParams } from "@/lib/physics";

const FourierExperiment = () => {
  const [params, setParams] = useState<FourierParams>({
    T_hot_K: 500, T_cold_K: 300, area_m2: 1,
    layers: [
      { name: "Aço", k_W_mK: 50, L_m: 0.02 },
      { name: "Isopor", k_W_mK: 0.033, L_m: 0.05 },
      { name: "Tijolo", k_W_mK: 0.7, L_m: 0.10 },
    ],
  });
  const results = useMemo(() => computeFourier(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-51 · Termodinâmica · Condução</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Thermometer className="h-3.5 w-3.5" /> Lei de Fourier
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Condução de calor em paredes compostas</h1>
          <p className="mt-2 text-muted-foreground text-balance">q = ΔT / R_total, com R_i = L_i/(k_i·A). Perfil T(x) linear em cada camada.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <FourierControls params={params} onChange={setParams} />
            <FourierMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><FourierVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><FourierDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><FourierTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Condução de Calor"
                  contextSummary={{ q_W: results.q_W, flux: results.flux_W_m2, R_total: results.R_total_K_per_W }}
                  suggestions={["Por que a queda de T é maior no isolante?", "Como funciona resistência em série?", "O que muda em paralelo?", "Como melhorar isolamento?"]}
                  placeholder="Pergunte sobre condução..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default FourierExperiment;