import { Button } from "@/components/ui/button";
import type { FourierResults } from "@/lib/physics";
export const FourierDataTab = ({ results }: { results: FourierResults }) => {
  const csv = () => {
    const rows = [["x_m", "T_K"]];
    results.profile.forEach(p => rows.push([p.x_m.toFixed(5), p.T_K.toFixed(3)]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fourier.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Perfil de temperatura</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">{results.profile.length} pontos. q = {results.q_W.toFixed(2)} W.</p>
    </div>
  );
};