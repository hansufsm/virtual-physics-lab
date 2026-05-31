import { Button } from "@/components/ui/button";
import type { BlackbodyResults } from "@/lib/physics";
export const BlackbodyDataTab = ({ results }: { results: BlackbodyResults }) => {
  const csv = () => {
    const rows = [["lambda_nm","B_planck","B_rj","B_wien"]];
    results.spectrum.forEach((s) => rows.push([s.lambda_nm.toFixed(2), s.B_planck.toExponential(4), s.B_rj.toExponential(4), s.B_wien.toExponential(4)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "blackbody.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Espectro Planck</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card"><tr className="text-muted-foreground text-left">
            <th className="py-2">λ (nm)</th><th>B Planck</th><th>B R-J</th><th>B Wien</th>
          </tr></thead>
          <tbody className="font-mono tabular-nums">
            {results.spectrum.filter((_, i) => i % 4 === 0).map((s, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-1.5">{s.lambda_nm.toFixed(1)}</td>
                <td>{s.B_planck.toExponential(2)}</td>
                <td>{s.B_rj.toExponential(2)}</td>
                <td>{s.B_wien.toExponential(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
