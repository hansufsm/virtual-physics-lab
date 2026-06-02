import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ForcedParams } from "@/lib/physics";

interface Props { params: ForcedParams; onChange: (p: ForcedParams) => void; omega0: number; omegaR: number }
export const ForcedControls = ({ params, onChange, omega0, omegaR }: Props) => {
  const u = (patch: Partial<ForcedParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Oscilador forçado com amortecimento.</p>
      </div>
      <Section title="Massa m">
        <Row label="m" value={`${params.mass_kg.toFixed(3)} kg`}>
          <Slider value={[params.mass_kg]} min={0.05} max={5} step={0.01} onValueChange={([v]) => u({ mass_kg: v })} />
        </Row>
      </Section>
      <Section title="Rigidez k">
        <Row label="k" value={`${params.k_N_per_m.toFixed(1)} N/m`}>
          <Slider value={[params.k_N_per_m]} min={1} max={500} step={1} onValueChange={([v]) => u({ k_N_per_m: v })} />
        </Row>
      </Section>
      <Section title="Amortecimento b">
        <Row label="b" value={`${params.b_N_s_per_m.toFixed(3)} N·s/m`}>
          <Slider value={[params.b_N_s_per_m]} min={0} max={20} step={0.05} onValueChange={([v]) => u({ b_N_s_per_m: v })} />
        </Row>
      </Section>
      <Section title="Amplitude da força F₀">
        <Row label="F₀" value={`${params.F0_N.toFixed(2)} N`}>
          <Slider value={[params.F0_N]} min={0.1} max={50} step={0.1} onValueChange={([v]) => u({ F0_N: v })} />
        </Row>
      </Section>
      <Section title="Frequência da força ω">
        <Row label="ω" value={`${params.driveOmega_rad_s.toFixed(3)} rad/s`}>
          <Slider value={[params.driveOmega_rad_s]} min={0.1} max={Math.max(50, omega0 * 3)} step={0.05} onValueChange={([v]) => u({ driveOmega_rad_s: v })} />
        </Row>
        <div className="grid grid-cols-3 gap-1.5">
          <Button size="sm" variant="outline" onClick={() => u({ driveOmega_rad_s: omega0 * 0.5 })}>½ω₀</Button>
          <Button size="sm" variant="outline" onClick={() => u({ driveOmega_rad_s: omegaR || omega0 })}>ω_r</Button>
          <Button size="sm" variant="outline" onClick={() => u({ driveOmega_rad_s: omega0 * 2 })}>2ω₀</Button>
        </div>
      </Section>
      <Section title="Duração">
        <Row label="t_max" value={`${params.duration_s.toFixed(1)} s`}>
          <Slider value={[params.duration_s]} min={1} max={30} step={0.5} onValueChange={([v]) => u({ duration_s: v })} />
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