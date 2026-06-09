import { Button } from "@/components/ui/button";
import type { StokesResults } from "@/lib/physics";
export const StokesDataTab = ({ results }: { results: StokesResults }) => {
  const csv = () => {
    const rows = [["t_s", "v_ms", "x_m"]];
    results.series.forEach(p => rows.push([p.t.toFixed(4), p.v.toFixed(6), p.x.toFixed(6)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "stokes.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Trajetória v(t), x(t)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.series.length} pontos.</p>
    </div>
  );
};