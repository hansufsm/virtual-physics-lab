import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AudioWaveform } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MaxwellControls } from "@/components/maxwell/MaxwellControls";
import { MaxwellMeasurements } from "@/components/maxwell/MaxwellMeasurements";
import { MaxwellVisualization } from "@/components/maxwell/MaxwellVisualization";
import { MaxwellDataTab } from "@/components/maxwell/MaxwellDataTab";
import { MaxwellTheoryTab } from "@/components/maxwell/MaxwellTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeMaxwell, type MaxwellParams } from "@/lib/physics";

const MaxwellExperiment = () => {
  const [params, setParams] = useState<MaxwellParams>({ T_K: 300, M_g_per_mol: 28, vMax_m_s: 2500 });
  const results = useMemo(() => computeMaxwell(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-52 · Termodinâmica · Maxwell-Boltzmann</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <AudioWaveform className="h-3.5 w-3.5" /> Teoria cinética
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">Distribuição de velocidades</h1>
          <p className="mt-2 text-muted-foreground text-balance">f(v) ∝ v²·exp(−Mv²/(2RT)). Compare v_mp, v̄ e v_rms para diferentes gases e T.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <MaxwellControls params={params} onChange={setParams} />
            <MaxwellMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><MaxwellVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><MaxwellDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4"><div className="rounded-xl border border-border bg-card p-6 shadow-card"><MaxwellTheoryTab /></div></TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Maxwell-Boltzmann"
                  contextSummary={{ T_K: params.T_K, M: params.M_g_per_mol, v_mp: results.v_mp, v_rms: results.v_rms }}
                  suggestions={["Por que v_rms > v̄ > v_mp?", "Como T altera a distribuição?", "Relação com energia cinética média?", "Por que He escapa da atmosfera?"]}
                  placeholder="Pergunte sobre Maxwell-Boltzmann..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default MaxwellExperiment;