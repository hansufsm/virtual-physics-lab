import type { GratingParams, GratingResults } from "@/lib/physics";
export const GratingMeasurements = ({ params, results }: { params: GratingParams; results: GratingResults }) => {
  const dlambda = params.lambda_nm / Math.max(results.resolving_power, 1);
  const items = [
    { label: "Espaçamento d", value: `${results.d_um.toFixed(4)} μm`, accent: true },
    { label: "d / λ", value: (results.d_nm / params.lambda_nm).toFixed(3) },
    { label: "Ordens visíveis", value: `${results.orders.length}`, accent: true },
    { label: "Ordem máxima |m|", value: `${Math.max(0, ...results.orders.map(o => Math.abs(o.m)))}` },
    { label: "Dispersão (m=1)", value: `${results.dispersion_deg_per_nm.toFixed(5)} °/nm` },
    { label: "Poder resolvente R", value: `${results.resolving_power}`, accent: true },
    { label: "Δλ mínimo (m=1)", value: `${dlambda.toFixed(4)} nm` },
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
