import type { SternResults } from "@/lib/physics";

interface Props { results: SternResults }

export const SternMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Átomo", value: results.preset.name, accent: true },
    { label: "g·s·μ_B = μ_z", value: `${(results.mu_z_JT*1e24).toFixed(3)} ·10⁻²⁴ J/T` },
    { label: "v térmica média", value: `${results.v_mean.toFixed(1)} m/s` },
    { label: "Força F", value: `${(results.force_N*1e20).toFixed(3)} ·10⁻²⁰ N` },
    { label: "Aceleração", value: `${results.acc.toExponential(2)} m/s²` },
    { label: "Separação total Δz", value: `${(results.deflection_m*1000).toFixed(3)} mm`, accent: true },
    { label: "Largura estatística σ", value: `${(results.spreadGauss_m*1000).toFixed(3)} mm` },
    { label: "Componentes", value: `${results.beams.length}`, accent: true },
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