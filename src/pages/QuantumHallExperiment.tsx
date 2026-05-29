import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircuitBoard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { QHallControls } from "@/components/qhall/QHallControls";
import { QHallMeasurements } from "@/components/qhall/QHallMeasurements";
import { QHallVisualization } from "@/components/qhall/QHallVisualization";
import { QHallDataTab } from "@/components/qhall/QHallDataTab";
import { QHallTheoryTab } from "@/components/qhall/QHallTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeQuantumHall, type QHallParams } from "@/lib/physics";

const QuantumHallExperiment = () => {
  const [params, setParams] = useState<QHallParams>({
    density_per_m2: 3e15, B_T: 5, current_uA: 1, temperature_K: 1.5,
  });
  const results = useMemo(() => computeQuantumHall(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-32 · Hall Quântico</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <CircuitBoard className="h-3.5 w-3.5" /> Matéria condensada · Topologia
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Efeito Hall quântico
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Em um 2DEG a baixíssima temperatura e campo B intenso, R_xy forma platôs quantizados em h/(νe²) — onde ν é
            o fator de preenchimento de Landau — enquanto R_xx anula-se sobre cada platô. Padrão de resistência elétrica
            usado mundialmente.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <QHallControls params={params} onChange={setParams} />
            <QHallMeasurements results={results} />
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
                <QHallVisualization results={results} />
                <p className="text-xs text-muted-foreground">
                  Cada platô em R_xy = R_K/ν é acompanhado de um pico em R_xx na transição entre níveis de Landau cheios.
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <QHallDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <QHallTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Efeito Hall Quântico"
                  contextSummary={{
                    densidade_2D: params.density_per_m2,
                    B_T: params.B_T,
                    I_uA: params.current_uA,
                    T_K: params.temperature_K,
                    nu: results.fillingFactor,
                    Rxy: results.R_xy_Ohm,
                    Rxx: results.R_xx_Ohm,
                    plateau_nu: results.nearestPlateau,
                  }}
                  suggestions={[
                    "Por que R_xy é quantizado em h/(νe²)?",
                    "Qual o papel da topologia (estados de borda)?",
                    "Por que R_xx vai a zero sobre o platô?",
                    "Como von Klitzing definiu o ohm a partir disso?",
                  ]}
                  placeholder="Pergunte sobre quantização topológica..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default QuantumHallExperiment;