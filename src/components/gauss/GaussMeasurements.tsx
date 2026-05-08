import { formatSI } from "@/lib/physics";
import type { GaussDerived, GaussParams } from "@/lib/physics";

interface Props { params: GaussParams; derived: GaussDerived }

export const GaussMeasurements = ({ params, derived }: Props) => {
  const items = [
    { label: "E no ponto de prova", value: formatSI(derived.E, "V/m", 4), accent: true },
    { label: "Carga interna Q_enc", value: formatSI(derived.Qenc, "C", 4) },
    { label: "Fluxo Φ = Q_enc/ε₀", value: formatSI(derived.flux, "V·m", 4), accent: true },
    { label: "Φ via E·A (verificação)", value: formatSI(derived.fluxFromArea, "V·m", 4) },
    { label: "Área da gaussiana", value: formatSI(derived.area, "m²", 4) },
    { label: "r / R_fonte", value: params.geometry === "sphere"
        ? (params.probeRcm / Math.max(0.001, params.sourceRadiusCm)).toFixed(3)
        : "—" },
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