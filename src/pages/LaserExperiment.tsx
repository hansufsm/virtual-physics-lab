import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LaserControls } from "@/components/laser/LaserControls";
import { LaserMeasurements } from "@/components/laser/LaserMeasurements";
import { LaserVisualization } from "@/components/laser/LaserVisualization";
import { LaserDataTab } from "@/components/laser/LaserDataTab";
import { LaserTheoryTab } from "@/components/laser/LaserTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeLaser, type LaserParams } from "@/lib/physics";

const LaserExperiment = () => {
  const [params, setParams] = useState<LaserParams>({
    L_mm: 300, R1: 0.999, R2: 0.97, lambda_nm: 632.8, gainBW_GHz: 1.5, pump_ratio: 1.2,
  });
  const results = useMemo(() => computeLaser(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-37 · Laser · Fabry–Perot</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sun className="h-3.5 w-3.5" /> Óptica · Física quântica
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Laser e cavidade Fabry–Perot
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Emissão estimulada amplifica a luz numa cavidade ressonante de comprimento L. Apenas modos longitudinais
            ν_m = m·c/2L com ganho acima das perdas oscilam — selecionados pela curva de ganho do meio ativo.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <LaserControls params={params} onChange={setParams} />
            <LaserMeasurements results={results} />
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
                <LaserVisualization results={results} />
                <p className="text-xs text-muted-foreground">
                  Reduza R₂ para baixar a finesse e alargar os modos; aumente L para diminuir o FSR.
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <LaserDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <LaserTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Laser / Fabry–Perot"
                  contextSummary={{
                    L_mm: params.L_mm, lambda_nm: params.lambda_nm,
                    R1: params.R1, R2: params.R2, pump: params.pump_ratio,
                    fsr_GHz: results.fsr_GHz, finesse: results.finesse,
                    linewidth_MHz: results.linewidth_MHz, coherence_m: results.coherence_m,
                    modos_lasing: results.modes.filter((m) => m.lasing).length,
                  }}
                  suggestions={[
                    "Por que apenas modos longitudinais discretos oscilam?",
                    "Como o bombeamento se relaciona com o limiar?",
                    "O que define o comprimento de coerência?",
                    "Como funciona um Fabry–Perot como filtro?",
                  ]}
                  placeholder="Pergunte sobre cavidades e laser..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default LaserExperiment;