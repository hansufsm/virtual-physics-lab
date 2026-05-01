import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { TransformerParams } from "@/lib/physics";

interface Props {
  params: TransformerParams;
  onChange: (p: TransformerParams) => void;
}

export const TransformerControls = ({ params, onChange }: Props) => {
  const update = (patch: Partial<TransformerParams>) => onChange({ ...params, ...patch });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure enrolamentos e carga.</p>
      </div>

      <Row label="Tensão V₁ (eficaz)" value={`${params.vPrimaryRms.toFixed(1)} V`}>
        <Slider value={[params.vPrimaryRms]} min={1} max={400} step={1}
          onValueChange={([v]) => update({ vPrimaryRms: v })} />
      </Row>

      <Row label="Frequência" value={`${params.freqHz.toFixed(0)} Hz`}>
        <Slider value={[params.freqHz]} min={10} max={400} step={1}
          onValueChange={([v]) => update({ freqHz: v })} />
      </Row>

      <Row label="Espiras N₁" value={`${Math.round(params.n1)}`}>
        <Slider value={[Math.log10(Math.max(1, params.n1))]} min={1} max={4} step={0.02}
          onValueChange={([v]) => update({ n1: Math.round(Math.pow(10, v)) })} />
      </Row>

      <Row label="Espiras N₂" value={`${Math.round(params.n2)}`}>
        <Slider value={[Math.log10(Math.max(1, params.n2))]} min={1} max={4} step={0.02}
          onValueChange={([v]) => update({ n2: Math.round(Math.pow(10, v)) })} />
      </Row>

      <Row label="Carga R_L" value={`${params.loadOhm.toFixed(2)} Ω`}>
        <Slider value={[Math.log10(Math.max(0.01, params.loadOhm))]} min={-1} max={4} step={0.02}
          onValueChange={([v]) => update({ loadOhm: Math.pow(10, v) })} />
      </Row>

      <Row label="Acoplamento k" value={`${params.coupling.toFixed(3)}`}>
        <Slider value={[params.coupling]} min={0} max={1} step={0.005}
          onValueChange={([v]) => update({ coupling: v })} />
      </Row>

      <Row label="Resistência R₁ (primário)" value={`${params.r1Ohm.toFixed(2)} Ω`}>
        <Slider value={[Math.log10(Math.max(0.001, params.r1Ohm))]} min={-3} max={2} step={0.02}
          onValueChange={([v]) => update({ r1Ohm: Math.pow(10, v) })} />
      </Row>

      <Row label="Resistência R₂ (secundário)" value={`${params.r2Ohm.toFixed(2)} Ω`}>
        <Slider value={[Math.log10(Math.max(0.001, params.r2Ohm))]} min={-3} max={2} step={0.02}
          onValueChange={([v]) => update({ r2Ohm: Math.pow(10, v) })} />
      </Row>
    </div>
  );
};

const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);