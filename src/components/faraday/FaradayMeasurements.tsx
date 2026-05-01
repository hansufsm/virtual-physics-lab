import { formatSI } from "@/lib/physics";
import type { FaradayParams, FaradayState } from "@/lib/physics";

interface Props {
  params: FaradayParams;
  state: FaradayState;
}

export const FaradayMeasurements = ({ params, state }: Props) => {
  const items = [
    { label: params.mode === "loop" ? "Posição x" : "Posição z", value: formatSI(state.pos, "m", 3) },
    { label: "Velocidade", value: formatSI(state.vel, "m/s", 3) },
    { label: "Fluxo Φ (NΦ₁)", value: formatSI(state.flux, "Wb", 3) },
    { label: "f.e.m. ε", value: formatSI(state.emf, "V", 3), accent: true },
    { label: "Corrente i", value: formatSI(state.current, "A", 3) },
    { label: "Potência dissipada", value: formatSI(state.power, "W", 3) },
    { label: "Tempo", value: `${state.t.toFixed(2)} s` },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${it.accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};