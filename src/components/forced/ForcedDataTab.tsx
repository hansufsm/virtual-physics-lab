import { Button } from "@/components/ui/button";
import type { ForcedResults } from "@/lib/physics";
export const ForcedDataTab = ({ results }: { results: ForcedResults }) => {
  const csv = () => {
    const rows = [["omega_rad_s", "A_m", "phase_rad"]];
    results.sweep.forEach((p) => rows.push([p.omega.toFixed(5), p.A.toFixed(6), p.phase.toFixed(5)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ressonancia.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Varredura A(ω), φ(ω)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">ω₀</div><div className="font-mono text-primary">{results.omega0_rad_s.toFixed(3)} rad/s</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">ω_r</div><div className="font-mono text-primary">{results.omegaR_rad_s.toFixed(3)} rad/s</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-muted-foreground text-xs">Q</div><div className="font-mono text-primary">{isFinite(results.Q) ? results.Q.toFixed(2) : "∞"}</div></div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{results.sweep.length} pontos de varredura — exporte para análise externa.</p>
    </div>
  );
};