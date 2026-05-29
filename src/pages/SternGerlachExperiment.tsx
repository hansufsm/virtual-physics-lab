import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Magnet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SternControls } from "@/components/stern/SternControls";
import { SternMeasurements } from "@/components/stern/SternMeasurements";
import { SternVisualization } from "@/components/stern/SternVisualization";
import { SternDataTab } from "@/components/stern/SternDataTab";
import { SternTheoryTab } from "@/components/stern/SternTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeSternGerlach, type SternParams } from "@/lib/physics";

const SternGerlachExperiment = () => {
  const [params, setParams] = useState<SternParams>({
    presetIndex: 0, gradient_T_per_m: 1000, ovenTemp_K: 1000,
    magnetLength_m: 0.1, driftLength_m: 0.5,
  });
  const results = useMemo(() => computeSternGerlach(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-31 · Stern–Gerlach</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Magnet className="h-3.5 w-3.5" /> Física quântica · Quantização do spin
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Experimento de Stern–Gerlach
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Átomos neutros passam por um campo magnético com gradiente ∂B/∂z. A força F = μ_z (∂B/∂z) separa o feixe em
            componentes discretas — duas para spin 1/2 — evidenciando a quantização espacial do momento magnético.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <SternControls params={params} onChange={setParams} />
            <SternMeasurements results={results} />
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
                <SternVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  O detector registra apenas duas faixas — m_s = +1/2 (azul) e m_s = -1/2 (rosa) — refutando a previsão clássica de um disco contínuo.
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <SternDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <SternTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Experimento de Stern–Gerlach"
                  contextSummary={{
                    particula: results.preset.name,
                    gradiente_T_per_m: params.gradient_T_per_m,
                    Tforno_K: params.ovenTemp_K,
                    v_media_m_s: results.v_mean,
                    separacao_mm: results.deflection_m * 1000,
                    feixes: results.beams,
                  }}
                  suggestions={[
                    "Por que o feixe se divide em apenas dois?",
                    "Como Stern–Gerlach revelou o spin?",
                    "O que aconteceria com spin 1?",
                    "Como funcionam SG sequenciais (medidas não-comutativas)?",
                  ]}
                  placeholder="Pergunte sobre spin e medida quântica..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SternGerlachExperiment;