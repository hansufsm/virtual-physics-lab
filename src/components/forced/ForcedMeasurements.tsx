import type { ForcedResults } from "@/lib/physics";
export const ForcedMeasurements = ({ results }: { results: ForcedResults }) => {
  const items = [
    { label: "ω₀ = √(k/m)", value: `${results.omega0_rad_s.toFixed(3)} rad/s`, accent: true },
    { label: "γ = b/(2m)", value: `${results.gamma_per_s.toFixed(4)} 1/s` },
    { label: "Fator de qualidade Q", value: isFinite(results.Q) ? results.Q.toFixed(2) : "∞", accent: true },
    { label: "ω_r (pico de A)", value: results.omegaR_rad_s > 0 ? `${results.omegaR_rad_s.toFixed(3)} rad/s` : "—" },
    { label: "Largura Δω ≈ 2γ", value: `${results.bandwidth_rad_s.toFixed(4)} rad/s` },
    { label: "Amplitude A(ω)", value: `${(results.A_drive_m * 100).toFixed(3)} cm`, accent: true },
    { label: "Defasagem φ", value: `${(results.phase_rad * 180 / Math.PI).toFixed(1)}°` },
    { label: "Amplitude máxima A_max", value: `${(results.Amax_m * 100).toFixed(3)} cm` },
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