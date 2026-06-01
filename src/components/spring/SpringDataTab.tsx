import { Button } from "@/components/ui/button";
import type { SpringResults } from "@/lib/physics";
export const SpringDataTab = ({ results }: { results: SpringResults }) => {
  const csv = () => {
    const rows = [["t_s","x_m","v_m_s"]];
    results.trajectory.forEach((p) => rows.push([p.t.toFixed(5), p.x.toFixed(5), p.v.toFixed(5)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mola-mhs.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Oscilação x(t), v(t)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">T</div><div className="font-mono text-primary">{results.T_s.toFixed(4)} s</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">f</div><div className="font-mono text-primary">{results.freq_Hz.toFixed(3)} Hz</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">k_eq</div><div className="font-mono text-primary">{results.k_eq_N_per_m.toFixed(2)} N/m</div></div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Trajetória completa com {results.trajectory.length} pontos — exporte CSV para análise externa.</p>
    </div>
  );
};