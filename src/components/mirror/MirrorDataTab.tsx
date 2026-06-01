import { Button } from "@/components/ui/button";
import { computeMirror, type MirrorParams, type MirrorResults } from "@/lib/physics";
export const MirrorDataTab = ({ params, results }: { params: MirrorParams; results: MirrorResults }) => {
  const positions = [5, 10, 20, 30, 50, 75, 100, 150, 200];
  const csv = () => {
    const rows = [["p_cm","p_linha_cm","aumento","h_img_cm","real"]];
    positions.forEach((p) => {
      const r = computeMirror({ ...params, p_cm: p });
      rows.push([`${p}`, isFinite(r.pl_cm) ? r.pl_cm.toFixed(3) : "Inf", r.m.toFixed(4), r.h_img_cm.toFixed(3), r.isReal ? "1" : "0"]);
    });
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "espelho.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Varredura de posições</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-muted-foreground text-left"><th className="py-2">p (cm)</th><th>p' (cm)</th><th>m</th><th>h' (cm)</th><th>tipo</th></tr></thead>
        <tbody className="font-mono tabular-nums">
          {positions.map((p) => {
            const r = computeMirror({ ...params, p_cm: p });
            return (
              <tr key={p} className="border-t border-border">
                <td className="py-1.5">{p}</td>
                <td>{isFinite(r.pl_cm) ? r.pl_cm.toFixed(2) : "∞"}</td>
                <td>{r.m.toFixed(3)}</td>
                <td>{r.h_img_cm.toFixed(2)}</td>
                <td className={r.isReal ? "text-primary" : "text-muted-foreground"}>{r.isReal ? "real" : "virtual"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3">Atual: p = {results.p_cm} cm · p' = {isFinite(results.pl_cm) ? results.pl_cm.toFixed(2) : "∞"} cm · m = {results.m.toFixed(3)}×</p>
    </div>
  );
};