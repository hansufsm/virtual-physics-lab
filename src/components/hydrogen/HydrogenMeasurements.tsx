import type { HydrogenResults } from "@/lib/physics";
export const HydrogenMeasurements = ({ results }: { results: HydrogenResults }) => {
  const first = results.lines[0];
  const limit = results.lines[results.lines.length - 1];
  const items = [
    { label: "Série", value: results.series.name, accent: true },
    { label: "n_inf → ∞", value: `${results.series.n_low} → ∞` },
    { label: "λ primeira (Hα-like)", value: `${first ? first.lambda_nm.toFixed(2) + " nm" : "—"}`, accent: true },
    { label: "Energia da 1ª linha", value: `${first ? first.energy_eV.toFixed(3) + " eV" : "—"}` },
    { label: "λ limite da série", value: `${limit ? limit.lambda_nm.toFixed(2) + " nm" : "—"}` },
    { label: "Linhas visíveis", value: `${results.lines.filter((l) => l.visible).length}`, accent: true },
    { label: "Energia de ionização", value: `${results.ionization_eV.toFixed(3)} eV` },
    { label: "R_∞", value: "1.0974×10⁷ m⁻¹" },
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
