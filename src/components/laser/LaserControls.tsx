import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { LaserParams } from "@/lib/physics";

interface Props { params: LaserParams; onChange: (p: LaserParams) => void }

const PRESETS = [
  { name: "HeNe (633 nm)", lambda: 632.8, BW: 1.5 },
  { name: "Nd:YAG (1064 nm)", lambda: 1064, BW: 120 },
  { name: "Diodo (780 nm)", lambda: 780, BW: 500 },
  { name: "Ti:Sa (800 nm)", lambda: 800, BW: 1e5 },
];

export const LaserControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<LaserParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Cavidade, espelhos e bombeamento.</p>
      </div>
      <Section title="Meio ativo / λ">
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p) => (
            <Button key={p.name} size="sm" variant={Math.abs(params.lambda_nm - p.lambda) < 0.5 ? "default" : "outline"}
              onClick={() => u({ lambda_nm: p.lambda, gainBW_GHz: p.BW })}>{p.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Comprimento da cavidade L">
        <Row label="L" value={`${params.L_mm.toFixed(0)} mm`}>
          <Slider value={[params.L_mm]} min={5} max={2000} step={1}
            onValueChange={([v]) => u({ L_mm: v })} />
        </Row>
      </Section>
      <Section title="Refletividades">
        <Row label="R₁ (HR)" value={params.R1.toFixed(3)}>
          <Slider value={[params.R1]} min={0.80} max={0.9999} step={0.0005}
            onValueChange={([v]) => u({ R1: v })} />
        </Row>
        <Row label="R₂ (OC)" value={params.R2.toFixed(3)}>
          <Slider value={[params.R2]} min={0.50} max={0.999} step={0.001}
            onValueChange={([v]) => u({ R2: v })} />
        </Row>
      </Section>
      <Section title="Largura do ganho">
        <Row label="Δν_g" value={`${params.gainBW_GHz.toFixed(2)} GHz`}>
          <Slider value={[Math.log10(params.gainBW_GHz)]} min={-1} max={6} step={0.01}
            onValueChange={([v]) => u({ gainBW_GHz: Math.pow(10, v) })} />
        </Row>
      </Section>
      <Section title="Bombeamento (×limiar)">
        <Row label="P/P_th" value={params.pump_ratio.toFixed(2)}>
          <Slider value={[params.pump_ratio]} min={0.2} max={5} step={0.05}
            onValueChange={([v]) => u({ pump_ratio: v })} />
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