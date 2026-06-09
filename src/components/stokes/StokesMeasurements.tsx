import type { StokesResults } from "@/lib/physics";
export const StokesMeasurements = ({ results }: { results: StokesResults }) => {
  const items = [
    { label: "v terminal", value: `${results.v_terminal.toFixed(4)} m/s`, accent: true },
    { label: "τ (tempo car.)", value: `${results.tau_s.toExponential(2)} s` },
    { label: "Reynolds", value: results.reynolds.toExponential(2), accent: true },
    { label: "Peso", value: `${results.weight_N.toExponential(2)} N` },
    { label: "Empuxo", value: `${results.buoyancy_N.toExponential(2)} N` },
    { label: "Arrasto", value: `${results.drag_N.toExponential(2)} N` },
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
      {results.reynolds > 1 && (
        <p className="mt-3 text-xs text-accent">⚠ Re &gt; 1: Lei de Stokes (regime laminar) começa a perder validade.</p>
      )}
    </div>
  );
};