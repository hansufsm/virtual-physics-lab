import type { MaxwellResults } from "@/lib/physics";
export const MaxwellMeasurements = ({ results }: { results: MaxwellResults }) => {
  const items = [
    { label: "v_mp = √(2RT/M)", value: `${results.v_mp.toFixed(1)} m/s`, accent: true },
    { label: "v̄ = √(8RT/πM)", value: `${results.v_avg.toFixed(1)} m/s`, accent: true },
    { label: "v_rms = √(3RT/M)", value: `${results.v_rms.toFixed(1)} m/s`, accent: true },
    { label: "Amostras (Monte Carlo)", value: `${results.samples}` },
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