import { formatSI } from "@/lib/physics";
import type { ArchimedesResults } from "@/lib/physics";
export const ArchimedesMeasurements = ({ results }: { results: ArchimedesResults }) => {
  const items = [
    { label: "Estado", value: results.floats ? "Flutua ⛵" : "Afunda ⬇", accent: true },
    { label: "Massa", value: `${results.mass_kg.toFixed(3)} kg` },
    { label: "Peso P = m·g", value: formatSI(results.weight_N, "N", 3) },
    { label: "Empuxo (totalmente submerso)", value: formatSI(results.buoyancy_max_N, "N", 3) },
    { label: "Empuxo no equilíbrio E", value: formatSI(results.buoyancy_eq_N, "N", 3), accent: true },
    { label: "Peso aparente (submerso)", value: formatSI(results.apparent_weight_N, "N", 3) },
    { label: "Volume V", value: `${(results.V_m3*1000).toFixed(4)} L` },
    { label: "Volume submerso", value: `${(results.V_submerged_m3*1000).toFixed(4)} L` },
    { label: "Fração submersa", value: `${(results.fraction_submerged*100).toFixed(1)} %`, accent: true },
    { label: "Acima da linha d'água", value: `${results.height_above_pct.toFixed(1)} %` },
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