import type { RutherfordResults } from "@/lib/physics";

interface Props { results: RutherfordResults }

export const RutherfordMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Ângulo θ", value: `${results.scatteringAngle_deg.toFixed(2)}°`, accent: true },
    { label: "k = Zz·e²/(4πε₀)", value: `${results.k_eVfm.toFixed(2)} eV·fm` },
    { label: "r_min", value: `${results.distance_min_fm.toFixed(2)} fm`, accent: true },
    { label: "dσ/dΩ", value: `${results.diffCrossSection_b_per_sr.toExponential(3)} b/sr`, accent: true },
    { label: "Energia (joules)", value: `${results.energy_J.toExponential(2)} J` },
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