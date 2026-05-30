import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MillikanControls } from "@/components/millikan/MillikanControls";
import { MillikanMeasurements } from "@/components/millikan/MillikanMeasurements";
import { MillikanVisualization } from "@/components/millikan/MillikanVisualization";
import { MillikanDataTab } from "@/components/millikan/MillikanDataTab";
import { MillikanTheoryTab } from "@/components/millikan/MillikanTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeMillikan, type MillikanParams } from "@/lib/physics";

const MillikanExperiment = () => {
  const [params, setParams] = useState<MillikanParams>({
    radius_um: 1.0, charges_n: 3, rho_oil: 880, rho_air: 1.20,
    eta: 1.81e-5, plateGap_mm: 5, voltage_V: 400, g: 9.81,
  });
  const results = useMemo(() => computeMillikan(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-35 · Millikan</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Eletromagnetismo · Carga elementar
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Gota de óleo de Millikan
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Gotas carregadas pairam entre placas paralelas quando qE equilibra o peso menos o empuxo. Medindo a
            tensão necessária revela-se que toda carga é múltipla inteira de e = 1,602×10⁻¹⁹ C (Nobel 1923).
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <MillikanControls params={params} onChange={setParams} />
            <MillikanMeasurements results={results} />
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
                <MillikanVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Para suspender a gota: qE = (m − m_ar)g. Ajuste V até a velocidade vertical ser nula.
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <MillikanDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <MillikanTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Millikan"
                  contextSummary={{
                    r_um: params.radius_um, n_cargas: params.charges_n,
                    V: params.voltage_V, d_mm: params.plateGap_mm,
                    q_C: results.q, q_sobre_e: results.q_over_e,
                    v_subida_mms: results.v_rise_mms,
                  }}
                  suggestions={[
                    "Como Millikan demonstrou a quantização da carga?",
                    "Por que usar gotas e não esferas macroscópicas?",
                    "Qual o papel da viscosidade (Stokes) no método?",
                    "Como medir o raio da gota?",
                  ]}
                  placeholder="Pergunte sobre a carga elementar..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default MillikanExperiment;