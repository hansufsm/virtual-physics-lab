import type { FranckHertzResults } from "@/lib/physics";

export const FranckHertzMeasurements = ({ results }: { results: FranckHertzResults }) => {
  const items = [
    { label: "ΔV entre picos", value: `${results.spacing_V.toFixed(2)} V`, accent: true },
    { label: "Nº de picos visíveis", value: `${results.peaks.length}` },
    { label: "λ emitido (desexc.)", value: `${results.photon_nm.toFixed(1)} nm`, accent: true },
    { label: "1º pico em", value: results.peaks[0] ? `${results.peaks[0].V.toFixed(2)} V` : "—" },
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