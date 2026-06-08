import type { CarnotResults } from "@/lib/physics";
const fmt = (q: number) => Math.abs(q) >= 1000 ? `${(q / 1000).toFixed(2)} kJ` : `${q.toFixed(1)} J`;
export const CarnotMeasurements = ({ results }: { results: CarnotResults }) => {
  const items = [
    { label: "η (Carnot)", value: `${(results.efficiency * 100).toFixed(2)} %`, accent: true },
    { label: "η (Otto, r=V₂/V₁)", value: `${(results.efficiencyOtto * 100).toFixed(2)} %` },
    { label: "Q_h (absorvido)", value: fmt(results.Qh_J), accent: true },
    { label: "Q_c (rejeitado)", value: fmt(results.Qc_J) },
    { label: "W líquido", value: fmt(results.Wnet_J), accent: true },
    { label: "V₃", value: `${results.V3_L.toFixed(2)} L` },
    { label: "V₄", value: `${results.V4_L.toFixed(2)} L` },
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