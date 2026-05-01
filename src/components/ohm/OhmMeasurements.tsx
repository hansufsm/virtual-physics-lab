import { formatSI, type OhmResults } from "@/lib/physics";

interface Props { results: OhmResults }

export const OhmMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Resistência R", value: formatSI(results.resistance, "Ω"), formula: "R = ρL / A" },
    { label: "Corrente I", value: formatSI(results.current, "A"), formula: "I = V / (R + r)" },
    { label: "Tensão sobre R", value: formatSI(results.voltageDrop, "V"), formula: "U = R·I" },
    { label: "Potência P", value: formatSI(results.power, "W"), formula: "P = U·I = R·I²" },
    { label: "Seção transversal A", value: formatSI(results.area, "m²"), formula: "A = π(⌀/2)²" },
    { label: "Condutância G", value: formatSI(results.conductance, "S"), formula: "G = 1 / R" },
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