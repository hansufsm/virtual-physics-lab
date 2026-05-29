import { Button } from "@/components/ui/button";
import type { QHallResults } from "@/lib/physics";

interface Props { results: QHallResults }

export const QHallDataTab = ({ results }: Props) => {
  const csv = () => {
    const rows = [["B (T)","nu","R_xy (Ohm)","R_xx (Ohm)"]];
    results.curve.forEach((r) => rows.push([r.B.toFixed(3), r.nu.toFixed(4), r.R_xy.toFixed(3), r.R_xx.toFixed(3)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qhall.csv"; a.click();
  };
  const plateaus = [1,2,3,4,5,6].map((nu) => ({ nu, R: results.R_K_Ohm/nu }));
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Tabela de platôs (R_K/ν)</h3>
          <Button size="sm" variant="outline" onClick={csv}>Exportar curva CSV</Button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-1.5">ν</th><th>R_xy = h/(νe²) (Ω)</th><th>σ_xy (e²/h)</th>
          </tr></thead>
          <tbody className="font-mono">
            {plateaus.map((p) => (
              <tr key={p.nu} className="border-b border-border/40">
                <td className="py-1">{p.nu}</td>
                <td>{p.R.toFixed(3)}</td>
                <td>{p.nu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card text-sm text-muted-foreground">
        <p>R_K = h/e² = <span className="font-mono text-foreground">{results.R_K_Ohm.toFixed(3)} Ω</span> é a constante de von Klitzing. Desde 1990 define oficialmente o ohm.</p>
      </div>
    </div>
  );
};