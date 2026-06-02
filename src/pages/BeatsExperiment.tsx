import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AudioWaveform } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BeatsControls } from "@/components/beats/BeatsControls";
import { BeatsMeasurements } from "@/components/beats/BeatsMeasurements";
import { BeatsVisualization } from "@/components/beats/BeatsVisualization";
import { BeatsDataTab } from "@/components/beats/BeatsDataTab";
import { BeatsTheoryTab } from "@/components/beats/BeatsTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeBeats, type BeatsParams } from "@/lib/physics";

const BeatsExperiment = () => {
  const [params, setParams] = useState<BeatsParams>({ f1_Hz: 10, f2_Hz: 11, A_m: 1, duration_s: 3 });
  const results = useMemo(() => computeBeats(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-49 · Oscilações · Batimentos</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <AudioWaveform className="h-3.5 w-3.5" /> Superposição de ondas
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Batimentos e superposição de MHS
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            x(t) = 2A·cos(πΔf·t)·cos(2π f̄ t). A frequência de batimento f_b = |f₁−f₂| modula a portadora f̄ = (f₁+f₂)/2.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <BeatsControls params={params} onChange={setParams} />
            <BeatsMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><BeatsVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><BeatsDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><BeatsTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Batimentos"
                  contextSummary={{ f1: params.f1_Hz, f2: params.f2_Hz, f_beat: results.fBeat_Hz, f_avg: results.fAvg_Hz }}
                  suggestions={["Por que f_batimento = |f₁−f₂|?", "Como afinadores usam batimentos?", "Qual a diferença entre envelope e portadora?", "O que acontece quando f₁ = f₂?"]}
                  placeholder="Pergunte sobre batimentos..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default BeatsExperiment;