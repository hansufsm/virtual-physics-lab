import { Button } from "@/components/ui/button";
import type { CarnotResults } from "@/lib/physics";
export const CarnotDataTab = ({ results }: { results: CarnotResults }) => {
  const csv = () => {
    const rows = [["leg", "V_L", "P_Pa", "T_K"]];
    results.cycle.forEach(p => rows.push([String(p.leg), p.V_L.toFixed(4), p.P_Pa.toFixed(2), p.T_K.toFixed(2)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "carnot.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Pontos do ciclo</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.cycle.length} pontos (4 segmentos × ~60 amostras).</p>
    </div>
  );
};