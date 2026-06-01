import { Button } from "@/components/ui/button";
import type { InclineResults } from "@/lib/physics";
export const InclineDataTab = ({ results }: { results: InclineResults }) => {
  const csv = () => {
    const rows = [["t_s","v_m_s","x_m"]];
    results.velocity.forEach((p) => rows.push([p.t.toFixed(4), p.v.toFixed(4), p.x.toFixed(4)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "plano-inclinado.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Cinemática da descida</h3>
        <Button size="sm" variant="outline" onClick={csv} disabled={results.velocity.length === 0}>Exportar CSV</Button>
      </div>
      {results.velocity.length === 0 ? (
        <p className="text-sm text-muted-foreground">O bloco está em repouso — sem movimento para tabular. Aumente θ ou reduza μ_s.</p>
      ) : (
        <table className="w-full text-sm">
          <thead><tr className="text-muted-foreground text-left"><th className="py-2">t (s)</th><th>v (m/s)</th><th>x (m)</th></tr></thead>
          <tbody className="font-mono tabular-nums">
            {results.velocity.filter((_, i) => i % Math.max(1, Math.floor(results.velocity.length / 12)) === 0).map((p, i) => (
              <tr key={i} className="border-t border-border"><td className="py-1.5">{p.t.toFixed(3)}</td><td>{p.v.toFixed(3)}</td><td>{p.x.toFixed(3)}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};