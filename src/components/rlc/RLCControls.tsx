import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { computeRLC, type RLCParams } from "@/lib/physics";

interface Props {
  params: RLCParams;
  onChange: (p: RLCParams) => void;
}

export const RLCControls = ({ params, onChange }: Props) => {
  const update = (patch: Partial<RLCParams>) => onChange({ ...params, ...patch });
  const r = computeRLC(params);

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure a fonte AC e os componentes R, L, C em série.</p>
      </div>

      <Row label="Tensão da fonte (Vrms)" value={`${params.vSourceRms.toFixed(1)} V`}>
        <Slider value={[params.vSourceRms]} min={1} max={50} step={0.5}
          onValueChange={([v]) => update({ vSourceRms: v })} />
      </Row>

      <Row label="Frequência" value={`${params.freqHz.toFixed(1)} Hz`}>
        <Slider
          value={[Math.log10(Math.max(1, params.freqHz))]}
          min={1} max={5} step={0.005}
          onValueChange={([v]) => update({ freqHz: +Math.pow(10, v).toFixed(2) })}
        />
      </Row>

      <Row label="Resistência R" value={`${params.resistanceOhm.toFixed(2)} Ω`}>
        <Slider value={[Math.log10(Math.max(0.1, params.resistanceOhm))]} min={-1} max={4} step={0.02}
          onValueChange={([v]) => update({ resistanceOhm: +Math.pow(10, v).toFixed(3) })} />
      </Row>

      <Row label="Indutância L" value={`${params.inductanceMh.toFixed(2)} mH`}>
        <Slider value={[Math.log10(Math.max(0.01, params.inductanceMh))]} min={-2} max={4} step={0.02}
          onValueChange={([v]) => update({ inductanceMh: +Math.pow(10, v).toFixed(3) })} />
      </Row>

      <Row label="Capacitância C" value={`${params.capacitanceUf.toFixed(3)} µF`}>
        <Slider value={[Math.log10(Math.max(0.001, params.capacitanceUf))]} min={-3} max={3} step={0.02}
          onValueChange={([v]) => update({ capacitanceUf: +Math.pow(10, v).toFixed(4) })} />
      </Row>

      <div className="pt-2 border-t border-border">
        <Button
          variant="outline" size="sm" className="w-full"
          onClick={() => update({ freqHz: +r.f0.toFixed(2) })}
        >
          Sintonizar em f₀ = {r.f0.toFixed(2)} Hz
        </Button>
      </div>
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