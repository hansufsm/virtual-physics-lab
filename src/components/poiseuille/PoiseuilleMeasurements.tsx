import type { PoiseuilleResults } from "@/lib/physics";
export const PoiseuilleMeasurements = ({ results }: { results: PoiseuilleResults }) => {
  const items = [
    { label: "Vazão Q", value: `${(results.Q_m3s * 1000).toExponential(3)} L/s`, accent: true },
    { label: "v máxima", value: `${results.v_max.toFixed(3)} m/s`, accent: true },
    { label: "v média", value: `${results.v_mean.toFixed(3)} m/s` },
    { label: "Resistência hidr.", value: `${results.resistance.toExponential(2)} Pa·s/m³` },
    { label: "τ_parede", value: `${results.shear_wall_Pa.toFixed(2)} Pa` },
    { label: "Reynolds", value: results.reynolds.toFixed(1), accent: true },
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
      {results.reynolds > 2300 && (
        <p className="mt-3 text-xs text-accent">⚠ Re &gt; 2300: regime transicional/turbulento — Poiseuille não se aplica.</p>
      )}
    </div>
  );
};