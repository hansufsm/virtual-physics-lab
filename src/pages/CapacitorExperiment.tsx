import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CapacitorVisualization } from "@/components/capacitor/CapacitorVisualization";
import { ParameterControls } from "@/components/capacitor/ParameterControls";
import { MeasurementsPanel } from "@/components/capacitor/MeasurementsPanel";
import { DataTab } from "@/components/capacitor/DataTab";
import { TheoryTab } from "@/components/capacitor/TheoryTab";
import { AssistantTab } from "@/components/capacitor/AssistantTab";
import { computeCapacitor, type CapacitorParams } from "@/lib/physics";

const CapacitorExperiment = () => {
  const [params, setParams] = useState<CapacitorParams>({
    voltage: 10,
    distanceMm: 2,
    areaCm2: 100,
    epsilonR: 1,
  });
  const [showDielectric, setShowDielectric] = useState(false);

  const results = useMemo(() => computeCapacitor(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-01 · Eletrostática</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Zap className="h-3.5 w-3.5" /> Eletricidade · Capacitância
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Capacitor de placas paralelas
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Explore como a capacitância depende da geometria e do dielétrico. Ajuste tensão, distância, área e
            material e observe o campo elétrico, a carga e a energia armazenada em tempo real.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ParameterControls
              params={params}
              onChange={setParams}
              showDielectric={showDielectric}
              onToggleDielectric={setShowDielectric}
            />
            <MeasurementsPanel results={results} />
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
                <CapacitorVisualization
                  params={params}
                  results={results}
                  showDielectric={showDielectric && params.epsilonR > 1}
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Linhas tracejadas representam o campo elétrico interno. A densidade de cargas e o brilho das
                  linhas se ajustam à intensidade calculada.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <DataTab params={params} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <TheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <AssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CapacitorExperiment;