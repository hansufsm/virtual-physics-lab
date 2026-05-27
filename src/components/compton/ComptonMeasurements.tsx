import { formatSI, type ComptonParams, type ComptonResults } from "@/lib/physics";

interface Props { params: ComptonParams; results: ComptonResults }

export const ComptonMeasurements = ({ params, results }: Props) => {
  const items: { label: string; value: string; accent?: boolean }[] = [
    { label: "λ₀ (incidente)", value: formatSI(results.lambda0_m, "m", 3) },
    { label: "λ' (espalhado)", value: formatSI(results.lambdaPrime_m, "m", 3) },
    { label: "Δλ = λ_C(1−cos θ)", value: formatSI(results.deltaLambda_m, "m", 3), accent: true },
    { label: "E' do fóton", value: `${results.Eprime_keV.toFixed(2)} keV`, accent: true },
    { label: "E'/E₀", value: results.energyRatio.toFixed(4) },
    { label: "K do elétron", value: `${results.K_electron_keV.toFixed(2)} keV`, accent: true },
    { label: "Ângulo de recuo φ", value: `${results.recoilPhiDeg.toFixed(2)}°` },
    { label: "dσ/dΩ (Klein–Nishina)", value: `${results.kleinNishina.toFixed(4)} b/sr` },
  ];
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
        λ_C = h/(m_e c) ≈ 2.426 pm é o comprimento de onda Compton do elétron. Em θ = 180° (retroespalhamento), Δλ = 2λ_C.
      </p>
    </div>
  );
};