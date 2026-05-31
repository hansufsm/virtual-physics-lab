import { Button } from "@/components/ui/button";
import type { TunnelResults } from "@/lib/physics";
export const TunnelDataTab = ({ results }: { results: TunnelResults }) => {
  const csv = () => {
    const rows = [["E_eV","T(E)","a_nm","T(a)"]];
    const N = Math.max(results.T_curve_E.length, results.T_curve_a.length);
    for (let i = 0; i < N; i++) {
      const e = results.T_curve_E[i], a = results.T_curve_a[i];
      rows.push([e?.E_eV.toFixed(4) ?? "", e?.T.toExponential(4) ?? "", a?.a_nm.toFixed(4) ?? "", a?.T.toExponential(4) ?? ""]);
    }
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "tunelamento.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Curvas de transmissão</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">Os arrays T(E) e T(a) têm 201 pontos cada. Use o CSV para análise externa.</p>
      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3">
          <div className="text-muted-foreground text-xs mb-1">T mínimo (E→0)</div>
          <div className="font-mono text-primary">{results.T_curve_E[0]?.T.toExponential(3)}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-muted-foreground text-xs mb-1">T máximo (E≫V₀)</div>
          <div className="font-mono text-primary">{results.T_curve_E[results.T_curve_E.length-1]?.T.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};
