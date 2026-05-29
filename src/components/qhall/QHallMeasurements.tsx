import type { QHallResults } from "@/lib/physics";

interface Props { results: QHallResults }

export const QHallMeasurements = ({ results }: Props) => {
  const items = [
    { label: "ν (filling factor)", value: results.fillingFactor.toFixed(3), accent: true },
    { label: "Platô mais próximo", value: `ν = ${results.nearestPlateau}` },
    { label: "R_K = h/e²", value: `${results.R_K_Ohm.toFixed(3)} Ω` },
    { label: "R_xy (ideal platô)", value: `${results.plateauR_Ohm.toFixed(3)} Ω` },
    { label: "R_xy (atual)", value: `${results.R_xy_Ohm.toFixed(2)} Ω`, accent: true },
    { label: "R_xx", value: `${results.R_xx_Ohm.toFixed(2)} Ω` },
    { label: "V_Hall", value: `${results.V_H_mV.toFixed(4)} mV` },
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