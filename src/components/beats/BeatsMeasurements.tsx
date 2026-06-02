import type { BeatsResults } from "@/lib/physics";
export const BeatsMeasurements = ({ results }: { results: BeatsResults }) => {
  const items = [
    { label: "f_batimento = |f₁−f₂|", value: `${results.fBeat_Hz.toFixed(3)} Hz`, accent: true },
    { label: "f̄ = (f₁+f₂)/2", value: `${results.fAvg_Hz.toFixed(3)} Hz`, accent: true },
    { label: "Período do batimento T_b", value: isFinite(results.Tbeat_s) ? `${results.Tbeat_s.toFixed(3)} s` : "∞" },
    { label: "Entre nós ½T_b", value: isFinite(results.TenvHalf_s) ? `${results.TenvHalf_s.toFixed(3)} s` : "∞" },
    { label: "Amplitude máxima 2A", value: `${results.Amax_m.toFixed(3)} m`, accent: true },
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