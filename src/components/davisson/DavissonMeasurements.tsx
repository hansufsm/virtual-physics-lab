import type { DavissonParams, DavissonResults } from "@/lib/physics";

interface Props { params: DavissonParams; results: DavissonResults }

export const DavissonMeasurements = ({ params, results }: Props) => {
  const items = [
    { label: "Cristal", value: results.preset.name, accent: true },
    { label: "Espaçamento d", value: `${results.preset.d_nm.toFixed(3)} nm` },
    { label: "V", value: `${params.voltage_V.toFixed(1)} V` },
    { label: "Energia E", value: `${results.energy_eV.toFixed(2)} eV` },
    { label: "λ de Broglie", value: `${results.lambda_nm.toFixed(4)} nm`, accent: true },
    { label: "Momento p", value: `${(results.momentum_kgms*1e24).toFixed(3)} ·10⁻²⁴ kg·m/s` },
    { label: "Picos observáveis", value: `${results.peaks.length}`, accent: true },
    { label: "1º pico (n=1)", value: results.peaks[0] ? `φ = ${results.peaks[0].phi_deg.toFixed(2)}°` : "—" },
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