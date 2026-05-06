import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom, Play, Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HallControls } from "@/components/hall/HallControls";
import { HallMeasurements } from "@/components/hall/HallMeasurements";
import { HallVisualization } from "@/components/hall/HallVisualization";
import { HallDataTab } from "@/components/hall/HallDataTab";
import { HallTheoryTab } from "@/components/hall/HallTheoryTab";
import { HallAssistantTab } from "@/components/hall/HallAssistantTab";
import { computeHall, HALL_MATERIALS, type HallParams } from "@/lib/physics";

const HallExperiment = () => {
  const [params, setParams] = useState<HallParams>({
    material: "Si-n",
    carrier: HALL_MATERIALS["Si-n"].carrier,
    n: HALL_MATERIALS["Si-n"].n,
    mobility: HALL_MATERIALS["Si-n"].mobility,
    I: 0.1,
    B: 0.5,
    t: 1e-4,
    w: 5e-3,
    L: 20e-3,
  });
  const [running, setRunning] = useState(true);

  const derived = useMemo(() => computeHall(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-10 · Magnetotransporte</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Magnetotransporte · Sonda Hall
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Efeito Hall
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Meça V_H em uma barra de Hall, identifique o tipo de portador pelo sinal e determine a densidade de
            portadores n a partir do coeficiente de Hall R_H = 1/(nq).
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <HallControls params={params} onChange={setParams} />
            <HallMeasurements params={params} derived={derived} />
          </aside>

          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>

              <TabsContent value="simulacao" className="mt-4">
                <HallVisualization params={params} running={running} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Os portadores são desviados pela força de Lorentz e acumulam-se em uma das faces até que o
                    campo Hall E_H equilibre v×B. O voltímetro mostra V_H entre as faces transversais.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} className="gap-1.5 shrink-0">
                    {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Animar</>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <HallDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <HallTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <HallAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HallExperiment;