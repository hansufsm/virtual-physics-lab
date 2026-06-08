import { Button } from "@/components/ui/button";
import type { MaxwellResults } from "@/lib/physics";
export const MaxwellDataTab = ({ results }: { results: MaxwellResults }) => {
  const csv = () => {
    const rows = [["v_m_s", "f_v"]];
    results.distribution.forEach(p => rows.push([p.v.toFixed(2), p.f.toExponential(6)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "maxwell.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Distribuição f(v)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.distribution.length} pontos analíticos + {results.samples} amostras simuladas.</p>
    </div>
  );
};