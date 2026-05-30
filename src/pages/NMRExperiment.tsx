import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Magnet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NMRControls } from "@/components/nmr/NMRControls";
import { NMRMeasurements } from "@/components/nmr/NMRMeasurements";
import { NMRVisualization } from "@/components/nmr/NMRVisualization";
import { NMRDataTab } from "@/components/nmr/NMRDataTab";
import { NMRTheoryTab } from "@/components/nmr/NMRTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeNMR, type NMRParams } from "@/lib/physics";

const NMRExperiment = () => {
  const [params, setParams] = useState<NMRParams>({
    nucleusName: "1H", B0_T: 1.5, freq_MHz: 63.87, T1_ms: 800, T2_ms: 80, time_ms: 50,
  });
  const results = useMemo(() => computeNMR(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-36 · RMN</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Magnet className="h-3.5 w-3.5" /> Física quântica · Spin nuclear
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Ressonância Magnética Nuclear
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Spins nucleares precessam em torno de B₀ com a frequência de Larmor ω = γB₀. Um pulso RF de 90° põe
            a magnetização no plano xy: a FID decai com T₂ e Mz se recupera com T₁ — base da MRI.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <NMRControls params={params} onChange={setParams} />
            <NMRMeasurements results={results} />
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
                <NMRVisualization results={results} />
                <p className="text-xs text-muted-foreground">
                  Ajuste freq_RF para sintonizar a Larmor. Detuning ≠ 0 produz oscilação na FID.
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <NMRDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <NMRTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="RMN"
                  contextSummary={{
                    nucleo: params.nucleusName, B0_T: params.B0_T,
                    freq_RF_MHz: params.freq_MHz, larmor_MHz: results.larmor_MHz,
                    detuning_kHz: results.detuning_kHz, T1_ms: params.T1_ms, T2_ms: params.T2_ms,
                  }}
                  suggestions={[
                    "O que diferencia T₁ de T₂?",
                    "Como a frequência de Larmor define a imagem de MRI?",
                    "Por que ¹H é o núcleo mais usado?",
                    "O que aconteceria com B₀ não-uniforme?",
                  ]}
                  placeholder="Pergunte sobre spin e RMN..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default NMRExperiment;