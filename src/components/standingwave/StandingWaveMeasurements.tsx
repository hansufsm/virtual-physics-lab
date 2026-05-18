import type { StandingWaveResults } from "@/lib/physics";

interface Props { results: StandingWaveResults }

export const StandingWaveMeasurements = ({ results }: Props) => {
  const items = [
    { label: "Velocidade v", value: `${results.v.toFixed(2)} m/s`, accent: true },
    { label: "Frequência f", value: `${results.frequency.toFixed(2)} Hz`, accent: true },
    { label: "Período T", value: `${(results.period * 1000).toFixed(2)} ms` },
    { label: "Comprimento de onda λ", value: `${results.wavelength.toFixed(3)} m` },
    { label: "Número de onda k", value: `${results.k.toFixed(2)} rad/m` },
    { label: "ω", value: `${results.omega.toFixed(2)} rad/s` },
    { label: "Nós", value: `${results.nodes.length}` },
    { label: "Ventres", value: `${results.antinodes.length}` },
    { label: "Energia ⟨E⟩", value: `${results.energy.toExponential(2)} J`, accent: true },
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
    </div>
  );
};