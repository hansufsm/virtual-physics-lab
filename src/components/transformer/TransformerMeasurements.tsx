import { formatSI } from "@/lib/physics";
import type { TransformerResults } from "@/lib/physics";

interface Props { results: TransformerResults }

export const TransformerMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Razão a = N₁/N₂", value: results.ratio.toFixed(3), accent: true },
    { label: "Tipo", value: results.type === "step-up" ? "Elevador" : results.type === "step-down" ? "Abaixador" : "Isolador" },
    { label: "V₂ ideal", value: `${results.vSecondaryIdeal.toFixed(2)} V` },
    { label: "V₂ real", value: `${results.vSecondary.toFixed(2)} V`, accent: true },
    { label: "I₁", value: formatSI(results.iPrimary, "A", 3) },
    { label: "I₂", value: formatSI(results.iSecondary, "A", 3) },
    { label: "P entrada", value: formatSI(results.pIn, "W", 3) },
    { label: "P saída", value: formatSI(results.pOut, "W", 3) },
    { label: "Perdas", value: formatSI(results.pLoss, "W", 3) },
    { label: "Rendimento η", value: `${(results.efficiency * 100).toFixed(2)} %`, accent: true },
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