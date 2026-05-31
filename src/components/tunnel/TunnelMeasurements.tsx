import type { TunnelParams, TunnelResults } from "@/lib/physics";
export const TunnelMeasurements = ({ params, results }: { params: TunnelParams; results: TunnelResults }) => {
  const items = [
    { label: "Regime", value: results.regime, accent: true },
    { label: "Transmissão T", value: results.T < 1e-4 ? results.T.toExponential(3) : results.T.toFixed(5), accent: true },
    { label: "Reflexão R = 1−T", value: results.R.toFixed(5) },
    { label: "k (fora)", value: `${results.k_invnm.toFixed(3)} nm⁻¹` },
    { label: "κ (dentro)", value: results.kappa_invnm > 0 ? `${results.kappa_invnm.toFixed(3)} nm⁻¹` : "—" },
    { label: "κ·a", value: results.kappa_invnm > 0 ? (results.kappa_invnm * params.a_nm).toFixed(3) : "—" },
    { label: "E/V₀", value: (params.E_eV / params.V0_eV).toFixed(3) },
    { label: "m·a²·V₀ (sem.)", value: (params.mass_me * params.a_nm * params.a_nm * params.V0_eV).toFixed(3) },
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
