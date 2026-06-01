import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { InclineParams } from "@/lib/physics";

interface Props { params: InclineParams; onChange: (p: InclineParams) => void }
const SURF = [
  { name: "Sem atrito", mu_s: 0, mu_k: 0 },
  { name: "Gelo", mu_s: 0.10, mu_k: 0.03 },
  { name: "Madeira", mu_s: 0.45, mu_k: 0.30 },
  { name: "Borracha", mu_s: 1.0, mu_k: 0.8 },
];
export const InclineControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<InclineParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Plano inclinado com atrito.</p>
      </div>
      <Section title="Superfície (presets)">
        <div className="grid grid-cols-2 gap-1.5">
          {SURF.map((s) => (
            <Button key={s.name} size="sm" variant="outline" onClick={() => u({ mu_s: s.mu_s, mu_k: s.mu_k })}>{s.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Ângulo θ">
        <Row label="θ" value={`${params.angle_deg.toFixed(1)}°`}>
          <Slider value={[params.angle_deg]} min={0} max={80} step={0.5} onValueChange={([v]) => u({ angle_deg: v })} />
        </Row>
      </Section>
      <Section title="Massa m">
        <Row label="m" value={`${params.mass_kg.toFixed(2)} kg`}>
          <Slider value={[params.mass_kg]} min={0.1} max={50} step={0.1} onValueChange={([v]) => u({ mass_kg: v })} />
        </Row>
      </Section>
      <Section title="Atrito estático μ_s">
        <Row label="μ_s" value={params.mu_s.toFixed(3)}>
          <Slider value={[params.mu_s]} min={0} max={1.5} step={0.01} onValueChange={([v]) => u({ mu_s: v })} />
        </Row>
      </Section>
      <Section title="Atrito cinético μ_k">
        <Row label="μ_k" value={params.mu_k.toFixed(3)}>
          <Slider value={[params.mu_k]} min={0} max={1.5} step={0.01} onValueChange={([v]) => u({ mu_k: v })} />
        </Row>
      </Section>
      <Section title="Comprimento L do plano">
        <Row label="L" value={`${params.length_m.toFixed(2)} m`}>
          <Slider value={[params.length_m]} min={0.5} max={20} step={0.1} onValueChange={([v]) => u({ length_m: v })} />
        </Row>
      </Section>
      <Section title="Gravidade">
        <Row label="g" value={`${params.g.toFixed(2)} m/s²`}>
          <Slider value={[params.g]} min={0.5} max={25} step={0.01} onValueChange={([v]) => u({ g: v })} />
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