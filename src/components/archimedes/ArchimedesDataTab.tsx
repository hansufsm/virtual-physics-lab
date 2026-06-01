import { Button } from "@/components/ui/button";
import { FLUIDS } from "@/lib/physics";
import type { ArchimedesParams, ArchimedesResults } from "@/lib/physics";
export const ArchimedesDataTab = ({ params, results }: { params: ArchimedesParams; results: ArchimedesResults }) => {
  const csv = () => {
    const rows = [["fluido","rho_kg_m3","flutua","fracao_submersa","empuxo_N"]];
    FLUIDS.forEach((f) => {
      const flo = params.rho_obj_kg_m3 < f.rho;
      const frac = flo ? params.rho_obj_kg_m3 / f.rho : 1;
      const V = params.volume_obj_L * 1e-3;
      const E = f.rho * V * frac * params.g;
      rows.push([f.name, `${f.rho}`, flo ? "sim" : "não", frac.toFixed(4), E.toFixed(4)]);
    });
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "arquimedes.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Comparação com diferentes fluidos</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-muted-foreground text-left"><th className="py-2">Fluido</th><th>ρ (kg/m³)</th><th>Flutua?</th><th>Submerso</th><th>Empuxo (N)</th></tr></thead>
        <tbody className="font-mono tabular-nums">
          {FLUIDS.map((f) => {
            const flo = params.rho_obj_kg_m3 < f.rho;
            const frac = flo ? params.rho_obj_kg_m3 / f.rho : 1;
            const V = params.volume_obj_L * 1e-3;
            const E = f.rho * V * frac * params.g;
            return (
              <tr key={f.name} className="border-t border-border">
                <td className="py-1.5">{f.name}</td><td>{f.rho}</td>
                <td className={flo ? "text-primary" : "text-destructive"}>{flo ? "sim" : "não"}</td>
                <td>{(frac*100).toFixed(1)}%</td><td>{E.toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3">Sua medição: ρ_obj = {params.rho_obj_kg_m3} kg/m³, V = {params.volume_obj_L} L → empuxo no fluido atual = {results.buoyancy_eq_N.toFixed(3)} N.</p>
    </div>
  );
};