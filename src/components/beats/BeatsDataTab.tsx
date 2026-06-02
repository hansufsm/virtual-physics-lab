import { Button } from "@/components/ui/button";
import type { BeatsResults } from "@/lib/physics";
export const BeatsDataTab = ({ results }: { results: BeatsResults }) => {
  const csv = () => {
    const rows = [["t_s", "x_m", "env_m"]];
    results.trajectory.forEach((p) => rows.push([p.t.toFixed(5), p.x.toFixed(6), p.env.toFixed(6)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "batimentos.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Sinal x(t) e envelope</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">f_batimento</div><div className="font-mono text-primary">{results.fBeat_Hz.toFixed(3)} Hz</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">f̄ portadora</div><div className="font-mono text-primary">{results.fAvg_Hz.toFixed(3)} Hz</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">T_batimento</div><div className="font-mono text-primary">{isFinite(results.Tbeat_s) ? results.Tbeat_s.toFixed(3) + " s" : "∞"}</div></div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{results.trajectory.length} pontos — exporte para análise externa.</p>
    </div>
  );
};