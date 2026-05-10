import { formatSI } from "@/lib/physics";
import type { PotentialDerived, PotentialParams } from "@/lib/physics";

interface Props { params: PotentialParams; derived: PotentialDerived }

export const PotentialMeasurements = ({ derived }: Props) => {
  const items = [
    { label: "Potencial V no ponto", value: formatSI(derived.V, "V", 4), accent: true },
    { label: "|E| = |−∇V|", value: formatSI(derived.Emag, "V/m", 4), accent: true },
    { label: "Eₓ", value: formatSI(derived.Ex, "V/m", 4) },
    { label: "Eᵧ", value: formatSI(derived.Ey, "V/m", 4) },
    { label: "Nº de cargas", value: `${derived.charges.length}` },
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