import type { LaserResults } from "@/lib/physics";

export const LaserMeasurements = ({ results }: { results: LaserResults }) => {
  const lasing = results.modes.filter((m) => m.lasing).length;
  const items = [
    { label: "FSR (c/2L)", value: `${results.fsr_GHz.toFixed(3)} GHz`, accent: true },
    { label: "Finesse F", value: results.finesse.toFixed(1), accent: true },
    { label: "Largura do modo", value: `${results.linewidth_MHz.toFixed(2)} MHz` },
    { label: "L_coerência", value: `${(results.coherence_m).toFixed(2)} m` },
    { label: "Modos oscilando", value: `${lasing}`, accent: true },
    { label: "Potência (u.a.)", value: results.output_power_au.toFixed(3) },
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