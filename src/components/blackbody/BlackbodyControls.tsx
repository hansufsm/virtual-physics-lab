import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { BlackbodyParams } from "@/lib/physics";

interface Props { params: BlackbodyParams; onChange: (p: BlackbodyParams) => void }
const PRESETS = [
  { name: "CMB (2.7 K)", T: 2.725 },
  { name: "Corpo humano (310 K)", T: 310 },
  { name: "Filamento (3000 K)", T: 3000 },
  { name: "Sol (5778 K)", T: 5778 },
  { name: "Sirius (9940 K)", T: 9940 },
  { name: "Estrela O (30000 K)", T: 30000 },
];
export const BlackbodyControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<BlackbodyParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Temperatura e janela espectral.</p>
      </div>
      <Section title="Presets">
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p) => (
            <Button key={p.name} size="sm" variant={Math.abs(params.T_K - p.T) < 1 ? "default" : "outline"}
              onClick={() => u({ T_K: p.T })}>{p.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Temperatura T">
        <Row label="T" value={`${params.T_K.toFixed(0)} K`}>
          <Slider value={[Math.log10(params.T_K)]} min={0} max={4.7} step={0.01}
            onValueChange={([v]) => u({ T_K: Math.pow(10, v) })} />
        </Row>
      </Section>
      <Section title="Janela espectral (nm)">
        <Row label="λ min" value={`${params.lambdaMin_nm.toFixed(0)} nm`}>
          <Slider value={[Math.log10(params.lambdaMin_nm)]} min={1} max={6} step={0.01}
            onValueChange={([v]) => u({ lambdaMin_nm: Math.pow(10, v) })} />
        </Row>
        <Row label="λ max" value={`${params.lambdaMax_nm.toFixed(0)} nm`}>
          <Slider value={[Math.log10(params.lambdaMax_nm)]} min={1.5} max={7} step={0.01}
            onValueChange={([v]) => u({ lambdaMax_nm: Math.pow(10, v) })} />
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
