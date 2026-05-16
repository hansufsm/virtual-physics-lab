import type { ThinLensParams, ThinLensResults } from "@/lib/physics";

interface Props { results: ThinLensResults; params: ThinLensParams }

const fmt = (v: number | null, unit: string, d = 2) =>
  v == null || !isFinite(v) ? "—" : `${v.toFixed(d)} ${unit}`;

export const LensMeasurements = ({ results }: Props) => {
  const items = [
    { label: "f efetivo", value: fmt(results.focalCm, "cm"), accent: true },
    { label: "Potência", value: `${results.power.toFixed(2)} D` },
    { label: "dᵢ (imagem)", value: fmt(results.imageDistanceCm, "cm"), accent: true },
    { label: "hᵢ (altura imagem)", value: fmt(results.imageHeightCm, "cm") },
    { label: "Ampliação m", value: results.magnification == null ? "—" : results.magnification.toFixed(3), accent: true },
    { label: "Natureza", value: results.imageType === "real" ? "Real" : results.imageType === "virtual" ? "Virtual" : "Sem imagem" },
    { label: "Orientação", value: results.orientation },
    { label: "Tamanho", value: results.size },
    { label: "Tipo de lente", value: results.isConverging ? "Convergente" : "Divergente" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};