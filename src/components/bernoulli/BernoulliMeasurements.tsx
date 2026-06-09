import type { BernoulliResults } from "@/lib/physics";
export const BernoulliMeasurements = ({ results }: { results: BernoulliResults }) => {
  const items = [
    { label: "v₂ (garganta)", value: `${results.v2_ms.toFixed(2)} m/s`, accent: true },
    { label: "P₂", value: `${(results.P2_Pa / 1000).toFixed(2)} kPa`, accent: true },
    { label: "ΔP = P₁ − P₂", value: `${(results.deltaP_Pa / 1000).toFixed(2)} kPa` },
    { label: "Vazão Q", value: `${(results.Q_m3s * 1000).toFixed(3)} L/s` },
    { label: "Vazão mássica", value: `${results.massFlow_kgs.toFixed(3)} kg/s` },
    { label: "Reynolds (garganta)", value: results.reynolds.toExponential(2) },
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