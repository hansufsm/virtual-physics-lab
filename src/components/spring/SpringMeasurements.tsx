import { formatSI } from "@/lib/physics";
import type { SpringResults } from "@/lib/physics";
export const SpringMeasurements = ({ results }: { results: SpringResults }) => {
  const items = [
    { label: "k_eq", value: `${results.k_eq_N_per_m.toFixed(2)} N/m`, accent: true },
    { label: "Período T = 2π√(m/k)", value: `${results.T_s.toFixed(3)} s`, accent: true },
    { label: "Frequência f", value: `${results.freq_Hz.toFixed(3)} Hz` },
    { label: "ω", value: `${results.omega_rad_s.toFixed(3)} rad/s` },
    { label: "Alongamento estático mg/k", value: `${(results.x_static_m*100).toFixed(2)} cm` },
    { label: "x(t)", value: `${(results.x_t_m*100).toFixed(2)} cm` },
    { label: "v(t)", value: `${results.v_t_m_s.toFixed(3)} m/s` },
    { label: "a(t)", value: `${results.a_t_m_s2.toFixed(3)} m/s²` },
    { label: "Energia total ½kA²", value: formatSI(results.E_total_J, "J", 3), accent: true },
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