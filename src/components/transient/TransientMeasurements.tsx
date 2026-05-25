import { formatSI, type TransientParams, type TransientResults } from "@/lib/physics";

interface Props { params: TransientParams; results: TransientResults }

const REGIME_LABEL: Record<TransientResults["regime"], string> = {
  lr: "LR — exponencial pura",
  underdamped: "RLC subamortecido (ζ<1)",
  critical: "RLC criticamente amortecido (ζ=1)",
  overdamped: "RLC superamortecido (ζ>1)",
};

export const TransientMeasurements = ({ params, results }: Props) => {
  const items: { label: string; value: string; accent?: boolean }[] = [
    { label: "Regime", value: REGIME_LABEL[results.regime], accent: true },
    { label: "τ = L/R", value: formatSI(params.L / params.R, "s", 3) },
  ];
  if (params.mode === "LR") {
    items.push(
      { label: "I∞ = V₀/R", value: formatSI(results.steadyI, "A", 3), accent: true },
      { label: "5τ (≈ regime perm.)", value: formatSI(5 * (params.L / params.R), "s", 3) },
    );
  } else {
    items.push(
      { label: "ω₀ = 1/√(LC)", value: formatSI(results.omega0, "rad/s", 3) },
      { label: "f₀", value: formatSI(results.fNatural, "Hz", 3) },
      { label: "α = R/2L", value: formatSI(results.alpha, "1/s", 3) },
      { label: "ζ = α/ω₀", value: results.zeta.toFixed(3), accent: true },
      { label: "Q = ω₀L/R", value: results.Q.toFixed(3) },
    );
    if (results.regime === "underdamped") {
      items.push(
        { label: "ωd", value: formatSI(results.omegaD, "rad/s", 3) },
        { label: "fd", value: formatSI(results.fDamped, "Hz", 3) },
        { label: "Td", value: formatSI(2 * Math.PI / results.omegaD, "s", 3) },
      );
    } else if (results.regime === "overdamped") {
      items.push(
        { label: "s₁", value: formatSI(results.s1, "1/s", 3) },
        { label: "s₂", value: formatSI(results.s2, "1/s", 3) },
      );
    }
    items.push(
      { label: "Vc(∞)", value: formatSI(results.steadyVc, "V", 3) },
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
        Q alto ⇒ oscilação prolongada. ζ &lt; 1 produz oscilação amortecida; ζ &gt; 1, decaimento sem oscilar.
      </p>
    </div>
  );
};