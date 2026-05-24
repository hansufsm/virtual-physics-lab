import { formatSI, formatDuration, RADIO_ISOTOPES, type DecayParams, type DecayResults } from "@/lib/physics";

interface Props { params: DecayParams; results: DecayResults }

export const DecayMeasurements = ({ params, results }: Props) => {
  const iso = RADIO_ISOTOPES.find((i) => i.name === params.isotopeName);
  const items = [
    { label: "Isótopo", value: iso ? `${iso.label} (${iso.decay} → ${iso.daughter})` : params.isotopeName, accent: true },
    { label: "T½", value: formatDuration(params.halfLifeS) },
    { label: "λ = ln2/T½", value: `${formatSI(results.lambda, "1/s", 3)}` },
    { label: "Vida média τ", value: formatDuration(results.meanLifeS) },
    { label: "t / T½", value: results.halfLivesElapsed.toFixed(3) },
    { label: "N(t)", value: results.N.toLocaleString("pt-BR", { maximumFractionDigits: 0 }), accent: true },
    { label: "Decaídos", value: results.decayed.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) },
    { label: "Fração restante", value: `${(results.fractionRemaining * 100).toFixed(2)} %` },
    { label: "Atividade A(t)", value: formatSI(results.activity, "Bq", 2), accent: true },
    { label: "A₀ inicial", value: formatSI(results.activity0, "Bq", 2) },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums text-right ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
        1 Bq = 1 desintegração/s. 1 Ci = 3.7 ×10¹⁰ Bq. λ é a probabilidade de decaimento por unidade de tempo.
      </p>
    </div>
  );
};