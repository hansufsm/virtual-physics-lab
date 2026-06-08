import type { StefanResults } from "@/lib/physics";
const fmtW = (w: number) => {
  const a = Math.abs(w);
  if (a >= 1e6) return `${(w / 1e6).toFixed(2)} MW`;
  if (a >= 1e3) return `${(w / 1e3).toFixed(2)} kW`;
  return `${w.toFixed(2)} W`;
};
export const StefanMeasurements = ({ results }: { results: StefanResults }) => {
  const items = [
    { label: "P emitida", value: fmtW(results.P_emitted_W), accent: true },
    { label: "P absorvida", value: fmtW(results.P_absorbed_W) },
    { label: "P líquida", value: fmtW(results.P_net_W), accent: true },
    { label: "Fluxo εσT⁴", value: `${results.flux_W_m2.toExponential(3)} W/m²` },
    { label: "λ_máx (Wien)", value: `${(results.lambda_max_m * 1e9).toFixed(1)} nm`, accent: true },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};