import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FoucaultControls } from "@/components/foucault/FoucaultControls";
import { FoucaultMeasurements } from "@/components/foucault/FoucaultMeasurements";
import { FoucaultVisualization } from "@/components/foucault/FoucaultVisualization";
import { FoucaultDataTab } from "@/components/foucault/FoucaultDataTab";
import { FoucaultTheoryTab } from "@/components/foucault/FoucaultTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeFoucault, type FoucaultParams } from "@/lib/physics";

const FoucaultExperiment = () => {
  const [params, setParams] = useState<FoucaultParams>({ L_m: 67, latitude_deg: 48.85, amplitude_deg: 5, time_s: 3600, g: 9.81 });
  const results = useMemo(() => computeFoucault(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-41 · Pêndulo de Foucault</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Waves className="h-3.5 w-3.5" /> Mecânica · Referenciais
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Pêndulo de Foucault e rotação da Terra
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Coriolis no referencial girante faz o plano de oscilação precessar com Ω = Ω_⊕ sin φ. Demonstração
            visual da rotação terrestre — sem rotação aparente no equador, mais rápida nos polos.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <FoucaultControls params={params} onChange={setParams} />
            <FoucaultMeasurements params={params} results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><FoucaultVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><FoucaultDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><FoucaultTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Pêndulo de Foucault"
                  contextSummary={{ latitude_deg: params.latitude_deg, L_m: params.L_m, T_pendulo_s: results.T_s, T_prec_h: results.T_prec_h, rotacao_deg: results.rotation_deg }}
                  suggestions={[
                    "Por que não há precessão no equador?",
                    "Por que o pêndulo no hemisfério sul gira ao contrário?",
                    "De onde vem a força de Coriolis?",
                    "Quanto tempo para girar 360° em Paris?",
                  ]}
                  placeholder="Pergunte sobre Foucault e Coriolis..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default FoucaultExperiment;
