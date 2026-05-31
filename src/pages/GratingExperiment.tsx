import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AudioWaveform } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GratingControls } from "@/components/grating/GratingControls";
import { GratingMeasurements } from "@/components/grating/GratingMeasurements";
import { GratingVisualization } from "@/components/grating/GratingVisualization";
import { GratingDataTab } from "@/components/grating/GratingDataTab";
import { GratingTheoryTab } from "@/components/grating/GratingTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeGrating, type GratingParams } from "@/lib/physics";

const GratingExperiment = () => {
  const [params, setParams] = useState<GratingParams>({ N_per_mm: 600, lambda_nm: 632.8, N_total: 1000, angleMax_deg: 80 });
  const results = useMemo(() => computeGrating(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-42 · Rede de Difração</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <AudioWaveform className="h-3.5 w-3.5" /> Óptica ondulatória
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Difração por rede e espectrômetro
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            d sin θ = m λ produz máximos nítidos em direções discretas. Aumente N para estreitar picos (R = m·N)
            e meça a dispersão angular dθ/dλ.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <GratingControls params={params} onChange={setParams} />
            <GratingMeasurements params={params} results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><GratingVisualization results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><GratingDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><GratingTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Rede de difração"
                  contextSummary={{ N_per_mm: params.N_per_mm, lambda_nm: params.lambda_nm, d_um: results.d_um, ordens: results.orders.length, R: results.resolving_power }}
                  suggestions={[
                    "Como N afeta a largura dos picos?",
                    "Por que a ordem máxima é ⌊d/λ⌋?",
                    "Como uma rede separa o dupleto do Na?",
                    "Vantagens da rede sobre o prisma?",
                  ]}
                  placeholder="Pergunte sobre redes de difração..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default GratingExperiment;
