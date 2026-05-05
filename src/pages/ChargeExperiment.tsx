import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom, Play, Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChargeControls } from "@/components/charge/ChargeControls";
import { ChargeMeasurements } from "@/components/charge/ChargeMeasurements";
import { ChargeVisualization } from "@/components/charge/ChargeVisualization";
import { ChargeDataTab } from "@/components/charge/ChargeDataTab";
import { ChargeTheoryTab } from "@/components/charge/ChargeTheoryTab";
import { ChargeAssistantTab } from "@/components/charge/ChargeAssistantTab";
import { computeChargeDerived, type ChargeParams } from "@/lib/physics";

const ChargeExperiment = () => {
  const [params, setParams] = useState<ChargeParams>({
    mode: "bOnly",
    chargeE: 1,
    massP: 1,
    v0: 5e5,
    E: 1e5,
    B: 0.2,
    vDee: 5000,
  });
  const [running, setRunning] = useState(true);

  const derived = useMemo(() => computeChargeDerived(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-09 · Eletromagnetismo</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Eletromagnetismo · Força de Lorentz
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Movimento de carga em campos E e B
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Estude trajetórias parabólicas em campo elétrico, órbitas circulares em campo magnético, o seletor
            de velocidades de Wien e o ciclotron — tudo pela mesma equação F = q(E + v × B).
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ChargeControls params={params} onChange={setParams} />
            <ChargeMeasurements params={params} derived={derived} />
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
                <ChargeVisualization params={params} running={running} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    A trajetória é calculada por RK4 sobre F = q(E + v × B). Os símbolos ⊙/⊗ indicam B
                    saindo/entrando do plano; setas vermelhas indicam o sentido de E.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} className="gap-1.5 shrink-0">
                    {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Animar</>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <ChargeDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <ChargeTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <ChargeAssistantTab params={params} derived={derived} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ChargeExperiment;