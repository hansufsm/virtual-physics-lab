import { formatSI } from "@/lib/physics";
import type { DipoleDerived, DipoleParams } from "@/lib/physics";

interface Props { params: DipoleParams; derived: DipoleDerived }

export const DipoleMeasurements = ({ params, derived }: Props) => {
  const items = params.mode === "torque"
    ? [
        { label: "Momento de dipolo |p|", value: formatSI(derived.p, "C·m", 4), accent: true },
        { label: "Torque τ = pE sinθ", value: formatSI(derived.torque, "N·m", 4), accent: true },
        { label: "Energia U = -pE cosθ", value: formatSI(derived.energy, "J", 4) },
        { label: "Força resultante (E uniforme)", value: formatSI(derived.forceNet, "N", 3) },
        { label: "Período (osc. pequena)", value: isFinite(derived.period) ? formatSI(derived.period, "s", 4) : "—" },
      ]
    : [
        { label: "Momento de dipolo |p|", value: formatSI(derived.p, "C·m", 4), accent: true },
        { label: "|E| no ponto", value: formatSI(derived.Emag, "V/m", 4), accent: true },
        { label: "Eₓ", value: formatSI(derived.Ex, "V/m", 4) },
        { label: "Eᵧ", value: formatSI(derived.Ey, "V/m", 4) },
        { label: "Distância r", value: `${derived.rCm.toFixed(2)} cm` },
      ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};