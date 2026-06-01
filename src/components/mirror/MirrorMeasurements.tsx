import type { MirrorResults } from "@/lib/physics";
export const MirrorMeasurements = ({ results }: { results: MirrorResults }) => {
  const items = [
    { label: "Foco f", value: `${results.f_cm.toFixed(2)} cm`, accent: true },
    { label: "Distância p", value: `${results.p_cm.toFixed(2)} cm` },
    { label: "Distância p'", value: isFinite(results.pl_cm) ? `${results.pl_cm.toFixed(2)} cm` : "∞", accent: true },
    { label: "Aumento m = −p'/p", value: `${results.m.toFixed(3)}×`, accent: true },
    { label: "Altura da imagem", value: `${results.h_img_cm.toFixed(2)} cm` },
    { label: "Imagem real?", value: results.isReal ? "Sim" : "Não (virtual)" },
    { label: "Imagem invertida?", value: results.isInverted ? "Sim" : "Não (direita)" },
    { label: "Ampliada?", value: results.isMagnified ? "Sim (|m|>1)" : "Reduzida (|m|<1)" },
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
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{results.region}</p>
    </div>
  );
};