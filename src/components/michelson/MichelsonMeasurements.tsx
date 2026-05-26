import { formatSI, type MichelsonParams, type MichelsonResults } from "@/lib/physics";

interface Props { params: MichelsonParams; results: MichelsonResults }

export const MichelsonMeasurements = ({ params, results }: Props) => {
  const items: { label: string; value: string; accent?: boolean }[] = [
    { label: "Δ = 2(L₂ − L₁)", value: formatSI(results.pathDiffM, "m", 3), accent: true },
    { label: "Ordem central m₀", value: results.orderCenter.toFixed(2) },
    { label: "I_centro / I_max", value: results.centralIntensity.toFixed(3), accent: true },
    { label: "λ", value: `${params.wavelengthNm.toFixed(1)} nm` },
    { label: "λ/2 (passo de franja)", value: formatSI(params.wavelengthNm * 1e-9 / 2, "m", 3) },
  ];
  if (params.mode === "linear") {
    items.push({ label: "Λ = λ/(2·tilt)", value: `${results.fringeSpacingMm.toFixed(3)} mm`, accent: true });
  } else {
    items.push(
      { label: "Anéis visíveis", value: `${results.numVisibleRings}`, accent: true },
      { label: "Δr (1º→2º anel)", value: isFinite(results.fringeSpacingMm) ? `${results.fringeSpacingMm.toFixed(3)} mm` : "—" },
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums text-right ${it.accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
        Metrologia: contando N franjas que passam pelo centro ao deslocar M₂, ΔL = N·λ/2. Base do interferômetro padrão para medir comprimentos com precisão ≲ λ.
      </p>
    </div>
  );
};