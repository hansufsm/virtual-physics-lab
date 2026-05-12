import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectileControls } from "@/components/projectile/ProjectileControls";
import { ProjectileMeasurements } from "@/components/projectile/ProjectileMeasurements";
import { ProjectileVisualization } from "@/components/projectile/ProjectileVisualization";
import { ProjectileDataTab } from "@/components/projectile/ProjectileDataTab";
import { ProjectileTheoryTab } from "@/components/projectile/ProjectileTheoryTab";
import { ProjectileAssistantTab } from "@/components/projectile/ProjectileAssistantTab";
import { simulateProjectile, type ProjectileParams } from "@/lib/physics";

const ProjectileExperiment = () => {
  const [params, setParams] = useState<ProjectileParams>({
    speed: 30,
    angleDeg: 45,
    height: 0,
    mass: 1,
    gravity: 9.80665,
    drag: "none",
    dragCoef: 0.05,
  });
  const [showVacuum, setShowVacuum] = useState(true);

  const results = useMemo(() => simulateProjectile(params), [params]);
  const vacuumResults = useMemo(
    () => simulateProjectile({ ...params, drag: "none" }),
    [params],
  );
  const vacuumTraj = useMemo(
    () => vacuumResults.trajectory.map((p) => ({ x: p.x, y: p.y })),
    [vacuumResults],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-16 · Mecânica</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Mecânica · Cinemática 2D
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Lançamento de projéteis
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Trajetória parabólica no vácuo e com arrasto linear/quadrático. Varie v₀, θ, h₀ e g, e
            compare com a referência sem arrasto.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ProjectileControls params={params} onChange={setParams} />
            <ProjectileMeasurements results={results} />
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
                <div className="flex items-center justify-end gap-3">
                  <Label className="text-sm">Mostrar trajetória no vácuo</Label>
                  <Switch checked={showVacuum} onCheckedChange={setShowVacuum} />
                </div>
                <ProjectileVisualization
                  results={results}
                  showVacuum={showVacuum && params.drag !== "none"}
                  vacuumTrajectory={vacuumTraj}
                />
                <p className="text-xs text-muted-foreground">
                  Curva sólida: trajetória atual. Tracejada: referência sem arrasto. O vetor mostra a velocidade instantânea.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <ProjectileDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <ProjectileTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <ProjectileAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectileExperiment;