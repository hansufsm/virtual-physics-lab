import { formatSI, type RelativityParams, type RelativityResults } from "@/lib/physics";

interface Props { params: RelativityParams; results: RelativityResults }

export const RelativityMeasurements = ({ params, results }: Props) => {
  const base: { label: string; value: string; accent?: boolean }[] = [
    { label: "β = v/c", value: results.beta.toFixed(4) },
    { label: "γ = 1/√(1−β²)", value: results.gamma.toFixed(4), accent: true },
  ];
  if (params.scenario === "dilation") {
    base.push(
      { label: "Δt₀ (próprio)", value: `${params.dt0_s.toFixed(3)} s` },
      { label: "Δt (lab) = γ·Δt₀", value: `${results.dt_dilated_s.toFixed(3)} s`, accent: true },
      { label: "Fator de dilatação", value: `${results.gamma.toFixed(3)}×` },
    );
  } else if (params.scenario === "contraction") {
    base.push(
      { label: "L₀ (próprio)", value: `${params.L0_m.toFixed(2)} m` },
      { label: "L (lab) = L₀/γ", value: `${results.L_contracted_m.toFixed(3)} m`, accent: true },
      { label: "Encolhimento", value: `${((1 - 1 / results.gamma) * 100).toFixed(2)} %` },
    );
  } else if (params.scenario === "addition") {
    base.push(
      { label: "u/c em S′", value: params.u_over_c.toFixed(3) },
      { label: "v/c (S′ → S)", value: results.beta.toFixed(3) },
      { label: "(u+v)/c clássico", value: Math.max(-3, Math.min(3, params.u_over_c + results.beta)).toFixed(3) },
      { label: "u'/c relativístico", value: results.uPrimeOverC.toFixed(4), accent: true },
    );
  } else {
    base.push(
      { label: "D (ida)", value: `${params.travelDistanceLy.toFixed(2)} ly` },
      { label: "Tempo na Terra (ida+volta)", value: `${results.earthTimeYears.toFixed(2)} anos`, accent: true },
      { label: "Tempo do viajante", value: `${results.travelerTimeYears.toFixed(2)} anos`, accent: true },
      { label: "Diferença de idade", value: `${results.ageDifferenceYears.toFixed(2)} anos` },
    );
  }
  base.push({ label: "v = β·c", value: formatSI(results.beta * 299792458, "m/s", 3) });

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {base.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums text-right ${it.accent ? "text-primary font-semibold" : "text-foreground"}`}>{it.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
        γ cresce sem limite quando β → 1, mas Δt e L permanecem finitos para qualquer v &lt; c — a velocidade da luz é assimptota.
      </p>
    </div>
  );
};