import { Button } from "@/components/ui/button";
import type { PoiseuilleResults } from "@/lib/physics";
export const PoiseuilleDataTab = ({ results }: { results: PoiseuilleResults }) => {
  const csv = () => {
    const rows = [["r_m", "v_ms"]];
    results.profile.forEach(p => rows.push([p.r.toExponential(4), p.v.toFixed(6)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "poiseuille.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Perfil v(r)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.profile.length} pontos.</p>
    </div>
  );
};