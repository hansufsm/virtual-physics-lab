import type { FoucaultParams, FoucaultResults } from "@/lib/physics";
export const FoucaultMeasurements = ({ params, results }: { params: FoucaultParams; results: FoucaultResults }) => {
  const dir = results.omega_prec > 0 ? "anti-horária (N→O)" : results.omega_prec < 0 ? "horária (S→O)" : "—";
  const Tprec = isFinite(results.T_prec_h) ? `${results.T_prec_h.toFixed(2)} h` : "∞ (equador)";
  const items = [
    { label: "Período T do pêndulo", value: `${results.T_s.toFixed(3)} s`, accent: true },
    { label: "ω_pendulo", value: `${results.omega_pend.toFixed(4)} rad/s` },
    { label: "Ω_⊕ sin φ", value: `${(results.omega_prec * 1e5).toFixed(4)}·10⁻⁵ rad/s`, accent: true },
    { label: "T_precessão", value: Tprec, accent: true },
    { label: "Rotação do plano", value: `${results.rotation_deg.toFixed(2)}°` },
    { label: "Sentido", value: dir },
    { label: "Latitude", value: `${params.latitude_deg.toFixed(2)}°` },
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
