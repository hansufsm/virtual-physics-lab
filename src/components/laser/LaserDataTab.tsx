import { Button } from "@/components/ui/button";
import type { LaserResults } from "@/lib/physics";

export const LaserDataTab = ({ results }: { results: LaserResults }) => {
  const csv = () => {
    const rows = [["delta_f_GHz","ganho","lasing"]];
    results.modes.forEach((m) => rows.push([m.f_GHz.toFixed(4), m.gain.toFixed(4), m.lasing ? "1" : "0"]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "laser-modes.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Modos longitudinais</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-muted-foreground text-left">
          <th className="py-2">Δν (GHz)</th><th>Ganho</th><th>Oscila?</th>
        </tr></thead>
        <tbody className="font-mono tabular-nums">
          {results.modes.map((m, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-2">{m.f_GHz.toFixed(3)}</td>
              <td>{m.gain.toFixed(3)}</td>
              <td className={m.lasing ? "text-primary" : "text-muted-foreground"}>{m.lasing ? "sim" : "não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};