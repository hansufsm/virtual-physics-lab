import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { TunnelParams } from "@/lib/physics";

interface Props { params: TunnelParams; onChange: (p: TunnelParams) => void }
const PRESETS = [
  { name: "STM (elétron)", V0: 5, a: 0.5, E: 4, m: 1 },
  { name: "Diodo túnel",    V0: 0.3, a: 5,  E: 0.2, m: 0.067 },
  { name: "Decaimento α",   V0: 30, a: 20, E: 5,   m: 7300 },
];
export const TunnelControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<TunnelParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Barreira retangular e partícula incidente.</p>
      </div>
      <Section title="Presets">
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p) => (
            <Button key={p.name} size="sm" variant="outline"
              onClick={() => onChange({ V0_eV: p.V0, a_nm: p.a, E_eV: p.E, mass_me: p.m })}>{p.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Altura V₀ da barreira">
        <Row label="V₀" value={`${params.V0_eV.toFixed(3)} eV`}>
          <Slider value={[Math.log10(Math.max(params.V0_eV, 1e-3))]} min={-3} max={2.5} step={0.01}
            onValueChange={([v]) => u({ V0_eV: Math.pow(10, v) })} />
        </Row>
      </Section>
      <Section title="Largura a">
        <Row label="a" value={`${params.a_nm.toFixed(3)} nm`}>
          <Slider value={[Math.log10(Math.max(params.a_nm, 1e-2))]} min={-2} max={1.5} step={0.01}
            onValueChange={([v]) => u({ a_nm: Math.pow(10, v) })} />
        </Row>
      </Section>
      <Section title="Energia E da partícula">
        <Row label="E" value={`${params.E_eV.toFixed(3)} eV`}>
          <Slider value={[params.E_eV]} min={0.01} max={Math.max(params.V0_eV * 2.5, 1)} step={0.01}
            onValueChange={([v]) => u({ E_eV: v })} />
        </Row>
        <div className="grid grid-cols-3 gap-1.5">
          {[0.25, 0.5, 1.5].map((f) => (
            <Button key={f} size="sm" variant="outline" onClick={() => u({ E_eV: params.V0_eV * f })}>
              {f}·V₀
            </Button>
          ))}
        </div>
      </Section>
      <Section title="Massa (em m_e)">
        <Row label="m/m_e" value={params.mass_me < 1 ? params.mass_me.toFixed(3) : params.mass_me.toFixed(1)}>
          <Slider value={[Math.log10(params.mass_me)]} min={-2} max={4} step={0.01}
            onValueChange={([v]) => u({ mass_me: Math.pow(10, v) })} />
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
