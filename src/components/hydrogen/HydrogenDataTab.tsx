import { Button } from "@/components/ui/button";
import type { HydrogenResults } from "@/lib/physics";
export const HydrogenDataTab = ({ results }: { results: HydrogenResults }) => {
  const csv = () => {
    const rows = [["n_up","n_low","lambda_nm","freq_THz","energy_eV","visivel"]];
    results.lines.forEach((l) => rows.push([`${l.n_up}`, `${l.n_low}`, l.lambda_nm.toFixed(4), l.freq_THz.toFixed(4), l.energy_eV.toFixed(5), l.visible ? "1" : "0"]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "hidrogenio.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Linhas da série {results.series.name}</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-muted-foreground text-left">
          <th className="py-2">Transição</th><th>λ (nm)</th><th>ν (THz)</th><th>E (eV)</th><th>Faixa</th>
        </tr></thead>
        <tbody className="font-mono tabular-nums">
          {results.lines.map((l, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-2">n={l.n_up} → {l.n_low}</td>
              <td>{l.lambda_nm.toFixed(2)}</td>
              <td>{l.freq_THz.toFixed(2)}</td>
              <td>{l.energy_eV.toFixed(3)}</td>
              <td className={l.visible ? "text-primary" : "text-muted-foreground"}>{l.visible ? "visível" : (l.lambda_nm < 380 ? "UV" : "IV")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
