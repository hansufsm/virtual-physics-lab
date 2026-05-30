import { Button } from "@/components/ui/button";
import type { FranckHertzResults } from "@/lib/physics";

export const FranckHertzDataTab = ({ results }: { results: FranckHertzResults }) => {
  const csv = () => {
    const rows = [["V (V)", "I (u.a.)"]];
    results.curve.forEach((r) => rows.push([r.V.toFixed(3), r.I.toFixed(4)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "franck-hertz.csv"; a.click();
  };
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Posição dos picos (V_n = n·E_exc + V_r)</h3>
          <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-muted-foreground text-left">
            <th className="py-2">n</th><th>V_pico (V)</th><th>ΔV em relação a n−1</th>
          </tr></thead>
          <tbody className="font-mono tabular-nums">
            {results.peaks.map((p, i) => (
              <tr key={p.n} className="border-t border-border">
                <td className="py-2">{p.n}</td>
                <td>{p.V.toFixed(3)}</td>
                <td>{i === 0 ? "—" : (p.V - results.peaks[i-1].V).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};