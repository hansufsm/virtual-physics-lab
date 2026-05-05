import { formatSI } from "@/lib/physics";
import type { ChargeParams, ChargeDerived } from "@/lib/physics";

interface Props { params: ChargeParams; derived: ChargeDerived }

export const ChargeMeasurements = ({ params, derived }: Props) => {
  const items = [
    { label: "Carga q", value: formatSI(derived.q, "C", 3) },
    { label: "Massa m", value: formatSI(derived.m, "kg", 3) },
    { label: "q/m", value: formatSI(derived.qOverM, "C/kg", 3) },
    { label: "Energia cinética", value: `${derived.energyEv.toExponential(2)} eV` },
    { label: "Raio de Larmor r", value: formatSI(derived.rGyro, "m", 3), accent: params.mode !== "eOnly" },
    { label: "Frequência ciclotrônica f𝒸", value: formatSI(derived.fCyc, "Hz", 3), accent: params.mode === "cyclotron" },
    { label: "Período T𝒸", value: formatSI(derived.tCyc, "s", 3) },
    { label: "v seletor (E/B)", value: formatSI(derived.vSelector, "m/s", 3), accent: params.mode === "selector" },
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