import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RCVisualization } from "@/components/rc/RCVisualization";
import { RCControls } from "@/components/rc/RCControls";
import { RCMeasurements } from "@/components/rc/RCMeasurements";
import { RCDataTab } from "@/components/rc/RCDataTab";
import { RCTheoryTab } from "@/components/rc/RCTheoryTab";
import { RCAssistantTab } from "@/components/rc/RCAssistantTab";
import { computeRC, rcCurrent, rcVoltage, type RCParams } from "@/lib/physics";

const RCExperiment = () => {
  const [params, setParams] = useState<RCParams>({
    emf: 12,
    resistanceK: 10,
    capacitanceUf: 100,
    mode: "charge",
    v0: 0,
  });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [t, setT] = useState(0);

  const results = useMemo(() => computeRC(params), [params]);
  const vc = useMemo(() => rcVoltage(params, t), [params, t]);
  const ic = useMemo(() => rcCurrent(params, t), [params, t]);

  // Animation loop
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(performance.now());
  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (running) {
        // Cap dt to avoid jumps when tab regains focus
        const dtClamped = Math.min(dt, 0.1);
        setT((prev) => prev + dtClamped * speed);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, speed]);

  // Reset time when mode/params critically change
  useEffect(() => { setT(0); }, [params.mode]);

  const handleReset = () => { setT(0); setRunning(false); };

  const handleParamsChange = (p: RCParams) => {
    setParams(p);
    // If user toggles to discharge, ensure v0 makes sense
    if (p.mode === "discharge" && p.v0 <= 0) p.v0 = p.emf;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-03 · Circuitos</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Activity className="h-3.5 w-3.5" /> Eletricidade · Transitórios
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Circuito RC — carga e descarga
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Observe a evolução exponencial de Vc(t) e i(t), meça a constante de tempo τ = R·C e linearize a curva
            para extrair τ a partir do coeficiente angular.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <RCControls
              params={params}
              onChange={handleParamsChange}
              running={running}
              onToggleRun={() => setRunning((r) => !r)}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            <RCMeasurements params={params} results={results} t={t} vc={vc} ic={ic} />
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
                <RCVisualization params={params} vc={vc} ic={ic} running={running} />
                <p className="mt-3 text-xs text-muted-foreground">
                  O preenchimento das placas indica a carga acumulada. Os pontos animados representam o sentido
                  e a magnitude da corrente i(t) — eles desaparecem quando o capacitor atinge o regime permanente.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <RCDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <RCTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <RCAssistantTab params={params} results={results} t={t} vc={vc} ic={ic} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RCExperiment;