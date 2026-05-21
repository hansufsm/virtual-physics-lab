import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalorimetryControls } from "@/components/calorimetry/CalorimetryControls";
import { CalorimetryMeasurements } from "@/components/calorimetry/CalorimetryMeasurements";
import { CalorimetryVisualization } from "@/components/calorimetry/CalorimetryVisualization";
import { CalorimetryDataTab } from "@/components/calorimetry/CalorimetryDataTab";
import { CalorimetryTheoryTab } from "@/components/calorimetry/CalorimetryTheoryTab";
import { CalorimetryAssistantTab } from "@/components/calorimetry/CalorimetryAssistantTab";
import { computeCalorimetry, type CalorimetryParams } from "@/lib/physics";

const CalorimetryExperiment = () => {
  const [params, setParams] = useState<CalorimetryParams>({
    mWater: 0.2,
    TWater: 20,
    mSolid: 0.1,
    TSolid: 100,
    cSolid: 385,
    solidName: "Cobre",
    mIce: 0,
    CCal: 30,
    TCal: 20,
    tauSeconds: 10,
  });

  const results = useMemo(() => computeCalorimetry(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-22 · Termodinâmica</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Termodinâmica · Calor sensível & latente
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Calorimetria e mudanças de fase
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Combine água, um sólido quente e gelo em um calorímetro: aplique ΣQ = 0 considerando
            calor sensível (Q = mcΔT) e calor latente de fusão (Q = m·L_f) e encontre a temperatura
            final de equilíbrio.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <CalorimetryControls params={params} onChange={setParams} />
            <CalorimetryMeasurements params={params} results={results} />
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
                <CalorimetryVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Cor da água indica a temperatura atual (azul→vermelho). O bloco sólido e o gelo
                  trocam calor com a água até o equilíbrio. A aproximação ao equilíbrio é exponencial
                  com constante de tempo τ ajustável.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <CalorimetryDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <CalorimetryTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <CalorimetryAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CalorimetryExperiment;