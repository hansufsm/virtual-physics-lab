import { formatSI } from "@/lib/physics";
import type { RCParams, RCResults } from "@/lib/physics";

interface Props {
  params: RCParams;
  results: RCResults;
  t: number;
  vc: number;
  ic: number;
}

export const RCMeasurements = ({ params, results, t, vc, ic }: Props) => {
  const energy = 0.5 * results.cFarad * vc * vc;
  const ratio = params.mode === "charge" && params.emf !== 0
    ? vc / params.emf
    : params.v0 !== 0 ? vc / params.v0 : 0;

  const items = [
    { label: "τ = R·C", value: formatSI(results.tau, "s", 3), accent: true },
    { label: "Tempo decorrido", value: formatSI(t, "s", 2) },
    { label: "t / τ", value: results.tau > 0 ? (t / results.tau).toFixed(2) : "—" },
    { label: "Vc(t)", value: `${vc.toFixed(3)} V` },
    { label: "i(t)", value: formatSI(ic, "A", 3) },
    { label: "Vc / V∞", value: `${(ratio * 100).toFixed(1)} %` },
    { label: "Energia U(t)", value: formatSI(energy, "J", 3) },
    { label: "Carga q(t)", value: formatSI(results.cFarad * vc, "C", 3) },
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