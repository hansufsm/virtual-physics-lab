import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { FreefallParams } from "@/lib/physics";

interface Props { params: FreefallParams; onChange: (p: FreefallParams) => void }
export const FreefallControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<FreefallParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Parâmetros da queda livre.</p>
      </div>
      <Section title="Altura inicial h₀">
        <Row label="h₀" value={`${params.h0_m.toFixed(2)} m`}>
          <Slider value={[params.h0_m]} min={0.5} max={500} step={0.5} onValueChange={([v]) => u({ h0_m: v })} />
        </Row>
      </Section>
      <Section title="Velocidade inicial v₀ (↓+)">
        <Row label="v₀" value={`${params.v0_m_s.toFixed(2)} m/s`}>
          <Slider value={[params.v0_m_s]} min={-30} max={30} step={0.1} onValueChange={([v]) => u({ v0_m_s: v })} />
        </Row>
      </Section>
      <Section title="Massa">
        <Row label="m" value={`${params.mass_kg.toFixed(3)} kg`}>
          <Slider value={[params.mass_kg]} min={0.01} max={100} step={0.01} onValueChange={([v]) => u({ mass_kg: v })} />
        </Row>
      </Section>
      <Section title="Gravidade g">
        <Row label="g" value={`${params.g.toFixed(3)} m/s²`}>
          <Slider value={[params.g]} min={0.5} max={25} step={0.01} onValueChange={([v]) => u({ g: v })} />
        </Row>
        <div className="grid grid-cols-3 gap-1.5">
          <Button size="sm" variant="outline" onClick={() => u({ g: 9.81 })}>Terra</Button>
          <Button size="sm" variant="outline" onClick={() => u({ g: 1.62 })}>Lua</Button>
          <Button size="sm" variant="outline" onClick={() => u({ g: 3.71 })}>Marte</Button>
        </div>
      </Section>
      <Section title="Resistência do ar">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Ativar arrasto linear</Label>
          <Switch checked={params.drag} onCheckedChange={(v) => u({ drag: v })} />
        </div>
        <Row label="b" value={`${params.k_drag.toFixed(3)} N·s/m`}>
          <Slider value={[params.k_drag]} min={0} max={5} step={0.01} onValueChange={([v]) => u({ k_drag: v })} />
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