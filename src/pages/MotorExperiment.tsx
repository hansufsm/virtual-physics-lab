import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom, Play, Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotorVisualization } from "@/components/motor/MotorVisualization";
import { MotorControls } from "@/components/motor/MotorControls";
import { MotorMeasurements } from "@/components/motor/MotorMeasurements";
import { MotorDataTab } from "@/components/motor/MotorDataTab";
import { MotorTheoryTab } from "@/components/motor/MotorTheoryTab";
import { MotorAssistantTab } from "@/components/motor/MotorAssistantTab";
import { computeDCMotor, type DCMotorParams } from "@/lib/physics";

const MotorExperiment = () => {
  const [params, setParams] = useState<DCMotorParams>({
    voltage: 6,
    resistanceOhm: 2,
    bField: 0.4,
    loopWidthCm: 4,
    loopHeightCm: 5,
    turns: 80,
    loadTorqueMnm: 5,
    frictionCoef: 1e-5,
    inertiaGcm2: 50,
    kE: 0,
  });
  const [running, setRunning] = useState(true);
  const [tele, setTele] = useState({ rpm: 0, i: 0, torque: 0 });

  const results = useMemo(() => computeDCMotor(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-08 · Magnetismo</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Magnetismo · Força de Laplace
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Motor DC — força de Laplace
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Observe o torque produzido por uma espira percorrida por corrente em um campo magnético uniforme.
            Estude a curva T(ω), a f.c.e.m. e a eficiência do motor.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <MotorControls params={params} onChange={setParams} />
            <MotorMeasurements results={results} rpmLive={tele.rpm} iLive={tele.i} torqueLive={tele.torque} />
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
                <MotorVisualization
                  params={params}
                  running={running}
                  onTelemetry={(rpm, i, torque) => setTele({ rpm, i, torque })}
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Os símbolos ⊙/⊗ indicam corrente saindo/entrando do plano. As setas mostram a força
                    de Laplace F = B·I·L em cada lado ativo da espira; o conjugado gera o torque do rotor.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} className="gap-1.5 shrink-0">
                    {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Animar</>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <MotorDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <MotorTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <MotorAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MotorExperiment;