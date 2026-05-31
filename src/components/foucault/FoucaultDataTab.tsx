import { Button } from "@/components/ui/button";
import { OMEGA_EARTH, type FoucaultResults } from "@/lib/physics";
export const FoucaultDataTab = ({ results }: { results: FoucaultResults }) => {
  const csv = () => {
    const rows = [["x_m","y_m"]];
    results.trace.forEach((p) => rows.push([p.x.toFixed(5), p.y.toFixed(5)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "foucault.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Traçado horizontal</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
        <div className="rounded-lg border border-border p-3">
          <div className="text-muted-foreground text-xs">Ω_⊕</div>
          <div className="font-mono text-foreground">{OMEGA_EARTH.toExponential(4)} rad/s</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-muted-foreground text-xs">T sideral</div>
          <div className="font-mono text-foreground">23h 56min 04s</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">O CSV contém {results.trace.length} pontos (x,y) em metros.</p>
    </div>
  );
};
