import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ForcedControls } from "@/components/forced/ForcedControls";
import { ForcedMeasurements } from "@/components/forced/ForcedMeasurements";
import { ForcedVisualization } from "@/components/forced/ForcedVisualization";
import { ForcedDataTab } from "@/components/forced/ForcedDataTab";
import { ForcedTheoryTab } from "@/components/forced/ForcedTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeForcedOscillator, type ForcedParams } from "@/lib/physics";

const ForcedOscillatorExperiment = () => {
  const [params, setParams] = useState<ForcedParams>({
    mass_kg: 0.5, k_N_per_m: 50, b_N_s_per_m: 0.5, F0_N: 5,
    driveOmega_rad_s: 10, duration_s: 10,
  });
  const results = useMemo(() => computeForcedOscillator(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-48 · Oscilações · Ressonância</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Waves className="h-3.5 w-3.5" /> Oscilações forçadas
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Oscilações forçadas e ressonância
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            m·ẍ + b·ẋ + k·x = F₀cos(ωt). Observe a curva A(ω), a defasagem φ(ω), o pico em ω_r = √(ω₀² − 2γ²) e o fator Q.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ForcedControls params={params} onChange={setParams} omega0={results.omega0_rad_s} omegaR={results.omegaR_rad_s} />
            <ForcedMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><ForcedVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><ForcedDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><ForcedTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Oscilações forçadas"
                  contextSummary={{ omega0: results.omega0_rad_s, omega_drive: params.driveOmega_rad_s, Q: results.Q, A: results.A_drive_m, phase_deg: results.phase_rad * 180 / Math.PI }}
                  suggestions={["Por que o pico ocorre em ω_r e não em ω₀?", "Como Q se relaciona com a largura da curva?", "O que acontece na fase em ω = ω₀?", "Como o amortecimento muda a amplitude máxima?"]}
                  placeholder="Pergunte sobre ressonância..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default ForcedOscillatorExperiment;