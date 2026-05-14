import { formatSI, type IdealGasResults } from "@/lib/physics";

interface Props { results: IdealGasResults }

export const IdealGasMeasurements = ({ results }: Props) => {
  const items = [
    { label: "P₁", value: formatSI(results.P1, "Pa", 3), accent: true },
    { label: "P₂", value: formatSI(results.P2, "Pa", 3), accent: true },
    { label: "V₂", value: `${results.V2.toFixed(3)} L` },
    { label: "T₂", value: `${results.T2.toFixed(2)} K` },
    { label: "Trabalho W", value: formatSI(results.work, "J", 3), accent: true },
    { label: "Calor Q", value: formatSI(results.heat, "J", 3), accent: true },
    { label: "ΔU", value: formatSI(results.deltaU, "J", 3) },
    { label: "ΔS", value: `${results.deltaS.toFixed(3)} J/K` },
    { label: "Cv", value: `${results.cv.toFixed(2)} J/(mol·K)` },
    { label: "Cp", value: `${results.cp.toFixed(2)} J/(mol·K)` },
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