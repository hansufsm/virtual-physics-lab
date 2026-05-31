import type { BlackbodyParams, BlackbodyResults } from "@/lib/physics";
export const BlackbodyMeasurements = ({ params, results }: { params: BlackbodyParams; results: BlackbodyResults }) => {
  const items = [
    { label: "T", value: `${params.T_K.toFixed(1)} K`, accent: true },
    { label: "λ_max (Wien)", value: `${results.peak_nm.toFixed(1)} nm`, accent: true },
    { label: "Intensidade total", value: `${results.total_Wm2.toExponential(3)} W/m²`, accent: true },
    { label: "B(λ_max)", value: `${results.peak_intensity.toExponential(3)}` },
    { label: "Constante de Wien", value: "2.898×10⁻³ m·K" },
    { label: "σ (Stefan-Boltzmann)", value: "5.670×10⁻⁸ W/m²K⁴" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-3">Medições</h3>
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-secondary">
        <div className="h-10 w-10 rounded-full border-2 border-border" style={{ background: results.color, boxShadow: `0 0 20px ${results.color}` }} />
        <div className="text-xs text-muted-foreground">Cor visual aproximada do emissor</div>
      </div>
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
