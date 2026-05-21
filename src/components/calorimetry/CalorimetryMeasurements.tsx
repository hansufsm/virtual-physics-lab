import type { CalorimetryParams, CalorimetryResults } from "@/lib/physics";

interface Props { params: CalorimetryParams; results: CalorimetryResults }

export const CalorimetryMeasurements = ({ params, results }: Props) => {
  const scenarioLabel: Record<CalorimetryResults["scenario"], string> = {
    "no-ice": "Sem gelo",
    "all-melt": "Todo o gelo derreteu",
    "partial-melt": "Gelo derreteu parcialmente",
    "all-freeze": "Energia insuficiente",
  };
  const items = [
    { label: "T equilíbrio", value: `${results.Tf.toFixed(2)} °C`, accent: true },
    { label: "Cenário", value: scenarioLabel[results.scenario] },
    { label: "Gelo restante", value: `${(results.remainingIce * 1000).toFixed(1)} g` },
    { label: "Fração derretida", value: `${(results.meltedFraction * 100).toFixed(1)} %` },
    { label: "Q água + cal.", value: fmtJ(results.qWater) },
    { label: "Q sólido", value: fmtJ(results.qSolid) },
    { label: "Q gelo", value: fmtJ(results.qIce) },
    { label: "Σ Q (resíduo)", value: fmtJ(results.energyBalance), accent: true },
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
      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
        c_água = {results.cWater} J/(kg·K) · L_f = {results.Lf / 1000} kJ/kg · sólido {params.solidName} ({params.cSolid} J/(kg·K)).
      </p>
    </div>
  );
};

function fmtJ(q: number) {
  const abs = Math.abs(q);
  if (abs >= 1000) return `${(q / 1000).toFixed(2)} kJ`;
  return `${q.toFixed(1)} J`;
}