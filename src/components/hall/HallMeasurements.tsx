import { formatSI } from "@/lib/physics";
import type { HallParams, HallDerived } from "@/lib/physics";

interface Props { params: HallParams; derived: HallDerived }

export const HallMeasurements = ({ derived }: Props) => {
  const items = [
    { label: "Tensão Hall V_H", value: formatSI(derived.vHall, "V", 3), accent: true },
    { label: "Coeficiente R_H", value: formatSI(derived.rH, "m³/C", 3) },
    { label: "Velocidade de deriva v_d", value: formatSI(derived.vDrift, "m/s", 3) },
    { label: "Densidade de corrente J", value: formatSI(derived.jCurrent, "A/m²", 3) },
    { label: "Campo Hall E_H", value: formatSI(derived.eHall, "V/m", 3) },
    { label: "Ângulo de Hall θ_H", value: `${(derived.hallAngle * 180 / Math.PI).toFixed(3)}°` },
    { label: "Resistividade ρ_xx", value: isFinite(derived.rhoXX) ? formatSI(derived.rhoXX, "Ω·m", 3) : "—" },
    { label: "Resistência R_xx", value: isFinite(derived.rXX) ? formatSI(derived.rXX, "Ω", 3) : "—" },
    { label: "ρ_xy = R_H·B", value: formatSI(derived.rhoXY, "Ω·m", 3) },
    { label: "n superficial (n·t)", value: `${derived.sheetN.toExponential(2)} m⁻²` },
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