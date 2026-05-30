import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FranckHertzControls } from "@/components/franckhertz/FranckHertzControls";
import { FranckHertzMeasurements } from "@/components/franckhertz/FranckHertzMeasurements";
import { FranckHertzVisualization } from "@/components/franckhertz/FranckHertzVisualization";
import { FranckHertzDataTab } from "@/components/franckhertz/FranckHertzDataTab";
import { FranckHertzTheoryTab } from "@/components/franckhertz/FranckHertzTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeFranckHertz, type FranckHertzParams } from "@/lib/physics";

const FranckHertzExperiment = () => {
  const [params, setParams] = useState<FranckHertzParams>({
    gasName: "Mercúrio (Hg)", excitation_eV: 4.9, V_acc_max: 30, V_retard: 1.5, T_C: 170,
  });
  const results = useMemo(() => computeFranckHertz(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-34 · Franck–Hertz</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Física atômica · Quantização de energia
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Experimento de Franck–Hertz
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Elétrons acelerados em vapor de mercúrio perdem energia em colisões inelásticas quando atingem 4,9 eV — a
            curva I(V) apresenta quedas periódicas, prova direta da quantização atômica (Nobel 1925).
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <FranckHertzControls params={params} onChange={setParams} />
            <FranckHertzMeasurements results={results} />
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
                <FranckHertzVisualization results={results} />
                <p className="text-xs text-muted-foreground">
                  Os picos ficam separados por ΔV ≈ E_exc. A largura aumenta com a temperatura (mais colisões).
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <FranckHertzDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <FranckHertzTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Franck–Hertz"
                  contextSummary={{
                    gas: params.gasName, E_exc_eV: params.excitation_eV,
                    V_retard: params.V_retard, T_C: params.T_C,
                    spacing_V: results.spacing_V, photon_nm: results.photon_nm,
                    n_peaks: results.peaks.length,
                  }}
                  suggestions={[
                    "Por que aparecem quedas periódicas na corrente?",
                    "Qual é a relação entre ΔV e o nível excitado?",
                    "Qual fóton é emitido na desexcitação do Hg?",
                    "Por que o potencial retardador é importante?",
                  ]}
                  placeholder="Pergunte sobre quantização atômica..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default FranckHertzExperiment;