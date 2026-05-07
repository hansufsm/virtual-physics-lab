import { formatSI } from "@/lib/physics";
import type { AmpereDerived, AmpereParams } from "@/lib/physics";

interface Props { params: AmpereParams; derived: AmpereDerived }

export const AmpereMeasurements = ({ params, derived }: Props) => {
  const isToroid = params.geometry === "toroid";
  const items = isToroid
    ? [
        { label: "B no toroide (r = R)", value: formatSI(derived.bToroidInside, "T", 4), accent: true },
        { label: "Fora do toroide", value: formatSI(derived.bToroidOutside, "T", 4) },
        { label: "N · I", value: `${(params.N * params.I1).toFixed(2)} A·esp` },
        { label: "Raio interno", value: formatSI(derived.toroidRMin, "m", 3) },
        { label: "Raio externo", value: formatSI(derived.toroidRMax, "m", 3) },
      ]
    : [
        { label: "|B| no ponto", value: formatSI(derived.bAtProbe, "T", 4), accent: true },
        { label: "Bx", value: formatSI(derived.bxAtProbe, "T", 4) },
        { label: "By", value: formatSI(derived.byAtProbe, "T", 4) },
        ...(params.geometry === "parallel"
          ? [
              { label: "F/L entre fios", value: `${formatSI(derived.forcePerLength, "N/m", 4)} ${derived.forcePerLength >= 0 ? "(atrativa)" : "(repulsiva)"}` },
              { label: "F total no trecho L", value: formatSI(derived.forceTotal, "N", 4) },
            ]
          : []),
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