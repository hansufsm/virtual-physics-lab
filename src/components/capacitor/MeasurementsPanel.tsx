import { formatSI, type CapacitorResults } from "@/lib/physics";

interface Props {
  results: CapacitorResults;
}

export const MeasurementsPanel = ({ results }: Props) => {
  const items = [
    { label: "Capacitância C", value: formatSI(results.capacitance, "F"), formula: "C = εᵣε₀ A / d" },
    { label: "Carga Q", value: formatSI(results.charge, "C"), formula: "Q = C·V" },
    { label: "Energia U", value: formatSI(results.energy, "J"), formula: "U = ½ C V²" },
    { label: "Campo elétrico E", value: formatSI(results.electricField, "V/m"), formula: "E = V / d" },
    { label: "Densidade σ", value: formatSI(results.surfaceCharge, "C/m²"), formula: "σ = Q / A" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-gradient-subtle">
        <h3 className="font-display text-base font-semibold">Grandezas calculadas</h3>
      </div>
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.label} className="px-5 py-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-foreground">{it.label}</div>
              <div className="font-mono text-[11px] text-muted-foreground">{it.formula}</div>
            </div>
            <div className="font-mono text-sm font-semibold text-primary tabular-nums whitespace-nowrap">
              {it.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};