import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DipoleControls } from "@/components/dipole/DipoleControls";
import { DipoleMeasurements } from "@/components/dipole/DipoleMeasurements";
import { DipoleVisualization } from "@/components/dipole/DipoleVisualization";
import { DipoleDataTab } from "@/components/dipole/DipoleDataTab";
import { DipoleTheoryTab } from "@/components/dipole/DipoleTheoryTab";
import { DipoleAssistantTab } from "@/components/dipole/DipoleAssistantTab";
import { computeDipole, type DipoleParams } from "@/lib/physics";

const DipoleExperiment = () => {
  const [params, setParams] = useState<DipoleParams>({
    mode: "torque",
    qNc: 20,
    dCm: 4,
    Eext: 100000,
    thetaDeg: 45,
    massMg: 1,
    probeXcm: 10,
    probeYcm: 6,
  });

  const derived = useMemo(() => computeDipole(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-13 · Eletrostática</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Eletrostática · Dipolo elétrico
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Dipolo elétrico e torque
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Estude o torque τ = p × E e a energia U = −p · E em um campo externo, e visualize o
            campo gerado pelo próprio dipolo (decai com 1/r³).
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <DipoleControls params={params} onChange={setParams} />
            <DipoleMeasurements params={params} derived={derived} />
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
                <DipoleVisualization params={params} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Vermelho: +q. Azul: −q. Seta primária: vetor p. No modo "Torque", as setas
                  horizontais representam o campo externo uniforme.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <DipoleDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <DipoleTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <DipoleAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DipoleExperiment;