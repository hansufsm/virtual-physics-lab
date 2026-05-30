import { Button } from "@/components/ui/button";
import type { NMRResults } from "@/lib/physics";

export const NMRDataTab = ({ results }: { results: NMRResults }) => {
  const csv = () => {
    const rows = [["t_ms", "S(t)"]];
    results.fid.forEach((r) => rows.push([r.t.toFixed(3), r.signal.toFixed(5)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "nmr-fid.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Sinal FID amostrado</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        FWHM do espectro ≈ 1/(π T₂). Mz(t) = M₀(1 − e^(−t/T₁)) · |Mxy(t)| = M₀ e^(−t/T₂).
      </p>
    </div>
  );
};