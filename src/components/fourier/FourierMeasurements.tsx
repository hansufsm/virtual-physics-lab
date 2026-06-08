import type { FourierResults } from "@/lib/physics";
export const FourierMeasurements = ({ results }: { results: FourierResults }) => {
  const items = [
    { label: "q (taxa)", value: `${results.q_W.toFixed(2)} W`, accent: true },
    { label: "Fluxo q/A", value: `${results.flux_W_m2.toFixed(2)} W/m²`, accent: true },
    { label: "R_total", value: `${results.R_total_K_per_W.toExponential(3)} K/W` },
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
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Interfaces</div>
        <ul className="text-xs font-mono space-y-1">
          {results.interfaceTemps_K.map((T, i) => (
            <li key={i}><span className="text-muted-foreground">T_{i}</span> = {T.toFixed(2)} K</li>
          ))}
        </ul>
      </div>
    </div>
  );
};