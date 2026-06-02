import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { BeatsParams } from "@/lib/physics";

interface Props { params: BeatsParams; onChange: (p: BeatsParams) => void }
export const BeatsControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<BeatsParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Soma de dois MHS com frequências próximas.</p>
      </div>
      <Section title="Frequência f₁">
        <Row label="f₁" value={`${params.f1_Hz.toFixed(2)} Hz`}>
          <Slider value={[params.f1_Hz]} min={0.5} max={50} step={0.1} onValueChange={([v]) => u({ f1_Hz: v })} />
        </Row>
      </Section>
      <Section title="Frequência f₂">
        <Row label="f₂" value={`${params.f2_Hz.toFixed(2)} Hz`}>
          <Slider value={[params.f2_Hz]} min={0.5} max={50} step={0.1} onValueChange={([v]) => u({ f2_Hz: v })} />
        </Row>
      </Section>
      <Section title="Amplitude A">
        <Row label="A" value={`${params.A_m.toFixed(2)} m`}>
          <Slider value={[params.A_m]} min={0.05} max={2} step={0.05} onValueChange={([v]) => u({ A_m: v })} />
        </Row>
      </Section>
      <Section title="Duração">
        <Row label="T" value={`${params.duration_s.toFixed(2)} s`}>
          <Slider value={[params.duration_s]} min={0.5} max={10} step={0.1} onValueChange={([v]) => u({ duration_s: v })} />
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