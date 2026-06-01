import type { InclineResults } from "@/lib/physics";
export const InclineMeasurements = ({ results }: { results: InclineResults }) => {
  const items = [
    { label: "Estado", value: results.willMove ? "Move-se ▾" : "Em repouso", accent: true },
    { label: "Componente paralela F∥", value: `${results.Fg_paral_N.toFixed(2)} N` },
    { label: "Componente normal F⊥", value: `${results.Fg_norm_N.toFixed(2)} N` },
    { label: "Normal N", value: `${results.Normal_N.toFixed(2)} N` },
    { label: "Atrito máx (μ_s·N)", value: `${results.F_atrito_max_N.toFixed(2)} N` },
    { label: "Atrito cinético (μ_k·N)", value: `${results.F_atrito_cin_N.toFixed(2)} N` },
    { label: "Ângulo crítico θ_c", value: `${results.angle_critical_deg.toFixed(2)}°`, accent: true },
    { label: "Aceleração a", value: `${results.acceleration_m_s2.toFixed(3)} m/s²`, accent: true },
    { label: "Tempo para descer L", value: isFinite(results.t_descida_s) ? `${results.t_descida_s.toFixed(3)} s` : "—" },
    { label: "Velocidade final", value: `${results.v_final_m_s.toFixed(3)} m/s` },
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