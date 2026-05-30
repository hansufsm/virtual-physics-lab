import type { NMRResults } from "@/lib/physics";

export const NMRMeasurements = ({ results }: { results: NMRResults }) => {
  const items = [
    { label: "γ/2π", value: `${results.gamma_MHz_per_T.toFixed(3)} MHz/T` },
    { label: "Frequência de Larmor", value: `${results.larmor_MHz.toFixed(3)} MHz`, accent: true },
    { label: "Detuning (ν − ν_L)", value: `${results.detuning_kHz.toFixed(2)} kHz` },
    { label: "Mz / M₀", value: results.Mz_over_M0.toFixed(3), accent: true },
    { label: "|Mxy| / M₀", value: results.Mxy_over_M0.toFixed(3), accent: true },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums text-right ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};