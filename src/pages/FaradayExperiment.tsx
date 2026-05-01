import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Magnet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FaradayVisualization } from "@/components/faraday/FaradayVisualization";
import { FaradayControls } from "@/components/faraday/FaradayControls";
import { FaradayMeasurements } from "@/components/faraday/FaradayMeasurements";
import { FaradayDataTab } from "@/components/faraday/FaradayDataTab";
import { FaradayTheoryTab } from "@/components/faraday/FaradayTheoryTab";
import { FaradayAssistantTab } from "@/components/faraday/FaradayAssistantTab";
import {
  faradayInitialPos, faradayInitialVel, faradayState, faradayStep,
  type FaradayParams,
} from "@/lib/physics";

const FaradayExperiment = () => {
  const [params, setParams] = useState<FaradayParams>({
    mode: "loop",
    turns: 10,
    resistanceOhm: 1,
    bField: 0.5,
    loopWidthCm: 8,
    loopHeightCm: 6,
    velocityCmS: 10,
    regionWidthCm: 20,
    coilRadiusCm: 2,
    coilLengthCm: 4,
    magnetMoment: 0.5,
    dropHeightCm: 15,
    withGravity: true,
    magnetSpeedCmS: 50,
  });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pos, setPos] = useState(() => faradayInitialPos(params));
  const [vel, setVel] = useState(() => faradayInitialVel(params));
  const [t, setT] = useState(0);

  const state = useMemo(() => faradayState(params, t, pos, vel), [params, t, pos, vel]);

  // Reset on mode change
  useEffect(() => {
    setPos(faradayInitialPos(params));
    setVel(faradayInitialVel(params));
    setT(0);
    setRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode]);

  // Animation loop
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(performance.now());
  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (running) {
        const dtClamped = Math.min(dt, 0.05) * speed;
        // sub-passos para precisão
        const sub = 4;
        let p = pos, v = vel;
        for (let i = 0; i < sub; i++) {
          const next = faradayStep(params, p, v, dtClamped / sub);
          p = next.pos; v = next.vel;
        }
        setPos(p); setVel(v);
        setT((prev) => prev + dtClamped);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, speed, params, pos, vel]);

  const handleReset = () => {
    setPos(faradayInitialPos(params));
    setVel(faradayInitialVel(params));
    setT(0);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-05 · Indução</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Magnet className="h-3.5 w-3.5" /> Indução · Faraday & Lenz
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Indução eletromagnética
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Observe ε = −dΦ/dt em ação: uma espira atravessando uma região de campo B uniforme,
            ou um ímã caindo dentro de uma bobina. Verifique a lei de Lenz no sentido da corrente induzida.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <FaradayControls
              params={params}
              onChange={setParams}
              running={running}
              onToggleRun={() => setRunning((r) => !r)}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            <FaradayMeasurements params={params} state={state} />
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
                <FaradayVisualization params={params} state={state} />
                <p className="mt-3 text-xs text-muted-foreground">
                  Setas no condutor indicam o sentido da corrente induzida (lei de Lenz). A f.e.m. só aparece
                  enquanto Φ varia — pause em diferentes posições para conferir.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <FaradayDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <FaradayTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <FaradayAssistantTab params={params} state={state} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FaradayExperiment;