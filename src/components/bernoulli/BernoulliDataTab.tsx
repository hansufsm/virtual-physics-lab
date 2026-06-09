import { Button } from "@/components/ui/button";
import type { BernoulliResults } from "@/lib/physics";
export const BernoulliDataTab = ({ results }: { results: BernoulliResults }) => {
  const csv = () => {
    const rows = [["x", "A_m2", "v_ms", "P_Pa"]];
    results.profile.forEach(p => rows.push([p.x.toFixed(4), p.A.toExponential(4), p.v.toFixed(4), p.P.toFixed(2)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "bernoulli.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Perfil ao longo do tubo</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.profile.length} pontos de v(x), P(x) e A(x).</p>
    </div>
  );
};