import { formatSI } from "@/lib/physics";
import type { CoilParams, CoilResults } from "@/lib/physics";

interface Props {
  params: CoilParams;
  results: CoilResults;
}

export const CoilMeasurements = ({ params, results }: Props) => {
  const items = [
    { label: "B no centro", value: formatSI(results.bCenter, "T", 3), accent: true },
    ...(params.type === "solenoid" ? [
      { label: "n (espiras/m)", value: results.nPerMeter.toFixed(1) },
      { label: "B ideal (µ₀nI)", value: formatSI(results.bIdealSolenoid, "T", 3) },
      { label: "Razão B/Bideal", value: results.bIdealSolenoid !== 0 ? (results.bCenter / results.bIdealSolenoid).toFixed(3) : "—" },
    ] : []),
    { label: "Variação B em ±R/2", value: `${results.uniformityPct.toFixed(2)} %` },
    { label: "B em Gauss", value: `${(results.bCenter * 1e4).toFixed(3)} G` },
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