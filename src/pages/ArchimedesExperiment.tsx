import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArchimedesControls } from "@/components/archimedes/ArchimedesControls";
import { ArchimedesMeasurements } from "@/components/archimedes/ArchimedesMeasurements";
import { ArchimedesVisualization } from "@/components/archimedes/ArchimedesVisualization";
import { ArchimedesDataTab } from "@/components/archimedes/ArchimedesDataTab";
import { ArchimedesTheoryTab } from "@/components/archimedes/ArchimedesTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeArchimedes, type ArchimedesParams } from "@/lib/physics";

const ArchimedesExperiment = () => {
  const [params, setParams] = useState<ArchimedesParams>({ rho_obj_kg_m3: 700, volume_obj_L: 1, rho_fluid_kg_m3: 1000, g: 9.81 });
  const results = useMemo(() => computeArchimedes(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-46 · Arquimedes · Empuxo</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Waves className="h-3.5 w-3.5" /> Fluidos · Hidrostática
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Princípio de Arquimedes e empuxo
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            E = ρ_fluido · V_submerso · g. Compare densidades, calcule fração submersa e descubra por que apenas 10% do iceberg aparece.
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <ArchimedesControls params={params} onChange={setParams} />
            <ArchimedesMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><ArchimedesVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><ArchimedesDataTab params={params} results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><ArchimedesTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Princípio de Arquimedes"
                  contextSummary={{ rho_obj: params.rho_obj_kg_m3, rho_fluido: params.rho_fluid_kg_m3, flutua: results.floats, fracao: results.fraction_submerged, E_N: results.buoyancy_eq_N }}
                  suggestions={["Por que só 10% do iceberg aparece?","Como medir a densidade de um objeto?","O que muda em água salgada?","Por que o navio de aço flutua?"]}
                  placeholder="Pergunte sobre empuxo e flutuação..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default ArchimedesExperiment;