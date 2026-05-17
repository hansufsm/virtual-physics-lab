import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CollisionControls } from "@/components/collision/CollisionControls";
import { CollisionMeasurements } from "@/components/collision/CollisionMeasurements";
import { CollisionVisualization } from "@/components/collision/CollisionVisualization";
import { CollisionDataTab } from "@/components/collision/CollisionDataTab";
import { CollisionTheoryTab } from "@/components/collision/CollisionTheoryTab";
import { CollisionAssistantTab } from "@/components/collision/CollisionAssistantTab";
import { simulateCollision, type CollisionParams } from "@/lib/physics";

const CollisionExperiment = () => {
  const [params, setParams] = useState<CollisionParams>({
    m1: 1.0,
    m2: 2.0,
    u1: 3.0,
    u2: -1.0,
    e: 1.0,
    x1_0: -4,
    x2_0: 4,
    r1: 0.4,
    r2: 0.5,
    duration: 6,
  });

  const results = useMemo(() => simulateCollision(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-20 · Mecânica</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Momento linear · Colisões
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Colisões 1D — momento linear e energia
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Dois corpos em uma linha: ajuste massas, velocidades e o coeficiente de restituição e
            verifique a conservação de p = m₁u₁ + m₂u₂ e a perda de energia ΔK = ½ μ (1−e²)(u₁−u₂)².
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <CollisionControls params={params} onChange={setParams} />
            <CollisionMeasurements results={results} />
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
                <CollisionVisualization results={results} params={params} />
                <p className="text-xs text-muted-foreground">
                  Os corpos se movem livremente até o contato. No instante da colisão, aplica-se o
                  modelo de coeficiente de restituição e ambos seguem com novas velocidades constantes.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <CollisionDataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <CollisionTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <CollisionAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CollisionExperiment;