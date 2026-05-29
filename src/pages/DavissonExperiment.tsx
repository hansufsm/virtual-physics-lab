import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DavissonControls } from "@/components/davisson/DavissonControls";
import { DavissonMeasurements } from "@/components/davisson/DavissonMeasurements";
import { DavissonVisualization } from "@/components/davisson/DavissonVisualization";
import { DavissonDataTab } from "@/components/davisson/DavissonDataTab";
import { DavissonTheoryTab } from "@/components/davisson/DavissonTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeDavissonGermer, type DavissonParams } from "@/lib/physics";

const DavissonExperiment = () => {
  const [params, setParams] = useState<DavissonParams>({ presetIndex: 0, voltage_V: 54, maxOrder: 3 });
  const results = useMemo(() => computeDavissonGermer(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-30 · Davisson–Germer</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Waves className="h-3.5 w-3.5" /> Mecânica quântica · Dualidade onda-partícula
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Difração de elétrons (Davisson–Germer)
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Elétrons acelerados por V volts adquirem comprimento de onda λ = h/p ≈ 1,226/√V nm e difratam em planos
            cristalinos espaçados por d, com picos em sen φ = nλ/d — confirmando a hipótese de de Broglie.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <DavissonControls params={params} onChange={setParams} />
            <DavissonMeasurements params={params} results={results} />
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
                <DavissonVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Cada pico corresponde a uma ordem n; aumente V para reduzir λ e empurrar os picos para ângulos menores.
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <DavissonDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <DavissonTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Difração de elétrons (Davisson–Germer)"
                  contextSummary={{
                    cristal: results.preset.name,
                    d_nm: results.preset.d_nm,
                    V_volts: params.voltage_V,
                    lambda_nm: results.lambda_nm,
                    picos: results.peaks,
                  }}
                  suggestions={[
                    "Como deduzir λ = h/√(2mE)?",
                    "Por que existe ordem máxima n?",
                    "Como o experimento confirmou de Broglie?",
                    "Que ângulo Davisson e Germer observaram em 1927?",
                  ]}
                  placeholder="Pergunte sobre dualidade onda-partícula..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DavissonExperiment;