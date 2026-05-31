import { Button } from "@/components/ui/button";
import type { GratingResults } from "@/lib/physics";
export const GratingDataTab = ({ results }: { results: GratingResults }) => {
  const csv = () => {
    const rows = [["m","angulo_deg"]];
    results.orders.forEach((o) => rows.push([`${o.m}`, o.angle_deg.toFixed(5)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "rede-difracao.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Ordens de difração</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-muted-foreground text-left">
          <th className="py-2">Ordem m</th><th>Ângulo θ</th><th>sin θ = mλ/d</th>
        </tr></thead>
        <tbody className="font-mono tabular-nums">
          {results.orders.map((o) => (
            <tr key={o.m} className="border-t border-border">
              <td className="py-2">{o.m > 0 ? `+${o.m}` : `${o.m}`}</td>
              <td className={o.m === 0 ? "text-muted-foreground" : "text-foreground"}>{o.angle_deg.toFixed(3)}°</td>
              <td>{Math.sin((o.angle_deg * Math.PI)/180).toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
