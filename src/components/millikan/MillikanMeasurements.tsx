import type { MillikanResults } from "@/lib/physics";

export const MillikanMeasurements = ({ results }: { results: MillikanResults }) => {
  const items = [
    { label: "Carga q", value: `${results.q.toExponential(3)} C`, accent: true },
    { label: "q / e", value: `${results.q_over_e.toFixed(2)}`, accent: true },
    { label: "Massa", value: `${results.mass_kg.toExponential(2)} kg` },
    { label: "Peso − empuxo", value: `${(results.weight_N - results.buoyancy_N).toExponential(2)} N` },
    { label: "Campo E", value: `${results.E_Vm.toExponential(2)} V/m` },
    { label: "Força elétrica qE", value: `${results.fE_N.toExponential(2)} N` },
    { label: "v terminal (subida)", value: `${results.v_rise_mms.toFixed(3)} mm/s`, accent: true },
    { label: "v terminal (queda livre)", value: `${results.v_fall_mms.toFixed(3)} mm/s` },
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