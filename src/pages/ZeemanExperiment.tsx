import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Magnet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ZeemanControls } from "@/components/zeeman/ZeemanControls";
import { ZeemanMeasurements } from "@/components/zeeman/ZeemanMeasurements";
import { ZeemanVisualization } from "@/components/zeeman/ZeemanVisualization";
import { ZeemanDataTab } from "@/components/zeeman/ZeemanDataTab";
import { ZeemanTheoryTab } from "@/components/zeeman/ZeemanTheoryTab";
import { ZeemanAssistantTab } from "@/components/zeeman/ZeemanAssistantTab";
import { computeZeeman, type ZeemanParams } from "@/lib/physics";

const ZeemanExperiment = () => {
  const [params, setParams] = useState<ZeemanParams>({ presetIndex: 0, B_T: 2, observation: "transverse" });
  const results = useMemo(() => computeZeeman(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-29 · Efeito Zeeman</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Magnet className="h-3.5 w-3.5" /> Física atômica · Acoplamento spin-órbita
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Efeito Zeeman
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Em um campo B externo cada nível J se desdobra em 2J+1 subníveis com ΔE = g_J μ_B B m_J. As transições
            permitidas (|Δm| ≤ 1) geram componentes π e σ identificáveis pela polarização e direção de observação.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ZeemanControls params={params} onChange={setParams} />
            <ZeemanMeasurements params={params} results={results} />
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
                <ZeemanVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Linhas π (amarelo) só aparecem na observação transversal. Em longitudinal restam apenas σ⁺ (azul) e σ⁻ (rosa), circularmente polarizadas em sentidos opostos.
                </p>
              </TabsContent>

              <TabsContent value="dados" className="mt-4">
                <ZeemanDataTab params={params} results={results} />
              </TabsContent>

              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <ZeemanTheoryTab />
                </div>
              </TabsContent>

              <TabsContent value="ia" className="mt-4">
                <ZeemanAssistantTab params={params} results={results} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ZeemanExperiment;