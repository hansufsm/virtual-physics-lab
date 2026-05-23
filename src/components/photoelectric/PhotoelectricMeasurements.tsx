import { formatSI, type PhotoelectricParams, type PhotoelectricResults } from "@/lib/physics";

interface Props { params: PhotoelectricParams; results: PhotoelectricResults }

export const PhotoelectricMeasurements = ({ params, results }: Props) => {
  const items = [
    { label: "Energia do fóton", value: `${results.photonEnergyEv.toFixed(3)} eV`, accent: true },
    { label: "Frequência f", value: `${(results.frequencyHz / 1e14).toFixed(3)} ×10¹⁴ Hz` },
    { label: "f₀ (limiar)", value: `${(results.thresholdFreqHz / 1e14).toFixed(3)} ×10¹⁴ Hz` },
    { label: "λ₀ (limiar)", value: `${results.thresholdWavelengthNm.toFixed(0)} nm` },
    { label: "Emite elétrons?", value: results.emits ? "Sim" : "Não", accent: true },
    { label: "K_máx", value: `${results.kMaxEv.toFixed(3)} eV` },
    { label: "v_máx", value: results.emits ? `${(results.vMaxMs / 1e5).toFixed(2)} ×10⁵ m/s` : "—" },
    { label: "V_s (frenagem)", value: `${results.stoppingVoltage.toFixed(3)} V`, accent: true },
    { label: "Fluxo de fótons", value: `${formatSI(results.photonFlux, "fót/s", 2)}` },
    { label: "I_saturação", value: formatSI(results.saturationCurrent, "A", 2) },
    { label: `I @ V = ${params.voltage.toFixed(2)} V`, value: formatSI(results.current, "A", 2), accent: true },
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
        h = 6.626 ×10⁻³⁴ J·s · e = 1.602 ×10⁻¹⁹ C · φ = {params.phiEv.toFixed(2)} eV ({params.materialName}).
      </p>
    </div>
  );
};