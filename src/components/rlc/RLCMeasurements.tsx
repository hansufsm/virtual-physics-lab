import { formatSI } from "@/lib/physics";
import type { RLCResults } from "@/lib/physics";

interface Props { results: RLCResults }

export const RLCMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Frequência de ressonância f₀", value: `${results.f0.toFixed(2)} Hz`, accent: true },
    { label: "Reatância XL", value: `${results.xL.toFixed(2)} Ω` },
    { label: "Reatância XC", value: `${results.xC.toFixed(2)} Ω` },
    { label: "Reatância líquida X", value: `${results.reactance.toFixed(2)} Ω` },
    { label: "Impedância |Z|", value: `${results.impedance.toFixed(2)} Ω`, accent: true },
    { label: "Defasagem φ (V→I)", value: `${results.phaseDeg.toFixed(2)}°` },
    { label: "Corrente Irms", value: formatSI(results.currentRms, "A", 3), accent: true },
    { label: "V_R", value: `${results.vR.toFixed(2)} V` },
    { label: "V_L", value: `${results.vL.toFixed(2)} V` },
    { label: "V_C", value: `${results.vC.toFixed(2)} V` },
    { label: "Potência média", value: formatSI(results.pAvg, "W", 3) },
    { label: "Fator Q", value: results.Q.toFixed(3), accent: true },
    { label: "Largura de banda Δf", value: `${results.bandwidthHz.toFixed(2)} Hz` },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${it.accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};