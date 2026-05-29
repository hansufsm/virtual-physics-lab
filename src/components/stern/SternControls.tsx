import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { STERN_PRESETS, type SternParams } from "@/lib/physics";

interface Props { params: SternParams; onChange: (p: SternParams) => void }

export const SternControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<SternParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Átomo, gradiente magnético, temperatura do forno e geometria.</p>
      </div>

      <Section title="Átomo">
        <div className="grid grid-cols-1 gap-1.5">
          {STERN_PRESETS.map((s, i) => (
            <Button key={s.name} size="sm" variant={params.presetIndex === i ? "default" : "outline"}
              onClick={() => u({ presetIndex: i })}>{s.name} · {s.mass_amu.toFixed(2)} u</Button>
          ))}
        </div>
      </Section>

      <Section title="Gradiente ∂B/∂z">
        <Row label="dB/dz" value={`${params.gradient_T_per_m.toFixed(0)} T/m`}>
          <Slider value={[params.gradient_T_per_m]} min={0} max={5000} step={10}
            onValueChange={([v]) => u({ gradient_T_per_m: v })} />
        </Row>
      </Section>

      <Section title="Temperatura do forno">
        <Row label="T" value={`${params.ovenTemp_K.toFixed(0)} K`}>
          <Slider value={[params.ovenTemp_K]} min={300} max={2500} step={10}
            onValueChange={([v]) => u({ ovenTemp_K: v })} />
        </Row>
      </Section>

      <Section title="Geometria">
        <Row label="L ímã" value={`${(params.magnetLength_m*100).toFixed(1)} cm`}>
          <Slider value={[params.magnetLength_m]} min={0.02} max={0.5} step={0.005}
            onValueChange={([v]) => u({ magnetLength_m: v })} />
        </Row>
        <Row label="D deriva" value={`${(params.driftLength_m*100).toFixed(1)} cm`}>
          <Slider value={[params.driftLength_m]} min={0.05} max={2} step={0.01}
            onValueChange={([v]) => u({ driftLength_m: v })} />
        </Row>
      </Section>
    </div>
  );
};
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3 pb-3 border-b border-border last:border-0">
    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
    {children}
  </div>
);
const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);