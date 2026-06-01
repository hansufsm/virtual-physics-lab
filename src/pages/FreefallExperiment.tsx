import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Rocket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FreefallControls } from "@/components/freefall/FreefallControls";
import { FreefallMeasurements } from "@/components/freefall/FreefallMeasurements";
import { FreefallVisualization } from "@/components/freefall/FreefallVisualization";
import { FreefallDataTab } from "@/components/freefall/FreefallDataTab";
import { FreefallTheoryTab } from "@/components/freefall/FreefallTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeFreefall, type FreefallParams } from "@/lib/physics";

const FreefallExperiment = () => {
  const [params, setParams] = useState<FreefallParams>({ h0_m: 20, v0_m_s: 0, g: 9.81, mass_kg: 1, drag: false, k_drag: 0.3 });
  const results = useMemo(() => computeFreefall(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-43 · Queda livre</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Rocket className="h-3.5 w-3.5" /> Mecânica · Cinemática
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Queda livre e aceleração da gravidade
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            h = ½g·t² e v = √(2gh). Compare a queda no vácuo com e sem arrasto, e veja a velocidade terminal v_t = m·g/b.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <FreefallControls params={params} onChange={setParams} />
            <FreefallMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><FreefallVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><FreefallDataTab results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><FreefallTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Queda livre"
                  contextSummary={{ h0_m: params.h0_m, g: params.g, drag: params.drag, t_queda_s: results.t_fall_s, v_impacto_m_s: results.v_impact_m_s }}
                  suggestions={["Por que a massa não afeta a queda no vácuo?","O que é velocidade terminal?","Como medir g com um cronômetro?","Qual a queda em Marte vs Terra?"]}
                  placeholder="Pergunte sobre queda livre..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default FreefallExperiment;