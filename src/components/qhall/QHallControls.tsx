import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { QHallParams } from "@/lib/physics";

interface Props { params: QHallParams; onChange: (p: QHallParams) => void }

export const QHallControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<QHallParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">2DEG: densidade superficial, campo, corrente e temperatura.</p>
      </div>
      <Section title="Densidade 2D nₛ">
        <Row label="nₛ" value={`${(params.density_per_m2/1e15).toFixed(2)} ·10¹⁵ m⁻²`}>
          <Slider value={[params.density_per_m2/1e15]} min={0.5} max={20} step={0.05}
            onValueChange={([v]) => u({ density_per_m2: v * 1e15 })} />
        </Row>
      </Section>
      <Section title="Campo magnético B">
        <Row label="B" value={`${params.B_T.toFixed(2)} T`}>
          <Slider value={[params.B_T]} min={0.1} max={20} step={0.05}
            onValueChange={([v]) => u({ B_T: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 5, 10, 15].map((b) => (
            <Button key={b} size="sm" variant="outline" onClick={() => u({ B_T: b })}>{b} T</Button>
          ))}
        </div>
      </Section>
      <Section title="Corrente">
        <Row label="I" value={`${params.current_uA.toFixed(2)} µA`}>
          <Slider value={[params.current_uA]} min={0.01} max={10} step={0.01}
            onValueChange={([v]) => u({ current_uA: v })} />
        </Row>
      </Section>
      <Section title="Temperatura">
        <Row label="T" value={`${params.temperature_K.toFixed(2)} K`}>
          <Slider value={[params.temperature_K]} min={0.05} max={20} step={0.05}
            onValueChange={([v]) => u({ temperature_K: v })} />
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