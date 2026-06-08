import { Button } from "@/components/ui/button";
import type { StefanResults } from "@/lib/physics";
export const StefanDataTab = ({ results }: { results: StefanResults }) => {
  const csv = () => {
    const rows = [["lambda_nm", "B_W_m3_sr"]];
    results.spectrum.forEach(p => rows.push([p.lambda_nm.toFixed(2), p.B.toExponential(6)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "planck.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Espectro de Planck</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.spectrum.length} pontos. λ_máx = {(results.lambda_max_m * 1e9).toFixed(1)} nm.</p>
    </div>
  );
};