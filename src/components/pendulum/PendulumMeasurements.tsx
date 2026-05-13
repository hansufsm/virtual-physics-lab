import type { PendulumResults } from "@/lib/physics";

interface Props { results: PendulumResults }

export const PendulumMeasurements = ({ results }: Props) => {
  const items = [
    { label: "T (pequenos ângulos)", value: `${results.periodSmallAngle.toFixed(3)} s`, accent: true },
    { label: "T (correção 1ª ordem)", value: `${results.periodLargeAngle.toFixed(3)} s` },
    { label: "T medido (numérico)", value: results.periodMeasured ? `${results.periodMeasured.toFixed(3)} s` : "—", accent: true },
    { label: "Frequência ω₀", value: `${(2 * Math.PI / results.periodSmallAngle).toFixed(3)} rad/s` },
    { label: "Amplitude θ₀", value: `${results.amplitudeDeg.toFixed(1)}°` },
    { label: "|θ̇| máximo", value: `${results.maxOmega.toFixed(3)} rad/s` },
    { label: "Energia inicial", value: `${results.initialEnergy.toFixed(3)} J` },
    { label: "Energia final", value: `${results.finalEnergy.toFixed(3)} J` },
    { label: "Fator de qualidade Q", value: results.qualityFactor ? results.qualityFactor.toFixed(2) : "∞" },
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