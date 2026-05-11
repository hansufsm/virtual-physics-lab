import { formatSI } from "@/lib/physics";
import type { DoubleSlitDerived, DoubleSlitParams } from "@/lib/physics";

interface Props { params: DoubleSlitParams; derived: DoubleSlitDerived }

export const DoubleSlitMeasurements = ({ derived }: Props) => {
  const items = [
    { label: "Espaçamento Δy = λL/d", value: `${derived.fringeSpacingMm.toFixed(3)} mm`, accent: true },
    { label: "Largura central 2λL/a", value: `${derived.centralWidthMm.toFixed(2)} mm`, accent: true },
    { label: "I/I₀ no ponto", value: derived.intensityAtProbe.toFixed(4) },
    { label: "Ângulo θ no ponto", value: formatSI(derived.angleAtProbeRad, "rad", 4) },
    { label: "Ordem máxima |m|", value: `${derived.firstMaxOrder}` },
    { label: "Franjas no envelope", value: `${derived.numVisibleFringes}` },
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