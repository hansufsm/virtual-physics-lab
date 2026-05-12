import type { ProjectileResults } from "@/lib/physics";

interface Props { results: ProjectileResults }

export const ProjectileMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Alcance R", value: `${results.range.toFixed(2)} m`, accent: true },
    { label: "Altura máxima H", value: `${results.maxHeight.toFixed(2)} m`, accent: true },
    { label: "Tempo de voo T", value: `${results.flightTime.toFixed(3)} s` },
    { label: "Tempo até apogeu", value: `${results.apexTime.toFixed(3)} s` },
    { label: "Velocidade no impacto", value: `${results.impactSpeed.toFixed(2)} m/s` },
    { label: "Ângulo de impacto", value: `${results.impactAngleDeg.toFixed(1)}°` },
    { label: "R no vácuo (ref.)", value: `${results.vacuumRange.toFixed(2)} m` },
    { label: "H no vácuo (ref.)", value: `${results.vacuumMaxHeight.toFixed(2)} m` },
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