import type { CollisionResults } from "@/lib/physics";

interface Props { results: CollisionResults }

export const CollisionMeasurements = ({ results }: Props) => {
  const dp = results.p_after - results.p_before;
  const items = [
    { label: "v₁ (após)", value: `${results.v1.toFixed(3)} m/s`, accent: true },
    { label: "v₂ (após)", value: `${results.v2.toFixed(3)} m/s`, accent: true },
    { label: "v_cm", value: `${results.vcm.toFixed(3)} m/s` },
    { label: "p (antes)", value: `${results.p_before.toFixed(3)} kg·m/s` },
    { label: "p (depois)", value: `${results.p_after.toFixed(3)} kg·m/s` },
    { label: "Δp (numérico)", value: `${dp.toExponential(2)} kg·m/s` },
    { label: "K (antes)", value: `${results.ke_before.toFixed(3)} J` },
    { label: "K (depois)", value: `${results.ke_after.toFixed(3)} J` },
    { label: "Energia dissipada", value: `${results.ke_lost.toFixed(3)} J`, accent: true },
    { label: "Impulso J = Δp₁", value: `${results.impulse.toFixed(3)} N·s` },
    { label: "Instante de colisão", value: results.collisionTime !== null ? `${results.collisionTime.toFixed(3)} s` : "sem contato" },
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