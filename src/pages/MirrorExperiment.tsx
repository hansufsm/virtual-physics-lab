import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MirrorControls } from "@/components/mirror/MirrorControls";
import { MirrorMeasurements } from "@/components/mirror/MirrorMeasurements";
import { MirrorVisualization } from "@/components/mirror/MirrorVisualization";
import { MirrorDataTab } from "@/components/mirror/MirrorDataTab";
import { MirrorTheoryTab } from "@/components/mirror/MirrorTheoryTab";
import { LabAssistant } from "@/components/shared/LabAssistant";
import { computeMirror, type MirrorParams } from "@/lib/physics";

const MirrorExperiment = () => {
  const [params, setParams] = useState<MirrorParams>({ kind: "concave", R_cm: 40, p_cm: 30, h_obj_cm: 4 });
  const results = useMemo(() => computeMirror(params), [params]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar ao laboratório
          </Link>
          <Badge variant="secondary" className="font-mono text-[10px]">EXP-47 · Espelhos esféricos</Badge>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-3">
            <Eye className="h-3.5 w-3.5" /> Óptica geométrica
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
            Espelhos esféricos — côncavo e convexo
          </h1>
          <p className="mt-2 text-muted-foreground text-balance">
            1/f = 1/p + 1/p' e A = −p'/p. Visualize o traçado de raios e o tipo de imagem (real/virtual, direita/invertida, ampliada/reduzida).
          </p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <MirrorControls params={params} onChange={setParams} />
            <MirrorMeasurements results={results} />
          </aside>
          <section>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="teoria">Teoria</TabsTrigger>
                <TabsTrigger value="ia">Assistente IA</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao" className="mt-4"><MirrorVisualization params={params} results={results} /></TabsContent>
              <TabsContent value="dados" className="mt-4"><MirrorDataTab params={params} results={results} /></TabsContent>
              <TabsContent value="teoria" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card"><MirrorTheoryTab /></div>
              </TabsContent>
              <TabsContent value="ia" className="mt-4">
                <LabAssistant experimentName="Espelhos esféricos"
                  contextSummary={{ tipo: params.kind, f_cm: results.f_cm, p_cm: results.p_cm, pl_cm: results.pl_cm, m: results.m, real: results.isReal }}
                  suggestions={["Quando a imagem é virtual?","Por que retrovisor é convexo?","Onde colocar o objeto para imagem real ampliada?","Como derivar 1/f = 1/p + 1/p'?"]}
                  placeholder="Pergunte sobre espelhos esféricos..." />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};
export default MirrorExperiment;