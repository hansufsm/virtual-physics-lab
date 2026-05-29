import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Atom } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RutherfordControls } from "@/components/rutherford/RutherfordControls";
import { RutherfordMeasurements } from "@/components/rutherford/RutherfordMeasurements";
import { RutherfordVisualization } from "@/components/rutherford/RutherfordVisualization";
import { RutherfordDataTab } from "@/components/rutherford/RutherfordDataTab";
import { RutherfordTheoryTab } from "@/components/rutherford/RutherfordTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeRutherford, type RutherfordParams } from "@/lib/physics";

const RutherfordExperiment = () => {
  const [params, setParams] = useState<RutherfordParams>({
    energy_MeV: 5, Z_target: 79, z_projectile: 2, impactParameter_fm: 20,
  });
  const results = useMemo(() => computeRutherford(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-33 · Rutherford</Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Atom className="h-3.5 w-3.5" /> Física nuclear · Modelo atômico
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Espalhamento de Rutherford
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            Partículas alfa lançadas contra uma folha fina interagem com o núcleo via Coulomb puro. Para impacto b a
            partícula segue uma hipérbole com ângulo θ = 2·arctan(k/(2Eb)) e a seção diferencial diverge como
            1/sen⁴(θ/2) — confirmando o núcleo compacto.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <RutherfordControls params={params} onChange={setParams} />
            <RutherfordMeasurements results={results} />
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
                <RutherfordVisualization params={params} results={results} />
                <p className="text-xs text-muted-foreground">
                  Reduza b para ver retroespalhamento (θ → 180°). r_min é a maior aproximação ao núcleo (raio nuclear ~ poucos fm).
                </p>
              </TabsContent>
              <TabsContent value="dados" className="mt-4">
                <RutherfordDataTab results={results} />
              </TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <RutherfordTheoryTab />
                </div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant
                  experimentName="Espalhamento de Rutherford"
                  contextSummary={{
                    E_MeV: params.energy_MeV,
                    Z_alvo: params.Z_target,
                    z_proj: params.z_projectile,
                    b_fm: params.impactParameter_fm,
                    theta_deg: results.scatteringAngle_deg,
                    rmin_fm: results.distance_min_fm,
                    dsigma_b_sr: results.diffCrossSection_b_per_sr,
                  }}
                  suggestions={[
                    "Por que dσ/dΩ ∝ 1/sen⁴(θ/2)?",
                    "Como Rutherford concluiu que o núcleo é pequeno?",
                    "O que é o parâmetro de impacto b?",
                    "Para quais E a aproximação Coulomb falha?",
                  ]}
                  placeholder="Pergunte sobre o experimento da folha de ouro..."
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RutherfordExperiment;