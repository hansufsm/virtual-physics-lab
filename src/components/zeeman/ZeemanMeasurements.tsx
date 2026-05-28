import type { ZeemanParams, ZeemanResults } from "@/lib/physics";

interface Props { params: ZeemanParams; results: ZeemanResults }

export const ZeemanMeasurements = ({ params, results }: Props) => {
  const maxShift = results.lines.reduce((a, l) => Math.max(a, Math.abs(l.wavelengthShift_pm)), 0);
  const maxNu = results.lines.reduce((a, l) => Math.max(a, Math.abs(l.frequencyShift_GHz)), 0);
  const items = [
    { label: "Tipo de efeito", value: results.type, accent: true },
    { label: "λ₀", value: `${results.preset.lambda0_nm.toFixed(3)} nm` },
    { label: "ν₀", value: `${results.nu0_THz.toFixed(2)} THz` },
    { label: "B", value: `${params.B_T.toFixed(3)} T` },
    { label: "g_J superior", value: results.gU.toFixed(4), accent: true },
    { label: "g_J inferior", value: results.gL.toFixed(4), accent: true },
    { label: "Sublíneas (2J+1) sup.", value: `${results.totalSubU}` },
    { label: "Sublíneas (2J+1) inf.", value: `${results.totalSubL}` },
    { label: "Componentes visíveis", value: `${results.lines.length}`, accent: true },
    { label: "|Δλ| máximo", value: `${maxShift.toFixed(4)} pm`, accent: true },
    { label: "|Δν| máximo", value: `${maxNu.toFixed(2)} GHz` },
    { label: "μ_B · B", value: `${(results.muB_eVT * params.B_T * 1e6).toFixed(3)} μeV` },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${(it as any).accent ? "text-primary font-semibold" : "text-foreground"}`}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};