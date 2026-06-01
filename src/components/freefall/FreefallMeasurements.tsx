import { formatSI } from "@/lib/physics";
import type { FreefallResults } from "@/lib/physics";
export const FreefallMeasurements = ({ results }: { results: FreefallResults }) => {
  const items = [
    { label: "Tempo de queda t", value: `${results.t_fall_s.toFixed(3)} s`, accent: true },
    { label: "Velocidade no impacto", value: `${results.v_impact_m_s.toFixed(3)} m/s`, accent: true },
    { label: "Energia cinética final", value: formatSI(results.E_kin_J, "J", 3) },
    { label: "Velocidade terminal", value: isFinite(results.v_terminal_m_s) ? `${results.v_terminal_m_s.toFixed(2)} m/s` : "—" },
    { label: "Pontos calculados", value: `${results.trajectory.length}` },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};