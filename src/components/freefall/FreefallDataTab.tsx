import { Button } from "@/components/ui/button";
import type { FreefallResults } from "@/lib/physics";
export const FreefallDataTab = ({ results }: { results: FreefallResults }) => {
  const csv = () => {
    const rows = [["t_s","y_m","v_m_s","a_m_s2"]];
    results.trajectory.forEach((p) => rows.push([p.t.toFixed(4), p.y.toFixed(4), p.v.toFixed(4), p.a.toFixed(4)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "queda-livre.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Trajetória y(t), v(t), a(t)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-muted-foreground text-left"><th className="py-2">t (s)</th><th>y (m)</th><th>v (m/s)</th><th>a (m/s²)</th></tr></thead>
        <tbody className="font-mono tabular-nums">
          {results.trajectory.filter((_, i) => i % Math.max(1, Math.floor(results.trajectory.length / 12)) === 0).map((p, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-1.5">{p.t.toFixed(3)}</td><td>{p.y.toFixed(3)}</td><td>{p.v.toFixed(3)}</td><td>{p.a.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};